'use client';

import { useEffect, useState } from 'react';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User,
  CreditCard,
  FileText,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Phone,
  Mail,
  LogOut,
  ArrowRight,
  Home,
  Settings,
  Download,
  Eye,
  Bell
} from 'lucide-react';
import Link from 'next/link';
import { PhoneCall } from '@/components/PhoneCall';
import { KakaoChat } from '@/components/KakaoChat';
import { PushNotificationSettings } from '@/components/PushNotificationSettings';
import { NotificationSettings } from '@/components/NotificationSettings';
import { NotificationHistory } from '@/components/NotificationHistory';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customerEmail: string;
  createdAt: Date;
  updatedAt: Date;
  paymentMethod: string;
  metadata: {
    quoteId?: string;
    destination?: string;
    duration?: string;
    travelers?: string;
  };
  refundAmount?: number;
  refundReason?: string;
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
  status: string;
  createdAt: any;
  updatedAt: any;
  paymentStatus?: string;
}

interface PaymentStatistics {
  period: string;
  totalPayments: number;
  totalRefunds: number;
  netAmount: number;
  paymentCount: number;
  refundCount: number;
  statusCounts: {
    succeeded: number;
    completed: number;
    failed: number;
    refunded: number;
    partially_refunded: number;
  };
}

export default function DashboardPage() {
  const { user, logout } = useLocalAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [statistics, setStatistics] = useState<PaymentStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // 실시간 알림 시스템 활성화
  useRealtimeUpdates();

  useEffect(() => {
    if (user?.email) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      
      // Fetch payment history
      const paymentParams = new URLSearchParams({
        email: user.email,
        status: 'all',
        page: '1',
        pageSize: '50'
      });
      
      const paymentResponse = await fetch(`/api/payment/history?${paymentParams}`);
      const paymentData = await paymentResponse.json();

      if (paymentData.success) {
        setPayments(paymentData.payments);
      }

      // Fetch payment statistics
      const statsResponse = await fetch('/api/payment/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, period: 'month' })
      });

      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStatistics(statsData.statistics);
      }

      // Fetch user quotes
      const quotesResponse = await fetch(`/api/user/quotes?email=${encodeURIComponent(user.email)}`);
      const quotesData = await quotesResponse.json();

      if (quotesData.success) {
        setQuotes(quotesData.quotes);
      }

    } catch (error) {
      console.error('사용자 데이터 로딩 오류:', error);
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
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      succeeded: { label: '성공', className: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      completed: { label: '완료', className: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
      failed: { label: '실패', className: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
      refunded: { label: '환불', className: 'bg-gray-100 text-gray-800 border-gray-200', icon: RotateCcw },
      partially_refunded: { label: '부분환불', className: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: RotateCcw },
      pending: { label: '대기중', className: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      in_progress: { label: '진행중', className: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-green-50/20 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h1>
          <p className="text-gray-600 mb-6">대시보드를 확인하려면 로그인해주세요.</p>
          <div className="space-y-3">
            <Button asChild>
              <Link href="/login">로그인하기</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    내 대시보드
                  </div>
                  <div className="text-sm text-gray-500">{user.name || user.email}님 환영합니다</div>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/notifications">
                  <Bell className="w-4 h-4 mr-2" />
                  알림 센터
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  홈으로
                </Link>
              </Button>
              <Button 
                onClick={handleLogout}
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/95 backdrop-blur-md border border-gray-200 shadow-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <User className="w-4 h-4 mr-2" />
              개요
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
              <CreditCard className="w-4 h-4 mr-2" />
              결제 내역
            </TabsTrigger>
            <TabsTrigger value="quotes" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              견적 요청
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
              <Bell className="w-4 h-4 mr-2" />
              알림 센터
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              <Settings className="w-4 h-4 mr-2" />
              프로필
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Welcome Card */}
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    안녕하세요, {user.name || user.email}님! 👋
                  </h1>
                  <p className="text-lg text-gray-600 mb-6">
                    K-BIZ TRAVEL과 함께한 여행 정보를 한눈에 확인하세요
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button asChild>
                      <Link href="/products">
                        <MapPin className="w-4 h-4 mr-2" />
                        여행 상품 둘러보기
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/referral">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        추천 프로그램
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Cards */}
            {statistics && (
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-white shadow-xl border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">총 결제 금액</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(statistics.totalPayments, 'KRW')}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-xl border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">총 환불 금액</p>
                        <p className="text-2xl font-bold text-red-600">
                          {formatCurrency(statistics.totalRefunds, 'KRW')}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <TrendingDown className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-xl border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">순 결제 금액</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(statistics.netAmount, 'KRW')}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Payments */}
              <Card className="bg-white shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    최근 결제 내역
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {payments.length > 0 ? (
                    <div className="space-y-3">
                      {payments.slice(0, 3).map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {payment.metadata?.destination || '여행 상품'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(payment.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-green-600">
                              {formatCurrency(payment.amount, payment.currency)}
                            </span>
                            {getStatusBadge(payment.status)}
                          </div>
                        </div>
                      ))}
                      {payments.length > 3 && (
                        <div className="text-center pt-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href="/payment/history">
                              전체 보기
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <CreditCard className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>아직 결제 내역이 없습니다</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Quotes */}
              <Card className="bg-white shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    최근 견적 요청
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {quotes.length > 0 ? (
                    <div className="space-y-3">
                      {quotes.slice(0, 3).map((quote) => (
                        <div key={quote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{quote.destination}</p>
                            <p className="text-sm text-gray-600">
                              {quote.duration} • {quote.travelDate}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{quote.budget}</span>
                            {getStatusBadge(quote.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>아직 견적 요청이 없습니다</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle>빠른 액션</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button asChild className="h-16">
                    <Link href="/products">
                      <MapPin className="w-5 h-5 mr-2" />
                      여행 상품 둘러보기
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-16">
                    <Link href="/payment/history">
                      <CreditCard className="w-5 h-5 mr-2" />
                      결제 내역 확인
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-16">
                    <Link href="/payment/refund">
                      <RotateCcw className="w-5 h-5 mr-2" />
                      환불 요청
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  결제 내역
                </CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {payment.metadata?.destination || '여행 상품'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              결제일: {formatDate(payment.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              {formatCurrency(payment.amount, payment.currency)}
                            </p>
                            {getStatusBadge(payment.status)}
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">여행 기간:</span>
                            <span className="ml-2 font-medium">
                              {payment.metadata?.duration || '-'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">여행 인원:</span>
                            <span className="ml-2 font-medium">
                              {payment.metadata?.travelers || '-'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">결제 방법:</span>
                            <span className="ml-2 font-medium">{payment.paymentMethod}</span>
                          </div>
                        </div>

                        {payment.refundAmount && (
                          <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-sm text-yellow-800">
                              환불 금액: {formatCurrency(payment.refundAmount, payment.currency)}
                              {payment.refundReason && ` • 사유: ${payment.refundReason}`}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-end mt-3 space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/payment/history/${payment.id}`}>
                              <Eye className="w-4 h-4 mr-1" />
                              상세보기
                            </Link>
                          </Button>
                          {payment.status === 'succeeded' || payment.status === 'completed' ? (
                            <Button variant="outline" size="sm" asChild>
                              <Link href="/payment/refund">
                                <RotateCcw className="w-4 h-4 mr-1" />
                                환불 요청
                              </Link>
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">결제 내역이 없습니다</h3>
                    <p className="text-gray-600 mb-6">첫 번째 여행을 시작해보세요!</p>
                    <Button asChild>
                      <Link href="/products">
                        여행 상품 둘러보기
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quotes Tab */}
          <TabsContent value="quotes" className="space-y-6">
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  견적 요청 내역
                </CardTitle>
              </CardHeader>
              <CardContent>
                {quotes.length > 0 ? (
                  <div className="space-y-4">
                    {quotes.map((quote) => (
                      <div key={quote.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{quote.destination}</h3>
                            <p className="text-sm text-gray-600">
                              요청일: {formatDate(quote.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{quote.budget}</p>
                            {getStatusBadge(quote.status)}
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">여행 기간:</span>
                            <span className="ml-2 font-medium">{quote.duration}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">여행 인원:</span>
                            <span className="ml-2 font-medium">
                              {(() => {
                                const parts = [];
                                if (parseInt(quote.adults) > 0) parts.push(`성인 ${quote.adults}`);
                                if (parseInt(quote.children) > 0) parts.push(`아동 ${quote.children}`);
                                if (parseInt(quote.infants) > 0) parts.push(`유아 ${quote.infants}`);
                                return parts.length > 0 ? parts.join(', ') : '미정';
                              })()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">희망 날짜:</span>
                            <span className="ml-2 font-medium">{quote.travelDate}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">선호 항공사:</span>
                            <span className="ml-2 font-medium">{quote.preferredAirline}</span>
                          </div>
                        </div>

                        {quote.specialRequests && (
                          <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800">
                              <span className="font-medium">특별 요청사항:</span> {quote.specialRequests}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span>{quote.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4" />
                              <span>{quote.phone}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              상세보기
                            </Button>
                            {quote.status === 'completed' && (
                              <Button variant="outline" size="sm" asChild>
                                <Link href="/products">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  여행 상품 보기
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">견적 요청이 없습니다</h3>
                    <p className="text-gray-600 mb-6">맞춤형 여행 견적을 요청해보세요!</p>
                    <Button asChild>
                      <Link href="/products">
                        여행 상품 둘러보기
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  알림 센터
                </CardTitle>
                <CardDescription>
                  모든 알림을 한 곳에서 관리하고 확인하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationHistory maxItems={100} showFilters={true} showActions={true} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  프로필 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                      <p className="text-gray-900">{user.name || '미설정'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                      <p className="text-gray-900">{user.phone || '미설정'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">가입일</label>
                      <p className="text-gray-900">
                        {user.createdAt ? formatDate(user.createdAt) : '알 수 없음'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <Button variant="outline" className="mr-3">
                      <Settings className="w-4 h-4 mr-2" />
                      프로필 수정
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      데이터 내보내기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Push Notification Settings */}
            <PushNotificationSettings showTestButtons={false} />
            
            {/* Notification Settings */}
            <Card className="bg-white shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  알림 설정
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NotificationSettings />
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>고객 지원</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <PhoneCall phoneNumber="010-5940-0104" className="w-full justify-start" variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    전화 상담
                  </PhoneCall>
                  
                  <KakaoChat className="w-full justify-start" variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    카카오톡 문의
                  </KakaoChat>
                </div>
                
                <div className="mt-4 p-4 bg-white/50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">📞 고객 지원 시간</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>• 평일 09:00-18:00</p>
                    <p>• 토요일 09:00-13:00</p>
                    <p>• 일요일 및 공휴일 휴무</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 