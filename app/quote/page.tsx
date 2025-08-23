"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  Users, 
  Calendar, 
  Loader2, 
  CheckCircle,
  ArrowRight,
  Star,
  ArrowLeft,
  ChevronRight,
  Upload,
  X,
  FileText,
  Baby,
  User
} from "lucide-react";
import { toast } from "sonner";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadMultipleFiles, validateFileSize, validateFileType, FileUploadResult } from "@/lib/storage";
import Link from "next/link";
import { commonClasses } from "@/lib/design-system";

export default function QuotePage() {
  const { isAuthenticated, user, logout } = useLocalAuth();
  const { quoteSubmitted } = useNotifications();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    destination: '',
    duration: '',
    adults: '',
    children: '',
    infants: '',
    budget: '',
    travelDate: '',
    specialRequests: '',
    phone: '',
    email: user?.email || '',
    name: user?.name || user?.nickname || '',
    preferredAirline: '',
    hotelGrade: '',
    attachedFiles: [] as File[]
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.destination || !formData.duration || (!formData.adults && !formData.children && !formData.infants)) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (!formData.email && !formData.phone) {
      toast.error('이메일 또는 전화번호를 입력해주세요.');
      return;
    }

    if (!formData.name) {
      toast.error('이름을 입력해주세요.');
      return;
    }

    setLoading(true);
    
    try {
      const { attachedFiles, ...formDataWithoutFiles } = formData;
      let uploadedFiles: FileUploadResult[] = [];
      
      // Firebase가 설정되어 있으면 정상 처리
      if (db && storage) {
        // 파일이 있으면 업로드
        if (attachedFiles.length > 0) {
          setUploadingFiles(true);
          toast.info(`${attachedFiles.length}개 파일을 업로드하는 중...`);
          
          try {
            uploadedFiles = await uploadMultipleFiles(
              attachedFiles, 
              `quotes/${user?.id || 'anonymous'}`,
              (progress, fileName) => {
                setUploadProgress(progress);
                if (progress === 100) {
                  console.log(`✅ ${fileName} 업로드 완료`);
                }
              }
            );
            
            toast.success(`${uploadedFiles.length}개 파일 업로드 완료!`);
          } catch (uploadError) {
            console.error('파일 업로드 실패:', uploadError);
            toast.error('파일 업로드 중 오류가 발생했습니다.');
            setLoading(false);
            setUploadingFiles(false);
            return;
          } finally {
            setUploadingFiles(false);
            setUploadProgress(0);
          }
        }

        // Firestore에 저장할 데이터 준비
        const quoteData = {
          ...formDataWithoutFiles,
          attachedFiles: uploadedFiles,
          userId: user?.id || 'anonymous',
          userName: formData.name || user?.name || user?.nickname || '익명',
          userEmail: formData.email || user?.email || '',
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        const quotesCollection = collection(db, 'quotes');
        const quoteRef = await addDoc(quotesCollection, quoteData);
        
        // 견적 제출 알림 (푸시 + 이메일)
        if (formData.email) {
          try {
            await quoteSubmitted(
              formData.email,
              formData.name || user?.name || user?.nickname || '고객님',
              user?.id || quoteRef.id
            );
          } catch (error) {
            console.error('알림 전송 실패:', error);
          }
        }
      } else {
        // Firebase가 없을 때는 로컬 저장소 또는 콘솔에 임시 저장
        console.log('🔥 Firebase가 설정되지 않음 - 임시 견적 데이터:', {
          ...formDataWithoutFiles,
          attachedFiles: attachedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
          userId: user?.id || 'anonymous',
          userName: formData.name || user?.name || user?.nickname || '익명',
          userEmail: formData.email || user?.email || '',
          status: 'pending',
          createdAt: new Date().toISOString()
        });
        
        // 로컬 저장소에 임시 저장
        const tempQuoteData = {
          id: `temp_${Date.now()}`,
          ...formDataWithoutFiles,
          attachedFiles: attachedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
          userId: user?.id || 'anonymous',
          userName: formData.name || user?.name || user?.nickname || '익명',
          userEmail: formData.email || user?.email || '',
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        
        // 로컬 저장소에 저장 (관리자가 확인할 수 있도록)
        const existingQuotes = JSON.parse(localStorage.getItem('tempQuotes') || '[]');
        existingQuotes.push(tempQuoteData);
        localStorage.setItem('tempQuotes', JSON.stringify(existingQuotes));
        
        toast.success('견적 요청이 임시 저장되었습니다. (Firebase 설정 후 정상 처리됩니다)');
      }
      
      toast.success('견적 요청이 성공적으로 제출되었습니다!');
      setSubmitted(true);
    } catch (error) {
      console.error('견적 요청 실패:', error);
      toast.error('견적 요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => {
      if (!validateFileSize(file, 10)) {
        toast.error(`${file.name}은(는) 파일 크기가 너무 큽니다. (최대 10MB)`);
        return false;
      }
      
      const allowedTypes = [
        // 이미지 파일
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        // 문서 파일
        'application/pdf',
        // MS Word
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        // MS PowerPoint
        'application/vnd.ms-powerpoint', // .ppt
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
        // HWP 파일 (한글 파일)
        'application/x-hwp', 'application/haansofthwp', 'application/vnd.hancom.hwp',
        // 기타
        'text/plain'
      ];
      
      const fileExtension = file.name.toLowerCase().split('.').pop();
      const isValidByExtension = ['hwp', 'doc', 'docx', 'ppt', 'pptx', 'pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'txt'].includes(fileExtension || '');
      
      if (!validateFileType(file, allowedTypes) && !isValidByExtension) {
        toast.error(`${file.name}은(는) 지원하지 않는 파일 형식입니다.\n\n지원 형식: HWP, DOC, DOCX, PPT, PPTX, PDF, JPG, PNG, GIF, WEBP, TXT`);
        return false;
      }
      
      return true;
    });

    if (newFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        attachedFiles: [...prev.attachedFiles, ...newFiles]
      }));
      toast.success(`${newFiles.length}개 파일이 추가되었습니다.`);
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachedFiles: prev.attachedFiles.filter((_, i) => i !== index)
    }));
  };

  const handleComplete = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
          <div className={commonClasses.container}>
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-purple-600 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-500 to-purple-600 bg-clip-text text-transparent">
                    K-BIZ TRAVEL
                  </div>
                  <div className="text-sm text-gray-500">동남아 특화 맞춤여행</div>
                </div>
              </Link>
              
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">회사소개</Link>
                <Link href="/quote" className="text-blue-600 hover:text-blue-700 transition-colors font-medium border-b-2 border-blue-600">견적 요청</Link>
                <Link href="/reviews" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">여행 후기</Link>
                <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">관리자</Link>
              </nav>

              <div className="flex items-center space-x-4">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">
                          {user.nickname?.charAt(0) || user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="text-gray-700 font-medium">
                        {user.nickname || user.name || user.email?.split('@')[0]}님
                      </span>
                    </div>
                    <Button 
                      onClick={() => {
                        if (confirm('로그아웃 하시겠습니까?')) {
                          logout();
                          alert('로그아웃되었습니다.');
                        }
                      }}
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50 font-medium"
                    >
                      로그아웃
                    </Button>
                  </>
                ) : (
                  <Link href="/login">
                    <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 font-medium">
                      로그인
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="py-16 bg-gradient-to-br from-emerald-50/30 via-teal-50/20 to-purple-50/30">
          <div className={commonClasses.container}>
            <div className="max-w-2xl mx-auto text-center">
              <Card className="bg-white shadow-2xl border-0">
                <CardContent className="p-12">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    견적 요청이 완료되었습니다!
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    K-BIZ TRAVEL 전문 여행 플래너가 24시간 내에<br />
                    맞춤 견적을 보내드립니다.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={handleComplete}
                      size="lg" 
                      variant="outline" 
                      className="px-8 py-3 border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      {isAuthenticated ? '대시보드로 이동' : '홈으로 돌아가기'}
                    </Button>
                                          {isAuthenticated && (
                      <Link href="/dashboard">
                        <Button size="lg" className="px-8 py-3 bg-gradient-to-r from-emerald-500 via-teal-600 to-purple-700 hover:from-emerald-600 hover:via-teal-700 hover:to-purple-800">
                          내 견적 확인하기
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className={commonClasses.container}>
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  K-BIZ TRAVEL
                </div>
                <div className="text-sm text-gray-500">동남아 특화 맞춤여행</div>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">회사소개</Link>
              <Link href="/quote" className="text-blue-600 hover:text-blue-700 transition-colors font-medium border-b-2 border-blue-600">견적 요청</Link>
              <Link href="/reviews" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">여행 후기</Link>
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">관리자</Link>
            </nav>

            <div className="flex items-center space-x-4">
                              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">
                        {user.nickname?.charAt(0) || user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="text-gray-700 font-medium">
                      {user.nickname || user.name || user.email?.split('@')[0]}님
                    </span>
                  </div>
                  <Button 
                    onClick={() => {
                      if (confirm('로그아웃 하시겠습니까?')) {
                        logout();
                        alert('로그아웃되었습니다.');
                      }
                    }}
                    variant="outline" 
                    className="border-red-200 text-red-600 hover:bg-red-50 font-medium"
                  >
                    로그아웃
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 font-medium">
                    로그인
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="py-16 bg-gradient-to-br from-emerald-50/30 via-teal-50/20 to-purple-50/30">
        <div className={commonClasses.container}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-6 bg-emerald-100 text-emerald-700 px-4 py-2 text-sm font-medium">
                ✈️ 맞춤 견적 요청
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-purple-600 bg-clip-text text-transparent">
                  나만의 특별한 여행
                </span>
                <br />
                계획을 세워보세요
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                단계별로 정보를 입력하시면 K-BIZ TRAVEL 전문가들이<br />
                최적의 맞춤 견적을 제공해드립니다.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-center mb-12">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-200'
                    }`}>
                      <MapPin className={`w-6 h-6 ${currentStep >= 1 ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <span className={`ml-3 font-medium ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                      여행 정보
                    </span>
                  </div>
                  
                  <div className={`w-20 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
                    }`}>
                      <Star className={`w-6 h-6 ${currentStep >= 2 ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <span className={`ml-3 font-medium ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                      선호사항
                    </span>
                  </div>
                  
                  <div className={`w-20 h-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'
                    }`}>
                      <Users className={`w-6 h-6 ${currentStep >= 3 ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <span className={`ml-3 font-medium ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                      연락처
                    </span>
                  </div>
                </div>
              </div>

              {currentStep === 1 && (
                <Card className="bg-white shadow-2xl border-0">
                  <CardHeader className="text-center pb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <MapPin className="w-10 h-10 text-blue-600" />
                    </div>
                    <CardTitle className="text-3xl text-gray-900 mb-4">여행 기본 정보</CardTitle>
                    <p className="text-gray-600 text-lg">여행하고 싶은 기본 정보를 알려주세요</p>
                  </CardHeader>
                  <CardContent className="space-y-8 pb-12">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          여행지 <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={formData.destination}
                          onChange={(e) => handleInputChange('destination', e.target.value)}
                          placeholder="예: 태국 방콕, 베트남 다낭, 인도네시아 발리"
                          className="h-14 text-lg border-gray-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          여행 기간 <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={formData.duration}
                          onChange={(e) => handleInputChange('duration', e.target.value)}
                          placeholder="예: 4박 5일, 5박 6일"
                          className="h-14 text-lg border-gray-200"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        여행 인원 <span className="text-red-500">*</span>
                      </label>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <User className="w-8 h-8 text-blue-600" />
                          </div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">성인</label>
                          <Input
                            type="number"
                            value={formData.adults}
                            onChange={(e) => handleInputChange('adults', e.target.value)}
                            placeholder="0"
                            className="h-12 text-center border-gray-200"
                            min="0"
                          />
                        </div>
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Users className="w-8 h-8 text-green-600" />
                          </div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">아동 (만 12세 이하)</label>
                          <Input
                            type="number"
                            value={formData.children}
                            onChange={(e) => handleInputChange('children', e.target.value)}
                            placeholder="0"
                            className="h-12 text-center border-gray-200"
                            min="0"
                          />
                        </div>
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Baby className="w-8 h-8 text-purple-600" />
                          </div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">유아 (만 2세 이하)</label>
                          <Input
                            type="number"
                            value={formData.infants}
                            onChange={(e) => handleInputChange('infants', e.target.value)}
                            placeholder="0"
                            className="h-12 text-center border-gray-200"
                            min="0"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-3 text-center">
                        💡 최소 1명 이상 입력해주세요 (성인, 아동, 유아 중)
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          1인당 예산
                        </label>
                        <Select onValueChange={(value) => handleInputChange('budget', value)}>
                          <SelectTrigger className="h-14 text-lg border-gray-200">
                            <SelectValue placeholder="예산대를 선택해주세요" />
                          </SelectTrigger>
                          <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-lg z-[60] min-w-[200px]">
                            <SelectItem value="50만원미만" className="hover:bg-gray-100/80 focus:bg-gray-100/80">50만원 미만</SelectItem>
                            <SelectItem value="50-100만원" className="hover:bg-gray-100/80 focus:bg-gray-100/80">50만원 - 100만원</SelectItem>
                            <SelectItem value="100-200만원" className="hover:bg-gray-100/80 focus:bg-gray-100/80">100만원 - 200만원</SelectItem>
                            <SelectItem value="200-300만원" className="hover:bg-gray-100/80 focus:bg-gray-100/80">200만원 - 300만원</SelectItem>
                            <SelectItem value="300만원이상" className="hover:bg-gray-100/80 focus:bg-gray-100/80">300만원 이상</SelectItem>
                            <SelectItem value="상담후결정" className="hover:bg-gray-100/80 focus:bg-gray-100/80">상담 후 결정</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          희망 여행 날짜
                        </label>
                        <Input
                          type="date"
                          value={formData.travelDate}
                          onChange={(e) => handleInputChange('travelDate', e.target.value)}
                          className="h-14 text-lg border-gray-200"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-8">
                      <Button 
                        type="button"
                        onClick={nextStep}
                        size="lg"
                        className="px-12 py-4 text-lg bg-gradient-to-r from-emerald-400 via-teal-500 to-purple-600 hover:from-emerald-500 hover:via-teal-600 hover:to-purple-700"
                        disabled={!formData.destination || !formData.duration || (!formData.adults && !formData.children && !formData.infants)}
                      >
                        다음 단계
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 2 && (
                <Card className="bg-white shadow-2xl border-0">
                  <CardHeader className="text-center pb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Star className="w-10 h-10 text-green-600" />
                    </div>
                    <CardTitle className="text-3xl text-gray-900 mb-4">선호사항</CardTitle>
                    <p className="text-gray-600 text-lg">항공사와 호텔 등급 선호도를 알려주세요</p>
                  </CardHeader>
                  <CardContent className="space-y-8 pb-12">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          선호 항공사
                        </label>
                        <Input
                          value={formData.preferredAirline}
                          onChange={(e) => handleInputChange('preferredAirline', e.target.value)}
                          placeholder="예: 대한항공, 아시아나, 에어부산"
                          className="h-14 text-lg border-gray-200"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          💡 예시: 대한항공, 아시아나, 저가항공 등
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          호텔 등급 선호도
                        </label>
                        <Input
                          value={formData.hotelGrade}
                          onChange={(e) => handleInputChange('hotelGrade', e.target.value)}
                          placeholder="예: 5성급, 준5성급, 4성급, 일반호텔"
                          className="h-14 text-lg border-gray-200"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          💡 예시: 5성급, 준5성급, 4성급, 일반호텔 등
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        특별 요청사항
                      </label>
                      <Textarea
                        value={formData.specialRequests}
                        onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                        placeholder="예: 가족 여행이라 아이들과 함께 즐길 수 있는 액티비티를 원해요. 매운 음식은 못 먹어서 순한 음식 위주로 추천해주세요. 사진 찍기 좋은 장소들을 많이 포함해주세요."
                        className="min-h-32 text-lg border-gray-200 resize-none"
                        rows={6}
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        💡 더 자세할수록 맞춤형 견적을 받을 수 있어요!
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        참고 자료 첨부 (선택사항)
                      </label>
                      
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors"
                        onDrop={(e) => {
                          e.preventDefault();
                          handleFileUpload(e.dataTransfer.files);
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => e.preventDefault()}
                      >
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg text-gray-600 mb-2">
                          파일을 여기로 드래그하거나 클릭하여 업로드
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          HWP, DOC, PPT, 이미지 파일 지원 (최대 10MB)
                        </p>
                        <input
                          type="file"
                          multiple
                          accept=".hwp,.doc,.docx,.ppt,.pptx,.pdf,.jpg,.jpeg,.png,.gif,.webp,.txt,application/x-hwp,application/haansofthwp,application/vnd.hancom.hwp,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf,image/*,text/plain"
                          onChange={(e) => handleFileUpload(e.target.files)}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('file-upload')?.click()}
                          className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          파일 선택
                        </Button>
                      </div>

                      {formData.attachedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-semibold text-gray-700">첨부된 파일:</p>
                          {formData.attachedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileText className="w-5 h-5 text-gray-500" />
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <span className="text-xs text-gray-500">
                                  ({(file.size / 1024 / 1024).toFixed(2)}MB)
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between pt-8">
                      <Button 
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        size="lg"
                        className="px-8 py-4 text-lg border-gray-200"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        이전
                      </Button>
                      
                      <Button 
                        type="button"
                        onClick={nextStep}
                        size="lg"
                        className="px-12 py-4 text-lg bg-gradient-to-r from-emerald-400 via-teal-500 to-purple-600 hover:from-emerald-500 hover:via-teal-600 hover:to-purple-700"
                      >
                        다음 단계
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 3 && (
                <Card className="bg-white shadow-2xl border-0">
                  <CardHeader className="text-center pb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Users className="w-10 h-10 text-purple-600" />
                    </div>
                    <CardTitle className="text-3xl text-gray-900 mb-4">연락처 정보</CardTitle>
                    <p className="text-gray-600 text-lg">견적을 받을 연락처를 알려주세요</p>
                  </CardHeader>
                  <CardContent className="space-y-8 pb-12">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          이름 <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="홍길동"
                          className="h-14 text-lg border-gray-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          연락처 <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="010-1234-5678"
                          className="h-14 text-lg border-gray-200"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        이메일 (선택사항)
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="example@email.com"
                        className="h-14 text-lg border-gray-200"
                      />
                    </div>


                    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 mt-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <Calendar className="w-6 h-6 mr-3 text-blue-600" />
                        견적 요청 요약
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <span className="font-semibold text-gray-700 w-20">여행지:</span>
                            <span className="text-gray-900">{formData.destination || '미정'}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-semibold text-gray-700 w-20">기간:</span>
                            <span className="text-gray-900">{formData.duration || '미정'}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-semibold text-gray-700 w-20">인원:</span>
                            <span className="text-gray-900">
                              {(() => {
                                const parts = [];
                                if (formData.adults && parseInt(formData.adults) > 0) parts.push(`성인 ${formData.adults}명`);
                                if (formData.children && parseInt(formData.children) > 0) parts.push(`아동 ${formData.children}명`);
                                if (formData.infants && parseInt(formData.infants) > 0) parts.push(`유아 ${formData.infants}명`);
                                return parts.length > 0 ? parts.join(', ') : '미정';
                              })()}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <span className="font-semibold text-gray-700 w-20">예산:</span>
                            <span className="text-gray-900">{formData.budget || '미정'}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-semibold text-gray-700 w-20">날짜:</span>
                            <span className="text-gray-900">{formData.travelDate || '미정'}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-semibold text-gray-700 w-20">항공사:</span>
                            <span className="text-gray-900">{formData.preferredAirline || '미정'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-8">
                      <Button 
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        size="lg"
                        className="px-8 py-4 text-lg border-gray-200"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        이전
                      </Button>
                      
                      <div className="flex flex-col items-end space-y-3">
                        {uploadingFiles && uploadProgress > 0 && (
                          <div className="w-full max-w-xs">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                              <span>파일 업로드</span>
                              <span>{Math.round(uploadProgress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        <Button 
                          type="submit" 
                          size="lg" 
                          disabled={loading || !formData.name || !formData.phone || uploadingFiles}
                          className="px-12 py-4 text-lg bg-gradient-to-r from-emerald-400 via-teal-500 to-purple-600 hover:from-emerald-500 hover:via-teal-600 hover:to-purple-700 disabled:opacity-50"
                        >
                          {uploadingFiles ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              파일 업로드 중...
                            </>
                          ) : loading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              처리 중...
                            </>
                          ) : (
                            <>
                              견적 요청 완료하기
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
