'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  RefreshCw,
  CreditCard,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Phone,
  Mail
} from 'lucide-react';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { PhoneCall } from '@/components/PhoneCall';
import { KakaoChat } from '@/components/KakaoChat';

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

export default function PaymentHistoryPage() {
  const { user } = useLocalAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [statistics, setStatistics] = useState<PaymentStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [period, setPeriod] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    if (user?.email) {
      fetchPaymentHistory();
      fetchPaymentStatistics();
    }
  }, [user, filter, period, currentPage]);

  const fetchPaymentHistory = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const params = new URLSearchParams({
        email: user.email,
        status: filter,
        page: currentPage.toString(),
        pageSize: '10'
      });

      const response = await fetch(`/api/payment/history?${params}`);
      const data = await response.json();

      if (data.success) {
        setPayments(data.payments);
        setHasNextPage(data.pagination.hasNextPage);
      }
    } catch (error) {
      console.error('결제 내역 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStatistics = async () => {
    if (!user?.email) return;

    try {
      const response = await fetch('/api/payment/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, period })
      });

      const data = await response.json();
      if (data.success) {
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error('결제 통계 조회 오류:', error);
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
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      succeeded: { label: '성공', className: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      completed: { label: '완료', className: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
      failed: { label: '실패', className: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
      refunded: { label: '환불', className: 'bg-gray-100 text-gray-800 border-gray-200', icon: RotateCcw },
      partially_refunded: { label: '부분환불', className: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: RotateCcw },
      pending: { label: '대기중', className: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertCircle },
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

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchPaymentHistory();
    fetchPaymentStatistics();
  };

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-green-50/20 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h1>
          <p className="text-gray-600 mb-6">결제 내역을 확인하려면 로그인해주세요.</p>
          <Button asChild>
            <a href="/login">로그인하기</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-green-50/20 to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💳 결제 내역</h1>
          <p className="text-xl text-gray-600">
            {user.name || user.email}님의 결제 내역을 확인하세요
          </p>
        </div>

        {/* 통계 카드 */}
        {statistics && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">총 결제액</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(statistics.totalPayments, 'krw')}
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
                    <p className="text-sm font-medium text-gray-600">총 환불액</p>
                    <p className="text-3xl font-bold text-red-600">
                      {formatCurrency(statistics.totalRefunds, 'krw')}
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
                    <p className="text-sm font-medium text-gray-600">순 결제액</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatCurrency(statistics.netAmount, 'krw')}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">결제 건수</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {statistics.paymentCount}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 필터 및 검색 */}
        <Card className="mb-8 shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="결제 ID, 여행지로 검색..."
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
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="succeeded">성공</SelectItem>
                    <SelectItem value="completed">완료</SelectItem>
                    <SelectItem value="failed">실패</SelectItem>
                    <SelectItem value="refunded">환불</SelectItem>
                    <SelectItem value="partially_refunded">부분환불</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-32 h-12">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">1주일</SelectItem>
                    <SelectItem value="month">1개월</SelectItem>
                    <SelectItem value="year">1년</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={handleRefresh} variant="outline" className="h-12">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  새로고침
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 결제 내역 */}
        <div className="space-y-6">
          {payments.map((payment) => (
            <Card key={payment.id} className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {payment.metadata?.destination || '동남아 여행'}
                      </h3>
                      {getStatusBadge(payment.status)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>결제일: {formatDate(payment.createdAt)}</span>
                      {payment.metadata?.duration && (
                        <span>• 기간: {payment.metadata.duration}</span>
                      )}
                      {payment.metadata?.travelers && (
                        <span>• 인원: {payment.metadata.travelers}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {formatCurrency(payment.amount, payment.currency)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.paymentMethod === 'card' ? '신용카드' : payment.paymentMethod}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>결제 ID: {payment.id}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      상세보기
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      영수증
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {payments.length === 0 && !loading && (
            <Card className="shadow-xl border-0">
              <CardContent className="p-12 text-center">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">결제 내역이 없습니다</h3>
                <p className="text-gray-600">아직 결제한 내역이 없습니다.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 페이지네이션 */}
        {payments.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              variant="outline"
            >
              이전
            </Button>
            <span className="text-gray-600">
              {currentPage} 페이지
            </span>
            <Button
              onClick={handleNextPage}
              disabled={!hasNextPage}
              variant="outline"
            >
              다음
            </Button>
          </div>
        )}

        {/* 문의하기 */}
        <Card className="mt-12 shadow-xl border-0 bg-gradient-to-r from-blue-50 to-green-50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              결제 관련 문의사항이 있으신가요?
            </h3>
            <p className="text-gray-600 mb-6">
              결제 오류, 환불 문의, 또는 기타 궁금한 점이 있으시면 언제든 연락주세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PhoneCall phoneNumber="010-5940-0104" className="bg-green-600 hover:bg-green-700">
                <Phone className="w-4 h-4 mr-2" />
                전화 상담
              </PhoneCall>
              <KakaoChat className="bg-yellow-400 hover:bg-yellow-500 text-black">
                <Mail className="w-4 h-4 mr-2" />
                카카오톡 문의
              </KakaoChat>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
