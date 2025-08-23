'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Mail, 
  Eye, 
  Edit, 
  LogOut, 
  Calendar,
  Users,
  MapPin,
  Phone,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plane,
  Hotel,
  X,
  Trash2,
  Send,
  Bell
} from "lucide-react";
import Link from "next/link";
import { commonClasses } from "@/lib/design-system";
import { storage } from "@/lib/firebase";
import { ref, getDownloadURL } from 'firebase/storage';
import { PushNotificationSettings } from '@/components/PushNotificationSettings';

interface AttachedFile {
  name: string;
  size: number;
  type: string;
  url?: string;
  path?: string;
}

interface Quote {
  id: string;
  destination: string;
  duration: string;
  adults: string;
  children: string;
  infants: string;
  budget: string;
  travelDate: string;
  name: string;
  phone: string;
  email: string;
  specialRequests: string;
  preferredAirline: string;
  hotelGrade: string;
  attachedFiles: AttachedFile[];
  createdAt: any;
  status: string;
  userId: string;
  userName: string;
  userEmail: string;
  updatedAt: any;
}

export default function ModernAdminPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [previewFile, setPreviewFile] = useState<{url: string, name: string, type: string} | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const router = useRouter();
  
  // 실시간 알림 시스템 활성화
  useRealtimeUpdates();
  
  // 이메일 통합 알림 시스템
  const { quoteApproved, adminNotification } = useNotifications();

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const adminAuth = localStorage.getItem('adminAuth');
        if (!adminAuth) {
          router.push('/admin/login');
          return;
        }
      }
    };

    checkAuth();
    fetchQuotes();
  }, [router]);

  useEffect(() => {
    filterQuotes();
  }, [quotes, filter, searchTerm]);

  const fetchQuotes = async () => {
    try {
      let quotesData: Quote[] = [];
      
      if (db) {
        // Firebase가 설정되어 있을 때
        const quotesRef = collection(db, 'quotes');
        const q = query(quotesRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        
        quotesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Quote[];
      } else {
        // Firebase가 없을 때 로컬 저장소에서 임시 데이터 로드
        const tempQuotes = JSON.parse(localStorage.getItem('tempQuotes') || '[]');
        quotesData = tempQuotes.map((quote: any) => ({
          ...quote,
          isTemp: true // 임시 데이터임을 표시
        }));
        
        // 임시 데이터가 있으면 알림
        if (tempQuotes.length > 0) {
          console.log(`📋 ${tempQuotes.length}개의 임시 견적 요청을 불러왔습니다.`);
        }
      }
      
      setQuotes(quotesData);
    } catch (error) {
      console.error('견적 데이터 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterQuotes = () => {
    let filtered = quotes;
    
    if (filter !== 'all') {
      filtered = filtered.filter(quote => quote.status === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(quote => 
        quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredQuotes(filtered);
  };

  const handleStatusUpdate = async (quoteId: string, newStatus: string) => {
    try {
      const quoteRef = doc(db, 'quotes', quoteId);
      await updateDoc(quoteRef, {
        status: newStatus,
        updatedAt: new Date()
      });
      
      // 견적 승인 시 이메일 알림 전송
      if (newStatus === 'approved') {
        const quote = quotes.find(q => q.id === quoteId);
        if (quote && quote.userEmail) {
          try {
            await quoteApproved(
              quote.userEmail,
              quote.userName || quote.name,
              quote.userId
            );
          } catch (error) {
            console.error('견적 승인 알림 전송 실패:', error);
            // 알림 실패는 사용자에게 표시하지 않음
          }
        }
      }
      
      // 상태 업데이트 후 목록 새로고침
      fetchQuotes();
    } catch (error) {
      console.error('상태 업데이트 실패:', error);
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (confirm('정말로 이 견적 요청을 삭제하시겠습니까?')) {
      try {
        const quoteRef = doc(db, 'quotes', quoteId);
        await deleteDoc(quoteRef);
        
        // 삭제 후 목록 새로고침
        fetchQuotes();
      } catch (error) {
        console.error('견적 삭제 실패:', error);
      }
    }
  };

  const handleResponseSubmit = async (quoteId: string) => {
    if (!responseText.trim()) {
      return;
    }

    try {
      const quoteRef = doc(db, 'quotes', quoteId);
      await updateDoc(quoteRef, {
        response: responseText,
        responseAt: new Date(),
        status: 'responded'
      });
      
      // 응답 제출 후 입력 필드 초기화
      setResponseText('');
      setSelectedQuote(null); // selectedQuote를 다시 null로 설정
      
      // 목록 새로고침
      fetchQuotes();
    } catch (error) {
      console.error('응답 저장 실패:', error);
    }
  };

  const openResponseModal = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowResponseModal(true);
    setResponseText('');
  };

  const handleFileDownload = async (file: AttachedFile) => {
    try {
      // Firebase Storage URL 추출 (다양한 경우 처리)
      let firebaseUrl = file.url || (file as any).url || (file as any).downloadURL;
      
      // URL이 없으면 path로 Firebase에서 URL 생성
      if (!firebaseUrl && file.path) {
        try {
          const storageRef = ref(storage, file.path);
          firebaseUrl = await getDownloadURL(storageRef);
        } catch (urlError) {
          console.error('Firebase URL 생성 실패:', urlError);
        }
      }
      
      if (!firebaseUrl) {
        console.error('❌ 파일 URL을 찾을 수 없습니다:', file);
        alert('파일 URL을 찾을 수 없습니다.\n\n관리자에게 문의해주세요.');
        return;
      }
      
      console.log('📁 다운로드 시작:', { fileName: file.name, url: firebaseUrl });
      
      // 로컬 환경에서 안전한 다운로드 방법
      const isLocalhost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          window.location.hostname.includes('192.168.');
      
      if (isLocalhost) {
        // 로컬 환경: API 라우트를 통한 프록시 다운로드
        try {
          const response = await fetch('/api/download', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileUrl: firebaseUrl,
              fileName: file.name,
              fileType: file.type
            })
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          
          const downloadLink = document.createElement('a');
          downloadLink.href = blobUrl;
          downloadLink.download = file.name || 'download';
          downloadLink.style.display = 'none';
          
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
          setTimeout(() => {
            window.URL.revokeObjectURL(blobUrl);
          }, 100);
          
          console.log('✅ 로컬 환경 다운로드 완료:', file.name);
          alert(`✅ "${file.name}" 다운로드가 완료되었습니다!\n\n📁 다운로드 폴더에서 파일을 확인하세요.`);
          
        } catch (proxyError) {
          console.warn('프록시 다운로드 실패, 직접 다운로드 시도:', proxyError);
          // 직접 다운로드로 폴백
          handleDirectDownload(firebaseUrl, file);
        }
      } else {
        // 배포 환경: 직접 다운로드
        handleDirectDownload(firebaseUrl, file);
      }
      
    } catch (error) {
      console.error('❌ 파일 다운로드 오류:', error);
      alert(`❌ 다운로드 실패: ${file.name}\n\n오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}\n\n관리자에게 문의해주세요.`);
    }
  };

  // 직접 다운로드 처리 함수
  const handleDirectDownload = async (firebaseUrl: string, file: AttachedFile) => {
    try {
      // 다운로드 방법 1: fetch로 blob 생성 후 다운로드
      const response = await fetch(firebaseUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = file.name || 'download';
      downloadLink.style.display = 'none';
      
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
      
      console.log('✅ 직접 다운로드 완료:', file.name);
      alert(`✅ "${file.name}" 다운로드가 완료되었습니다!\n\n📁 다운로드 폴더에서 파일을 확인하세요.`);
      
    } catch (fetchError) {
      console.warn('Fetch 다운로드 실패, 대체 방법 사용:', fetchError);
      
      // 다운로드 방법 2: 새 창 열기
      const downloadUrl = firebaseUrl.includes('alt=media') ? firebaseUrl : 
                        `${firebaseUrl}${firebaseUrl.includes('?') ? '&' : '?'}alt=media&token=${Date.now()}`;
      
      const newWindow = window.open(downloadUrl, '_blank');
      if (newWindow) {
        setTimeout(() => {
          newWindow.close();
        }, 5000);
      }
      
      alert(`다운로드를 시도했습니다: ${file.name}\n\n다운로드가 자동으로 시작되지 않으면:\n1. 새로 열린 탭에서 우클릭 → "다른 이름으로 저장"\n2. 브라우저 설정에서 다운로드 허용 확인`);
    }
  };

  const handleFilePreview = async (file: AttachedFile) => {
    try {
      // 미리보기 가능한 파일 형식 확인 - 모든 문서 형식 지원
      const isPreviewable = file.type?.startsWith('image/') || 
                           file.type === 'application/pdf' ||
                           file.type === 'text/plain' ||
                           file.type?.includes('officedocument') ||
                           file.type?.includes('msword') ||
                           file.type?.includes('hwp') ||
                           file.name?.toLowerCase().match(/\.(jpg|jpeg|png|gif|pdf|txt|doc|docx|ppt|pptx|hwp)$/);
      
      if (!isPreviewable) {
        alert(`"${file.name}" 파일은 브라우저에서 미리보기할 수 없습니다.\n\n✅ 모든 파일 형식 다운로드 지원:\n- 이미지 파일 (JPG, PNG, GIF 등)\n- 문서 파일 (PDF, DOC, DOCX, PPT, PPTX, HWP 등)\n- 기타 모든 파일 형식\n\n💡 다운로드 버튼을 클릭하여 파일을 받아보세요!`);
        return;
      }
      
      // 파일 URL 추출 (다양한 경우 처리)
      let previewUrl = file.url || (file as any).url || (file as any).downloadURL;
      
      // URL이 없으면 path로 Firebase에서 URL 생성
      if (!previewUrl && file.path) {
        try {
          const storageRef = ref(storage, file.path);
          previewUrl = await getDownloadURL(storageRef);
        } catch (urlError) {
          console.error('미리보기 URL 생성 실패:', urlError);
          alert('파일 URL을 생성할 수 없습니다.\n\n다운로드를 시도해보세요.');
          return;
        }
      }

      if (!previewUrl) {
        console.error('미리보기 URL을 생성할 수 없습니다.');
        alert('파일을 미리볼 수 없습니다.\n\n다운로드를 시도해보세요.');
        return;
      }

      console.log('👁️ 미리보기 시작:', { fileName: file.name, type: file.type, url: previewUrl });

      setPreviewFile({
        url: previewUrl,
        name: file.name || '파일',
        type: file.type || 'application/octet-stream'
      });
      setShowPreviewModal(true);
      
    } catch (error) {
      console.error('❌ 파일 미리보기 오류:', error);
      alert(`미리보기 실패: ${file.name}\n\n오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const pendingCount = quotes.filter(q => q.status === 'pending').length;
  const processingCount = quotes.filter(q => q.status === 'in_progress').length;
  const completedCount = quotes.filter(q => q.status === 'completed').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-green-50/20 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-green-50/20 to-blue-50/30">
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
                <div className="text-sm text-gray-500">관리자 대시보드</div>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('adminAuth');
                  }
                  router.push('/admin/login');
                }}
                variant="outline" 
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className={commonClasses.container}>
          <div className="flex space-x-8">
            <Link 
              href="/admin"
              className="px-6 py-4 text-sm font-medium text-gray-900 border-b-2 border-blue-600"
            >
              견적 관리
            </Link>
            <Link 
              href="/admin/payments"
              className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300"
            >
              결제 관리
            </Link>
            <Link 
              href="/admin/notifications"
              className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300"
            >
              푸시 알림 관리
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={commonClasses.container + " py-8"}>
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card 
            className={`bg-white shadow-xl border-0 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
              filter === 'all' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => setFilter('all')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">전체 요청</p>
                  <p className="text-3xl font-bold text-gray-900">{quotes.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`bg-white shadow-xl border-0 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
              filter === 'pending' ? 'ring-2 ring-yellow-500 bg-yellow-50' : ''
            }`}
            onClick={() => setFilter('pending')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">대기중</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`bg-white shadow-xl border-0 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
              filter === 'in_progress' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => setFilter('in_progress')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">진행중</p>
                  <p className="text-3xl font-bold text-blue-600">{processingCount}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`bg-white shadow-xl border-0 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
              filter === 'completed' ? 'ring-2 ring-green-500 bg-green-50' : ''
            }`}
            onClick={() => setFilter('completed')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">완료</p>
                  <p className="text-3xl font-bold text-green-600">{completedCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="이름, 여행지, 이메일로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40 h-12">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-lg z-[60]">
                    <SelectItem value="all" className="hover:bg-gray-100/80 focus:bg-gray-100/80">전체</SelectItem>
                    <SelectItem value="pending" className="hover:bg-gray-100/80 focus:bg-gray-100/80">대기중</SelectItem>
                    <SelectItem value="in_progress" className="hover:bg-gray-100/80 focus:bg-gray-100/80">진행중</SelectItem>
                    <SelectItem value="completed" className="hover:bg-gray-100/80 focus:bg-gray-100/80">완료</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={fetchQuotes} variant="outline" className="h-12">
                  새로고침
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Cards */}
        <div className="grid gap-6">
          {filteredQuotes.map((quote) => (
            <Card key={quote.id} className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{quote.name}</h3>
                      <Badge className={`${getStatusColor(quote.status)} flex items-center gap-1`}>
                        {getStatusIcon(quote.status)}
                        {quote.status === 'pending' ? '대기중' : 
                         quote.status === 'in_progress' ? '진행중' : '완료'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                      <p className="text-gray-600">신청일: {formatDate(quote.createdAt)}</p>
                      {quote.travelDate && (
                        <p className="text-gray-600">• 희망날짜: {quote.travelDate}</p>
                      )}
                      {quote.budget && (
                        <p className="text-gray-600">• 예산: {quote.budget}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select 
                      value={quote.status} 
                      onValueChange={(value) => handleStatusUpdate(quote.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-lg z-[60]">
                        <SelectItem value="pending" className="hover:bg-gray-100/80 focus:bg-gray-100/80">대기중</SelectItem>
                        <SelectItem value="in_progress" className="hover:bg-gray-100/80 focus:bg-gray-100/80">진행중</SelectItem>
                        <SelectItem value="completed" className="hover:bg-gray-100/80 focus:bg-gray-100/80">완료</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">여행지</p>
                      <p className="text-gray-900 font-semibold">{quote.destination}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">기간</p>
                      <p className="text-gray-900 font-semibold">{quote.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">인원</p>
                      <p className="text-gray-900 font-semibold">
                        {(() => {
                          const parts = [];
                          if (quote.adults && parseInt(quote.adults) > 0) parts.push(`성인 ${quote.adults}`);
                          if (quote.children && parseInt(quote.children) > 0) parts.push(`아동 ${quote.children}`);
                          if (quote.infants && parseInt(quote.infants) > 0) parts.push(`유아 ${quote.infants}`);
                          return parts.length > 0 ? parts.join(', ') : '미정';
                        })()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">연락처</p>
                      <p className="text-gray-900 font-semibold">{quote.phone}</p>
                    </div>
                  </div>
                </div>

                {(quote.preferredAirline || quote.hotelGrade) && (
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {quote.preferredAirline && (
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Plane className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">선호 항공사</p>
                          <p className="text-gray-900 font-semibold">{quote.preferredAirline}</p>
                        </div>
                      </div>
                    )}

                    {quote.hotelGrade && (
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                          <Hotel className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">호텔 등급</p>
                          <p className="text-gray-900 font-semibold">{quote.hotelGrade}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {quote.specialRequests && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-500 mb-2">특별 요청사항</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">{quote.specialRequests}</p>
                    </div>
                  </div>
                )}

                {/* 첨부파일 섹션 - 디버깅 강화 */}
                {(() => {
                  // 첨부파일이 있는지 확인
                  const hasFiles = quote.attachedFiles && Array.isArray(quote.attachedFiles) && quote.attachedFiles.length > 0;
                  
                  if (!hasFiles) {
                    return (
                      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800">
                          📎 <strong>첨부파일 없음</strong> - 이 견적에는 첨부된 파일이 없습니다.
                        </p>
                        <div className="mt-2 text-xs text-yellow-600">
                          디버깅 정보: attachedFiles = {JSON.stringify(quote.attachedFiles)}
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-500 mb-3">
                        📎 첨부 파일 ({quote.attachedFiles.length}개)
                      </p>
                      <div className="space-y-3">
                        {quote.attachedFiles.map((file, index) => {
                          return (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-xl">
                                    {file.type?.startsWith('image/') ? '🖼️' : 
                                     file.type === 'application/pdf' ? '📄' : '📎'}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-gray-900 truncate" title={file.name || `첨부파일 ${index + 1}`}>
                                    {file.name || `첨부파일 ${index + 1}`}
                                  </p>
                                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <span>📄 {file.type || 'Unknown'}</span>
                                    {file.size && (
                                      <>
                                        <span>•</span>
                                        <span>📏 {(file.size / 1024 / 1024).toFixed(2)}MB</span>
                                      </>
                                    )}
                                    {file.url && <span>• 🔗 URL 있음</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                                  onClick={() => {
                                    handleFilePreview(file);
                                  }}
                                  title="파일 미리보기 (브라우저 지원 형식만)"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  미리보기
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm" 
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                  onClick={() => {
                                    handleFileDownload(file);
                                  }}
                                  title="모든 파일 형식 다운로드 지원 (DOC, PPT, HWP, 이미지, PDF 등)"
                                >
                                  <FileText className="w-4 h-4 mr-1" />
                                  다운로드
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-700">
                          ✅ <strong>파일 관리:</strong> 모든 파일 형식 다운로드 지원 (DOC, DOCX, PPT, PPTX, HWP, 이미지, PDF 등)
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          💡 미리보기는 브라우저 지원 형식만 가능하며, 다운로드는 모든 형식이 가능합니다.
                        </p>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span>{quote.email}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      상세보기
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openResponseModal(quote)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      응답하기
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteQuote(quote.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      삭제
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuotes.length === 0 && (
          <Card className="shadow-xl border-0">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">견적 요청이 없습니다</h3>
              <p className="text-gray-600">새로운 견적 요청을 기다리고 있습니다.</p>
            </CardContent>
          </Card>
        )}

        {/* Response Modal */}
        {showResponseModal && selectedQuote && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">견적 응답 작성</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowResponseModal(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">고객 정보</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">이름:</span>
                      <span className="ml-2 font-medium">{selectedQuote.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">여행지:</span>
                      <span className="ml-2 font-medium">{selectedQuote.destination}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">기간:</span>
                      <span className="ml-2 font-medium">{selectedQuote.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">예산:</span>
                      <span className="ml-2 font-medium">{selectedQuote.budget}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    견적 응답 내용 <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder="안녕하세요! K-BIZ TRAVEL입니다.&#10;&#10;요청해주신 여행에 대한 맞춤 견적을 안내드립니다.&#10;&#10;📍 여행지: [여행지]&#10;📅 기간: [기간]&#10;👥 인원: [인원]&#10;💰 예상 비용: [금액]&#10;&#10;포함 사항:&#10;- 항공료 (왕복)&#10;- 숙박료 ([등급] 호텔)&#10;- 현지 가이드&#10;- 관광지 입장료&#10;- 식사 ([횟수])&#10;&#10;자세한 일정과 추가 문의사항은 전화로 상담받으실 수 있습니다.&#10;감사합니다!"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="min-h-64 text-sm"
                    rows={12}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {responseText.length} / 1000자
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="outline"
                    onClick={() => setShowResponseModal(false)}
                  >
                    취소
                  </Button>
                  <Button 
                    onClick={() => handleResponseSubmit(selectedQuote.id)}
                    disabled={!responseText.trim()}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  >
                    응답 전송
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* File Preview Modal */}
        {showPreviewModal && previewFile && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                  {previewFile.type?.startsWith('image/') ? '🖼️' : 
                   previewFile.type === 'application/pdf' ? '📄' : '📎'}
                </span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{previewFile.name}</h2>
                    <p className="text-sm text-gray-500">파일 미리보기</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setShowPreviewModal(false);
                    setPreviewFile(null);
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
                {previewFile.type.startsWith('image/') ? (
                  <div className="flex justify-center">
                    <img 
                      src={previewFile.url} 
                      alt={previewFile.name}
                      className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-md"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const errorDiv = e.currentTarget.nextElementSibling as HTMLElement;
                        if (errorDiv) errorDiv.style.display = 'block';
                      }}
                    />
                    <div className="hidden text-center text-gray-500">
                      <p className="text-lg mb-2">이미지를 불러올 수 없습니다</p>
                      <Button 
                        onClick={() => handleFileDownload({...previewFile, url: previewFile.url, name: previewFile.name, type: previewFile.type, size: 0})}
                        variant="outline"
                      >
                        다운로드하여 보기
                      </Button>
                    </div>
                  </div>
                ) : previewFile.type === 'application/pdf' ? (
                  <div className="w-full h-[60vh]">
                    <iframe
                      src={previewFile.url}
                      className="w-full h-full border border-gray-200 rounded-lg"
                      title={previewFile.name}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">
                  {previewFile.type?.startsWith('image/') ? '🖼️' : 
                   previewFile.type === 'application/pdf' ? '📄' : '📎'}
                </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{previewFile.name}</h3>
                    <p className="text-gray-600 mb-6">이 파일 형식은 브라우저에서 미리보기할 수 없습니다.</p>
                    <Button 
                      onClick={() => handleFileDownload({...previewFile, url: previewFile.url, name: previewFile.name, type: previewFile.type, size: 0})}
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      파일 다운로드
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}