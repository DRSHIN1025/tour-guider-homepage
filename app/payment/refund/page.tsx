'use client';

import { useEffect, useState } from 'react';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  CreditCard,
  Calendar,
  DollarSign,
  Info,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { PhoneCall } from '@/components/PhoneCall';
import { KakaoChat } from '@/components/KakaoChat';

interface Payment {
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
  };
}

interface RefundRequest {
  paymentId: string;
  amount: number;
  reason: string;
  refundType: 'full' | 'partial';
  description: string;
}

export default function RefundPage() {
  const { user } = useLocalAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refundRequest, setRefundRequest] = useState<RefundRequest>({
    paymentId: '',
    amount: 0,
    reason: '',
    refundType: 'full',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      fetchRefundablePayments();
    }
  }, [user]);

  const fetchRefundablePayments = async () => {
    if (!user?.email) return;

    try {
      const params = new URLSearchParams({
        email: user.email,
        status: 'succeeded,completed'
      });

      const response = await fetch(`/api/payment/history?${params}`);
      const data = await response.json();

      if (data.success) {
        // 환불 가능한 결제만 필터링
        const refundablePayments = data.payments.filter((payment: Payment) => 
          payment.status === 'succeeded' || payment.status === 'completed'
        );
        setPayments(refundablePayments);
      }
    } catch (error) {
      console.error('결제 내역 조회 오류:', error);
    }
  };

  const handlePaymentSelect = (payment: Payment) => {
    setSelectedPayment(payment);
    setRefundRequest(prev => ({
      ...prev,
      paymentId: payment.id,
      amount: payment.amount,
      refundType: 'full'
    }));
  };

  const handleRefundRequest = async () => {
    if (!refundRequest.paymentId || !refundRequest.amount || !refundRequest.reason) {
      setError('필수 정보를 모두 입력해주세요.');
      return;
    }

    if (refundRequest.amount <= 0) {
      setError('환불 금액은 0보다 커야 합니다.');
      return;
    }

    if (selectedPayment && refundRequest.amount > selectedPayment.amount) {
      setError('환불 금액이 결제 금액을 초과할 수 없습니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = refundRequest.refundType === 'full' ? '/api/payment/refund' : '/api/payment/refund';
      const method = refundRequest.refundType === 'full' ? 'POST' : 'PATCH';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: refundRequest.paymentId,
          amount: refundRequest.amount,
          reason: refundRequest.reason,
          refundType: refundRequest.refundType,
          description: refundRequest.description
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setRefundRequest({
          paymentId: '',
          amount: 0,
          reason: '',
          refundType: 'full',
          description: ''
        });
        setSelectedPayment(null);
        fetchRefundablePayments(); // 목록 새로고침
      } else {
        setError(data.error || '환불 요청 처리에 실패했습니다.');
      }
    } catch (error) {
      setError('환불 요청 중 오류가 발생했습니다.');
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
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      succeeded: { label: '성공', className: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      completed: { label: '완료', className: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
      failed: { label: '실패', className: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.succeeded;
    const Icon = config.icon;

    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-green-50/20 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h1>
          <p className="text-gray-600 mb-6">환불을 요청하려면 로그인해주세요.</p>
          <Button asChild>
            <a href="/login">로그인하기</a>
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-green-50/20 to-blue-50/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">환불 요청 완료!</h1>
          <p className="text-gray-600 mb-6">
            환불 요청이 성공적으로 접수되었습니다. 
            검토 후 3-5일 내에 처리됩니다.
          </p>
          <div className="space-y-3">
            <Link href="/payment/history">
              <Button className="w-full">
                결제 내역 확인
              </Button>
            </Link>
            <Link href="/payment/refund">
              <Button variant="outline" className="w-full" onClick={() => setSuccess(false)}>
                추가 환불 요청
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
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Link href="/payment/history" className="mr-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                결제 내역으로
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🔄 환불 요청</h1>
          <p className="text-xl text-gray-600">
            결제한 여행에 대한 환불을 요청하세요
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* 환불 가능한 결제 목록 */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <CreditCard className="w-5 h-5" />
                  환불 가능한 결제
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {payments.length === 0 ? (
                  <div className="text-center py-8">
                    <RotateCcw className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">환불 가능한 결제가 없습니다</h3>
                    <p className="text-gray-600">완료된 결제가 있어야 환불을 요청할 수 있습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedPayment?.id === payment.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handlePaymentSelect(payment)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {payment.metadata?.destination || '동남아 여행'}
                            </h4>
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusBadge(payment.status)}
                              <span className="text-sm text-gray-500">
                                {formatDate(payment.createdAt)}
                              </span>
                            </div>
                            {payment.metadata?.duration && (
                              <p className="text-sm text-gray-600">
                                기간: {payment.metadata.duration}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600">
                              {formatCurrency(payment.amount, payment.currency)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 환불 요청 폼 */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100">
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <RotateCcw className="w-5 h-5" />
                  환불 요청
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!selectedPayment ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">결제를 선택해주세요</h3>
                    <p className="text-gray-600">왼쪽에서 환불을 원하는 결제를 선택해주세요.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* 선택된 결제 정보 */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">선택된 결제</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-600">여행지:</span>
                          <span className="ml-2 font-medium">{selectedPayment.metadata?.destination}</span>
                        </div>
                        <div>
                          <span className="text-blue-600">결제 금액:</span>
                          <span className="ml-2 font-medium">
                            {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-600">결제일:</span>
                          <span className="ml-2 font-medium">{formatDate(selectedPayment.createdAt)}</span>
                        </div>
                        <div>
                          <span className="text-blue-600">결제 ID:</span>
                          <span className="ml-2 font-medium font-mono text-xs">{selectedPayment.id}</span>
                        </div>
                      </div>
                    </div>

                    {/* 환불 유형 선택 */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        환불 유형 <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={refundRequest.refundType}
                        onValueChange={(value: 'full' | 'partial') => 
                          setRefundRequest(prev => ({ ...prev, refundType: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">전액 환불</SelectItem>
                          <SelectItem value="partial">부분 환불</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 환불 금액 입력 */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        환불 금액 <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={refundRequest.amount}
                          onChange={(e) => setRefundRequest(prev => ({ 
                            ...prev, 
                            amount: parseInt(e.target.value) || 0 
                          }))}
                          placeholder="환불 금액을 입력하세요"
                          className="pr-20"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          {selectedPayment.currency.toUpperCase()}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        최대 환불 가능 금액: {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                      </p>
                    </div>

                    {/* 환불 사유 선택 */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        환불 사유 <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={refundRequest.reason}
                        onValueChange={(value) => 
                          setRefundRequest(prev => ({ ...prev, reason: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="환불 사유를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="schedule_change">일정 변경</SelectItem>
                          <SelectItem value="personal_reason">개인 사정</SelectItem>
                          <SelectItem value="service_issue">서비스 문제</SelectItem>
                          <SelectItem value="price_concern">가격 문제</SelectItem>
                          <SelectItem value="other">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 상세 설명 */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        상세 설명
                      </label>
                      <Textarea
                        value={refundRequest.description}
                        onChange={(e) => setRefundRequest(prev => ({ 
                          ...prev, 
                          description: e.target.value 
                        }))}
                        placeholder="환불 사유에 대한 상세한 설명을 입력해주세요..."
                        rows={4}
                      />
                    </div>

                    {/* 오류 메시지 */}
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    )}

                    {/* 환불 요청 버튼 */}
                    <Button
                      onClick={handleRefundRequest}
                      disabled={loading || !refundRequest.paymentId || !refundRequest.amount || !refundRequest.reason}
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          처리 중...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          환불 요청하기
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 환불 정책 안내 */}
            <Card className="shadow-xl border-0 bg-amber-50 border-amber-100">
              <CardContent className="p-6">
                <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  환불 정책 안내
                </h3>
                <div className="space-y-2 text-sm text-amber-700">
                  <p>• 여행 시작 30일 전: 전액 환불</p>
                  <p>• 여행 시작 15일 전: 80% 환불</p>
                  <p>• 여행 시작 7일 전: 50% 환불</p>
                  <p>• 여행 시작 7일 이내: 환불 불가</p>
                  <p>• 환불 처리 기간: 3-5일 (영업일 기준)</p>
                </div>
              </CardContent>
            </Card>

            {/* 문의하기 */}
            <Card className="shadow-xl border-0">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-3">환불 관련 문의사항</h3>
                <p className="text-sm text-gray-600 mb-4">
                  환불 정책이나 처리 과정에 궁금한 점이 있으시면 연락주세요.
                </p>
                <div className="flex gap-3 justify-center">
                  <PhoneCall phoneNumber="010-5940-0104" size="sm" variant="outline">
                    전화 문의
                  </PhoneCall>
                  <KakaoChat size="sm" variant="outline">
                    카카오톡 문의
                  </KakaoChat>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
