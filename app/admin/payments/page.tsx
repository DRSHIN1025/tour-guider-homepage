'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, updateDoc, query, orderBy, where, limit, startAfter } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Mail,
  LogOut,
  MapPin,
  Users,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  FileText,
  X
} from "lucide-react";
import Link from "next/link";
import { commonClasses } from "@/lib/design-system";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customerEmail: string;
  customerName?: string;
  createdAt: any;
  updatedAt: any;
  paidAt?: any;
  refundedAt?: any;
  paymentMethod: string;
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  metadata: {
    quoteId?: string;
    destination?: string;
    duration?: string;
    travelers?: string;
  };
  refundAmount?: number;
  refundReason?: string;
}

interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  currency: string;
  reason: string;
  refundType: string;
  status: string;
  createdAt: any;
  customerEmail: string;
}

interface PaymentStatistics {
  totalPayments: number;
  totalAmount: number;
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
    pending: number;
  };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [statistics, setStatistics] = useState<PaymentStatistics | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const router = useRouter();

  // 인증 확인
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminAuth = localStorage.getItem('adminAuth');
      if (!adminAuth) {
        router.push('/admin/login');
        return;
      }
    }
  }, [router]);

  // 결제 데이터 로드
  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      let paymentsData: Payment[] = [];
      let paymentsSnapshot: any = null;
      
      if (db) {
        // Firebase가 설정되어 있을 때
        const paymentsQuery = query(
          collection(db, 'payments'),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        
        paymentsSnapshot = await getDocs(paymentsQuery);
        paymentsData = paymentsSnapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        })) as Payment[];
      } else {
        // Firebase가 없을 때 임시 데이터 사용
        const tempPayments = JSON.parse(localStorage.getItem('tempPayments') || '[]');
        paymentsData = tempPayments;
      }
      
      setPayments(paymentsData);
      setFilteredPayments(paymentsData);
      
      if (paymentsData.length === 20 && paymentsSnapshot) {
        setLastDoc(paymentsSnapshot.docs[paymentsSnapshot.docs.length - 1]);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
      
      // 통계 계산
      calculateStatistics(paymentsData);
    } catch (error) {
      console.error('결제 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 환불 데이터 로드
  const fetchRefunds = async () => {
    try {
      let refundsData: Refund[] = [];
      
      if (db) {
        // Firebase가 설정되어 있을 때
        const refundsQuery = query(
          collection(db, 'refunds'),
          orderBy('createdAt', 'desc')
        );
        
        const refundsSnapshot = await getDocs(refundsQuery);
        refundsData = refundsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Refund[];
      } else {
        // Firebase가 없을 때 임시 데이터 사용
        const tempRefunds = JSON.parse(localStorage.getItem('tempRefunds') || '[]');
        refundsData = tempRefunds;
      }
      
      setRefunds(refundsData);
    } catch (error) {
      console.error('환불 데이터 로드 실패:', error);
    }
  };

  // 통계 계산
  const calculateStatistics = (paymentsData: Payment[]) => {
    const totalAmount = paymentsData.reduce((sum, payment) => {
      if (payment.status === 'succeeded' || payment.status === 'completed') {
        return sum + payment.amount;
      }
      return sum;
    }, 0);

    const totalRefunds = refunds.reduce((sum, refund) => sum + refund.amount, 0);
    const netAmount = totalAmount - totalRefunds;

    const statusCounts = {
      succeeded: paymentsData.filter(p => p.status === 'succeeded').length,
      completed: paymentsData.filter(p => p.status === 'completed').length,
      failed: paymentsData.filter(p => p.status === 'failed').length,
      refunded: paymentsData.filter(p => p.status === 'refunded').length,
      partially_refunded: paymentsData.filter(p => p.status === 'partially_refunded').length,
      pending: paymentsData.filter(p => p.status === 'pending').length,
    };

    setStatistics({
      totalPayments: paymentsData.length,
      totalAmount,
      totalRefunds,
      netAmount,
      paymentCount: paymentsData.filter(p => p.status === 'succeeded' || p.status === 'completed').length,
      refundCount: refunds.length,
      statusCounts
    });
  };

  // 필터링 및 검색
  useEffect(() => {
    let filtered = payments;

    if (filter !== 'all') {
      filtered = filtered.filter(payment => payment.status === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.customerName && payment.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPayments(filtered);
  }, [payments, filter, searchTerm]);

  // 초기 데이터 로드
  useEffect(() => {
    fetchPayments();
    fetchRefunds();
  }, []);

  // 더 많은 데이터 로드
  const loadMore = async () => {
    if (!hasMore || !lastDoc || !db) return;

    try {
      const morePaymentsQuery = query(
        collection(db, 'payments'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(20)
      );
      
      const morePaymentsSnapshot = await getDocs(morePaymentsQuery);
      const morePaymentsData = morePaymentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Payment[];
      
      setPayments(prev => [...prev, ...morePaymentsData]);
      setFilteredPayments(prev => [...prev, ...morePaymentsData]);
      
      if (morePaymentsData.length === 20) {
        setLastDoc(morePaymentsSnapshot.docs[morePaymentsSnapshot.docs.length - 1]);
      } else {
        setHasMore(false);
      }
      
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error('추가 데이터 로드 실패:', error);
    }
  };

  // CSV 내보내기
  const handleExportCSV = () => {
    const headers = ['ID', '고객명', '이메일', '금액', '상태', '결제방법', '생성일', '여행지'];
    const csvData = filteredPayments.map(payment => [
      payment.id,
      payment.customerName || '-',
      payment.customerEmail,
      payment.amount,
      payment.status,
      payment.paymentMethod,
      new Date(payment.createdAt?.toDate?.() || payment.createdAt).toLocaleDateString('ko-KR'),
      payment.metadata?.destination || '-'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // 상태 배지 렌더링
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      succeeded: { label: '성공', className: 'bg-green-100 text-green-800' },
      completed: { label: '완료', className: 'bg-blue-100 text-blue-800' },
      failed: { label: '실패', className: 'bg-red-100 text-red-800' },
      refunded: { label: '환불됨', className: 'bg-yellow-100 text-yellow-800' },
      partially_refunded: { label: '부분환불', className: 'bg-orange-100 text-orange-800' },
      pending: { label: '대기중', className: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, className: 'bg-gray-100 text-gray-800' };

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  // 통화 포맷팅
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-green-50/20 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
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
              <Button onClick={handleExportCSV} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                CSV 내보내기
              </Button>
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
              className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300"
            >
              견적 관리
            </Link>
            <Link 
              href="/admin/payments"
              className="px-6 py-4 text-sm font-medium text-gray-900 border-b-2 border-blue-600"
            >
              결제 관리
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={commonClasses.container + " py-8"}>
        {/* Statistics Cards */}
        {statistics && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">총 결제 금액</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(statistics.totalAmount, 'KRW')}
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
                    <p className="text-3xl font-bold text-red-600">
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
                    <p className="text-sm font-medium text-gray-600">순 수익</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatCurrency(statistics.netAmount, 'KRW')}
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
                    <p className="text-sm font-medium text-gray-600">총 결제 건수</p>
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

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-xl border-0 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="고객명, 이메일, ID로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="상태별 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="succeeded">성공</SelectItem>
                  <SelectItem value="completed">완료</SelectItem>
                  <SelectItem value="failed">실패</SelectItem>
                  <SelectItem value="refunded">환불됨</SelectItem>
                  <SelectItem value="partially_refunded">부분환불</SelectItem>
                  <SelectItem value="pending">대기중</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={fetchPayments} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              새로고침
            </Button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-xl border-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    결제 정보
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    고객 정보
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    금액
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    생성일
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 font-mono">
                            {payment.id.slice(0, 8)}...
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.paymentMethod}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {payment.customerName || '이름 없음'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.customerEmail}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </div>
                      {payment.refundAmount && (
                        <div className="text-sm text-red-600">
                          환불: {formatCurrency(payment.refundAmount, payment.currency)}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      {getStatusBadge(payment.status)}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(payment.createdAt?.toDate?.() || payment.createdAt).toLocaleDateString('ko-KR')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(payment.createdAt?.toDate?.() || payment.createdAt).toLocaleTimeString('ko-KR')}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <Button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowPaymentModal(true);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        상세보기
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {hasMore && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-center">
                <Button onClick={loadMore} variant="outline" size="sm">
                  더 보기
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Detail Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">결제 상세 정보</h2>
                <Button
                  onClick={() => setShowPaymentModal(false)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">결제 정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">결제 ID:</span>
                      <span className="font-medium font-mono">{selectedPayment.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">고객명:</span>
                      <span className="font-medium">{selectedPayment.customerName || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">이메일:</span>
                      <span className="font-medium">{selectedPayment.customerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">결제 금액:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">상태:</span>
                      {getStatusBadge(selectedPayment.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">결제 방법:</span>
                      <span className="font-medium">{selectedPayment.paymentMethod}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">여행 정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">여행지:</span>
                      <span className="font-medium">{selectedPayment.metadata?.destination || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">기간:</span>
                      <span className="font-medium">{selectedPayment.metadata?.duration || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">인원:</span>
                      <span className="font-medium">{selectedPayment.metadata?.travelers || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">견적 ID:</span>
                      <span className="font-medium font-mono">{selectedPayment.metadata?.quoteId || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedPayment.refundAmount && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-800 mb-2">환불 정보</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-yellow-700">환불 금액:</span>
                      <span className="font-medium text-yellow-800">
                        {formatCurrency(selectedPayment.refundAmount, selectedPayment.currency)}
                      </span>
                    </div>
                    {selectedPayment.refundReason && (
                      <div className="flex justify-between">
                        <span className="text-yellow-700">환불 사유:</span>
                        <span className="font-medium text-yellow-800">{selectedPayment.refundReason}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <Button 
                    variant="outline"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    닫기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
