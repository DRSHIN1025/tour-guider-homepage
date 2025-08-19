'use client'

import { useEffect, useState, Suspense } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, MapPin, Calendar, Users } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState({
    amount: 10000,
    currency: 'KRW',
    status: 'complete',
    destination: '베트남 하노이',
    duration: '3박4일',
    people: '성인 2명'
  });

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // 실제 세션 데이터 조회 (나중에 구현)
      fetch(`/api/payment/session/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.metadata) {
            setPaymentData({
              amount: data.amount_total || 10000,
              currency: data.currency?.toUpperCase() || 'KRW',
              status: data.status || 'complete',
              destination: data.metadata.destination || '베트남 하노이',
              duration: data.metadata.duration || '3박4일',
              people: data.metadata.people || '성인 2명'
            });
          }
        })
        .catch(error => {
          console.error('Failed to fetch session data:', error);
        });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  결제가 완료되었습니다!
                </h1>
                <p className="text-gray-600">
                  예약금 결제가 성공적으로 처리되었습니다.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-green-50 p-6 rounded-xl">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">결제 정보</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">결제 금액:</span>
                      <span className="font-bold text-green-600">
                        {paymentData.amount.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">결제 상태:</span>
                      <Badge className="bg-green-100 text-green-800">
                        {paymentData.status === 'complete' ? '완료' : '처리중'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">여행 정보</h2>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600">여행지:</span>
                      <span className="font-semibold">{paymentData.destination}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600">기간:</span>
                      <span className="font-semibold">{paymentData.duration}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-600">인원:</span>
                      <span className="font-semibold">{paymentData.people}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-xl">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">다음 단계</h2>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>• 24시간 내에 현지 가이드가 연락드립니다</p>
                    <p>• 상세한 여행 일정을 협의합니다</p>
                    <p>• 여행 전 안전 가이드를 제공합니다</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 mb-4">
                  문의사항이 있으시면 카카오톡으로 연락해주세요
                </p>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-xl transition-colors">
                  카카오톡 문의하기
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">결제 정보를 확인하는 중...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
