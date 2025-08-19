'use client'

import { useState, Suspense } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, CheckCircle, MapPin, Calendar, Users } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [paymentData, setPaymentData] = useState({
    destination: searchParams.get('destination') || '베트남 하노이',
    duration: searchParams.get('duration') || '3박4일',
    people: searchParams.get('people') || '성인 2명',
    amount: 10000
  });

  const handlePayment = async () => {
    try {
      const response = await fetch('/api/payment/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(result.url);
      } else {
        alert('결제 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  예약금 결제
                </h1>
                <p className="text-gray-600">
                  안전한 결제 시스템을 통해 예약금을 결제하세요
                </p>
              </div>

              <div className="space-y-6">
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

                <div className="bg-green-50 p-6 rounded-xl">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">결제 정보</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">예약금:</span>
                      <span className="text-2xl font-bold text-green-600">
                        {paymentData.amount.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">결제 방법:</span>
                      <Badge className="bg-green-100 text-green-800">
                        신용카드
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-xl">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">결제 안내</h2>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>• 예약금은 여행 확정 시 본금에서 차감됩니다</p>
                    <p>• 취소 시 100% 환불됩니다 (여행 7일 전까지)</p>
                    <p>• 결제 후 24시간 내에 현지 가이드가 연락드립니다</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button 
                  onClick={handlePayment}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-lg"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {paymentData.amount.toLocaleString()}원 결제하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">결제 페이지를 로딩하는 중...</p>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}
