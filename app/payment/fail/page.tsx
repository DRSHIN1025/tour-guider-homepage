'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { XCircle, ArrowLeft, RefreshCw, Phone } from 'lucide-react'
import Link from 'next/link'

function PaymentFailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorInfo, setErrorInfo] = useState({
    orderId: '',
    errorCode: '',
    errorMessage: ''
  })

  useEffect(() => {
    const orderId = searchParams.get('orderId') || ''
    const errorCode = searchParams.get('code') || 'UNKNOWN'
    const errorMessage = searchParams.get('message') || '결제 처리 중 오류가 발생했습니다.'
    
    setErrorInfo({
      orderId,
      errorCode,
      errorMessage
    })
  }, [searchParams])

  const getErrorDescription = (code: string) => {
    const errorDescriptions: { [key: string]: string } = {
      'CARD_EXPIRED': '카드 유효기간이 만료되었습니다.',
      'INSUFFICIENT_FUNDS': '잔액이 부족합니다.',
      'INVALID_CARD': '유효하지 않은 카드입니다.',
      'PAYMENT_TIMEOUT': '결제 시간이 초과되었습니다.',
      'USER_CANCEL': '사용자가 결제를 취소했습니다.',
      'NETWORK_ERROR': '네트워크 오류가 발생했습니다.',
      'UNKNOWN': '알 수 없는 오류가 발생했습니다.'
    }
    
    return errorDescriptions[code] || errorDescriptions['UNKNOWN']
  }

  const handleRetryPayment = () => {
    router.push('/payment')
  }

  const handleContactSupport = () => {
    // 고객센터 연결 (실제로는 전화나 채팅 연결)
    window.open('tel:1588-0000')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">결제 실패</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-gray-600">결제 처리 중 문제가 발생했습니다.</p>
            <p className="text-sm text-gray-500">다시 시도하거나 고객센터로 문의해주세요.</p>
          </div>

          {/* 오류 정보 */}
          {errorInfo.orderId && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">주문번호</span>
                <span className="text-sm font-mono">{errorInfo.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">오류코드</span>
                <span className="text-sm font-mono text-red-600">{errorInfo.errorCode}</span>
              </div>
            </div>
          )}

          {/* 오류 설명 */}
          <div className="bg-red-50 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2">오류 원인</h3>
            <p className="text-sm text-red-800">
              {getErrorDescription(errorInfo.errorCode)}
            </p>
          </div>

          {/* 해결 방법 안내 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">해결 방법</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 카드 정보를 다시 확인해주세요</li>
              <li>• 다른 결제 방법을 시도해보세요</li>
              <li>• 잠시 후 다시 시도해주세요</li>
              <li>• 문제가 지속되면 고객센터로 연락해주세요</li>
            </ul>
          </div>

          {/* 액션 버튼들 */}
          <div className="space-y-3">
            <Button 
              onClick={handleRetryPayment}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              다시 결제하기
            </Button>
            
            <Button 
              onClick={handleContactSupport}
              variant="outline" 
              className="w-full"
            >
              <Phone className="w-4 h-4 mr-2" />
              고객센터 연결 (1588-0000)
            </Button>
            
            <Link href="/" className="block">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                메인으로 돌아가기
              </Button>
            </Link>
          </div>

          {/* 추가 안내 */}
          <div className="text-center text-xs text-gray-500">
            <p>결제 과정에서 문제가 발생했지만</p>
            <p>카드에서 결제가 이루어진 경우 자동으로 취소됩니다</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">오류 정보를 확인하는 중...</p>
        </div>
      </div>
    }>
      <PaymentFailContent />
    </Suspense>
  )
}
