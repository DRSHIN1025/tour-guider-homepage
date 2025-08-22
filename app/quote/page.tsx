"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { 
  MapPin, 
  Clock, 
  Users, 
  Calendar, 
  MessageCircle, 
  Phone, 
  Mail, 
  Loader2, 
  CheckCircle,
  ArrowRight,
  DollarSign,
  Globe,
  Star,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { designSystem, commonClasses } from "@/lib/design-system";

export default function QuotePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    destination: '',
    duration: '',
    people: '',
    budget: '',
    travelDate: '',
    specialRequests: '',
    contactMethod: 'email',
    phone: '',
    email: user?.email || '',
    name: user?.displayName || '',
    travelStyle: '',
    accommodation: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 항목 검증
    if (!formData.destination || !formData.duration || !formData.people) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 연락처 정보 검증
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
      const quoteData = {
        ...formData,
        userId: user?.uid || 'anonymous',
        userName: formData.name || user?.displayName || '익명',
        userEmail: formData.email || user?.email || '',
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const quotesCollection = collection(db, 'quotes');
      const docRef = await addDoc(quotesCollection, quoteData);
      
      toast.success('견적 요청이 성공적으로 제출되었습니다!');
      setSubmitted(true);
    } catch (error) {
      console.error('견적 요청 실패:', error);
      if (error instanceof Error) {
        toast.error(`견적 요청 실패: ${error.message}`);
      } else {
        toast.error('견적 요청 중 알 수 없는 오류가 발생했습니다.');
      }
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
        {/* Header */}
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
                <Link href="/login">
                  <Button 
                    variant="outline" 
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 font-medium"
                  >
                    로그인
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="py-24 bg-gradient-to-br from-blue-50 via-white to-green-50">
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
                    <Link href="/">
                      <Button size="lg" variant="outline" className="px-8 py-3 border-blue-200 text-blue-600 hover:bg-blue-50">
                        홈으로 돌아가기
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button size="lg" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                        내 견적 확인하기
                      </Button>
                    </Link>
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
      {/* Header */}
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
              <Link href="/login">
                <Button 
                  variant="outline" 
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 font-medium"
                >
                  로그인
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="py-24 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className={commonClasses.container}>
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <Badge className="mb-6 bg-blue-100 text-blue-700 px-4 py-2 text-sm font-medium">
                ✈️ 맞춤 견적 요청
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
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
              {/* Progress Steps */}
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
                      세부 요청
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

              {/* Step 1: 여행 기본 정보 */}
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
                        <Select onValueChange={(value) => handleInputChange('destination', value)}>
                          <SelectTrigger className="h-14 text-lg border-gray-200">
                            <SelectValue placeholder="여행지를 선택해주세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="thailand">🇹🇭 태국 (방콕, 파타야, 치앙마이)</SelectItem>
                            <SelectItem value="vietnam">🇻🇳 베트남 (하노이, 호치민, 다낭)</SelectItem>
                            <SelectItem value="philippines">🇵🇭 필리핀 (마닐라, 세부, 보라카이)</SelectItem>
                            <SelectItem value="indonesia">🇮🇩 인도네시아 (발리, 자카르타, 롬복)</SelectItem>
                            <SelectItem value="cambodia">🇰🇭 캄보디아 (시엠립, 프놈펜)</SelectItem>
                            <SelectItem value="other">기타 (상담 시 협의)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          여행 기간 <span className="text-red-500">*</span>
                        </label>
                        <Select onValueChange={(value) => handleInputChange('duration', value)}>
                          <SelectTrigger className="h-14 text-lg border-gray-200">
                            <SelectValue placeholder="여행 기간을 선택해주세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2박3일">2박 3일</SelectItem>
                            <SelectItem value="3박4일">3박 4일</SelectItem>
                            <SelectItem value="4박5일">4박 5일</SelectItem>
                            <SelectItem value="5박6일">5박 6일</SelectItem>
                            <SelectItem value="6박7일">6박 7일</SelectItem>
                            <SelectItem value="7박8일">7박 8일</SelectItem>
                            <SelectItem value="장기">1주일 이상</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          여행 인원 <span className="text-red-500">*</span>
                        </label>
                        <Select onValueChange={(value) => handleInputChange('people', value)}>
                          <SelectTrigger className="h-14 text-lg border-gray-200">
                            <SelectValue placeholder="여행 인원을 선택해주세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1명">혼자 여행 (1명)</SelectItem>
                            <SelectItem value="2명">커플/친구 (2명)</SelectItem>
                            <SelectItem value="3-4명">소규모 그룹 (3-4명)</SelectItem>
                            <SelectItem value="5-8명">중규모 그룹 (5-8명)</SelectItem>
                            <SelectItem value="9명이상">대규모 그룹 (9명 이상)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          1인당 예산
                        </label>
                        <Select onValueChange={(value) => handleInputChange('budget', value)}>
                          <SelectTrigger className="h-14 text-lg border-gray-200">
                            <SelectValue placeholder="예산대를 선택해주세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="50만원미만">50만원 미만</SelectItem>
                            <SelectItem value="50-100만원">50만원 - 100만원</SelectItem>
                            <SelectItem value="100-200만원">100만원 - 200만원</SelectItem>
                            <SelectItem value="200-300만원">200만원 - 300만원</SelectItem>
                            <SelectItem value="300만원이상">300만원 이상</SelectItem>
                            <SelectItem value="상담후결정">상담 후 결정</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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

                    <div className="flex justify-end pt-8">
                      <Button 
                        type="button"
                        onClick={nextStep}
                        size="lg"
                        className="px-12 py-4 text-lg bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                        disabled={!formData.destination || !formData.duration || !formData.people}
                      >
                        다음 단계
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: 세부 요청사항 */}
              {currentStep === 2 && (
                <Card className="bg-white shadow-2xl border-0">
                  <CardHeader className="text-center pb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Star className="w-10 h-10 text-green-600" />
                    </div>
                    <CardTitle className="text-3xl text-gray-900 mb-4">세부 요청사항</CardTitle>
                    <p className="text-gray-600 text-lg">어떤 스타일의 여행을 원하시나요?</p>
                  </CardHeader>
                  <CardContent className="space-y-8 pb-12">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          여행 스타일
                        </label>
                        <Select onValueChange={(value) => handleInputChange('travelStyle', value)}>
                          <SelectTrigger className="h-14 text-lg border-gray-200">
                            <SelectValue placeholder="선호하는 여행 스타일" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="휴양">🏖️ 휴양 중심 (리조트, 해변)</SelectItem>
                            <SelectItem value="관광">🏛️ 관광 중심 (문화, 역사)</SelectItem>
                            <SelectItem value="액티비티">🎯 액티비티 중심 (체험, 모험)</SelectItem>
                            <SelectItem value="음식">🍜 미식 중심 (로컬 푸드 투어)</SelectItem>
                            <SelectItem value="쇼핑">🛍️ 쇼핑 중심</SelectItem>
                            <SelectItem value="복합">🎭 복합적 (여러 스타일 혼합)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          숙박 선호도
                        </label>
                        <Select onValueChange={(value) => handleInputChange('accommodation', value)}>
                          <SelectTrigger className="h-14 text-lg border-gray-200">
                            <SelectValue placeholder="숙박 시설 선호도" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="럭셔리">🏨 럭셔리 호텔/리조트</SelectItem>
                            <SelectItem value="부티크">🏛️ 부티크 호텔</SelectItem>
                            <SelectItem value="스탠다드">🏨 스탠다드 호텔</SelectItem>
                            <SelectItem value="게스트하우스">🏠 게스트하우스/B&B</SelectItem>
                            <SelectItem value="현지체험">🏘️ 현지 민박 체험</SelectItem>
                            <SelectItem value="상관없음">🤷‍♂️ 상관없음</SelectItem>
                          </SelectContent>
                        </Select>
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
                        className="px-12 py-4 text-lg bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                      >
                        다음 단계
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: 연락처 정보 */}
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

                    {/* 견적 요청 요약 */}
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
                            <span className="text-gray-900">{formData.people || '미정'}</span>
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
                            <span className="font-semibold text-gray-700 w-20">스타일:</span>
                            <span className="text-gray-900">{formData.travelStyle || '미정'}</span>
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
                      
                      <Button 
                        type="submit" 
                        size="lg" 
                        disabled={loading || !formData.name || !formData.phone}
                        className="px-12 py-4 text-lg bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:opacity-50"
                      >
                        {loading ? (
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