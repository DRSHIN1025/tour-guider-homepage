'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Receipt,
  ArrowRight,
  Home,
  User
} from 'lucide-react';
import { PhoneCall } from '@/components/PhoneCall';
import { KakaoChat } from '@/components/KakaoChat';

interface PaymentData {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customerEmail: string;
  createdAt: Date;
  metadata: {
    quoteId?: string;
    destination?: string;
    duration?: string;
    travelers?: string;
    customerName?: string;
  };
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { paymentSuccess } = useNotifications();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      fetchPaymentData(sessionId);
    } else {
      setError('결제 세션 정보를 찾을 수 없습니다.');
      setLoading(false);
    }
  }, [searchParams]);

  const fetchPaymentData = async (sessionId: string) => {
    try {
      // 실제 구현에서는 API를 통해 결제 데이터를 가져옴
      // 여기서는 URL 파라미터로부터 데이터를 구성
      const mockData: PaymentData = {
        id: sessionId,
        amount: parseInt(searchParams.get('amount') || '0'),
        currency: searchParams.get('currency') || 'krw',
        status: 'succeeded',
        customerEmail: searchParams.get('email') || 'customer@example.com',
        createdAt: new Date(),
        metadata: {
          quoteId: searchParams.get('quote_id') || undefined,
          destination: searchParams.get('destination') || '동남아 여행',
          duration: searchParams.get('duration') || '5박 6일',
          travelers: searchParams.get('travelers') || '2명',
          customerName: searchParams.get('customer_name') || '고객님',
        },
      };

      setPaymentData(mockData);
      
      // 결제 성공 알림 표시 (푸시 + 이메일)
      paymentSuccess(
        mockData.customerEmail,
        mockData.metadata.customerName,
        mockData.id,
        formatCurrency(mockData.amount, mockData.currency),
        mockData.metadata.destination
      );
    } catch (err) {
      setError('결제 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-green-50/20 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">결제 정보를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-green-50/20 to-blue-50/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 확인 실패</h1>
          <p className="text-gray-600 mb-6">{error || '결제 정보를 찾을 수 없습니다.'}</p>
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full">
                <Home className="w-4 h-4 mr-2" />
                홈으로 돌아가기
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                <User className="w-4 h-4 mr-2" />
                대시보드로 이동
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-green-50/20 to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* 성공 메시지 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎉 결제가 완료되었습니다!</h1>
          <p className="text-xl text-gray-600">
            {paymentData.metadata.customerName}님의 여행이 성공적으로 예약되었습니다
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* 결제 완료 카드 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 결제 정보 */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-100">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CreditCard className="w-5 h-5" />
                  결제 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">결제 금액</span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(paymentData.amount, paymentData.currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">결제 상태</span>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        완료
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">결제 일시</span>
                      <span className="font-medium">{formatDate(paymentData.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">결제 ID</span>
                      <span className="font-mono text-sm text-gray-500">{paymentData.id}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">고객 이메일</span>
                      <span className="font-medium">{paymentData.customerEmail}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">통화</span>
                      <span className="font-medium">{paymentData.currency.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">처리 상태</span>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        처리됨
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 여행 정보 */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <MapPin className="w-5 h-5" />
                  여행 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">여행지</p>
                        <p className="font-semibold">{paymentData.metadata.destination}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">여행 기간</p>
                        <p className="font-semibold">{paymentData.metadata.duration}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">여행 인원</p>
                        <p className="font-semibold">{paymentData.metadata.travelers}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 다음 단계 안내 */}
            <Card className="shadow-xl border-0 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <ArrowRight className="w-5 h-5" />
                  다음 단계
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-amber-600 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-amber-800">이메일 확인</p>
                      <p className="text-sm text-amber-700">결제 확인 이메일을 {paymentData.customerEmail}로 발송했습니다.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-amber-600 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-amber-800">여행 상세 일정</p>
                      <p className="text-sm text-amber-700">24시간 이내에 상세한 여행 일정과 가이드 정보를 이메일로 받으실 수 있습니다.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-amber-600 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-amber-800">여행 준비</p>
                      <p className="text-sm text-amber-700">여행 전 체크리스트와 준비사항을 안내드립니다.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 빠른 액션 */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-lg">빠른 액션</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/dashboard" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    대시보드로 이동
                  </Button>
                </Link>
                
                <Link href="/" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Home className="w-4 h-4 mr-2" />
                    홈으로 돌아가기
                  </Button>
                </Link>
                
                <Button className="w-full justify-start" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  영수증 다운로드
                </Button>
              </CardContent>
            </Card>

            {/* 연락처 정보 */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-lg">문의하기</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <PhoneCall phoneNumber="010-5940-0104" className="w-full justify-start" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  전화 상담
                </PhoneCall>
                
                <KakaoChat className="w-full justify-start" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  카카오톡 문의
                </KakaoChat>
              </CardContent>
            </Card>

            {/* 고객 지원 */}
            <Card className="shadow-xl border-0 bg-blue-50 border-blue-100">
              <CardContent className="p-4">
                <h3 className="font-semibold text-blue-800 mb-2">💡 고객 지원</h3>
                <p className="text-sm text-blue-700 mb-3">
                  결제나 여행 관련 문의사항이 있으시면 언제든 연락주세요.
                </p>
                <div className="text-xs text-blue-600 space-y-1">
                  <p>• 평일 09:00-18:00</p>
                  <p>• 토요일 09:00-13:00</p>
                  <p>• 일요일 및 공휴일 휴무</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            투어가이더와 함께 특별한 여행을 시작하세요! ✈️🌍
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span>결제 완료</span>
            <ArrowRight className="w-4 h-4" />
            <span>여행 일정 확인</span>
            <ArrowRight className="w-4 h-4" />
            <span>즐거운 여행</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">결제 정보를 확인하는 중...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
} 