"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  CreditCard, 
  Calendar, 
  MessageCircle,
  Download,
  ArrowRight
} from "lucide-react"
import { getCheckoutSession } from '@/lib/stripe'
import { toast } from "sonner"
import Link from "next/link"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails()
    }
  }, [sessionId])

  const fetchSessionDetails = async () => {
    try {
      const response = await fetch(`/api/payment/session?session_id=${sessionId}`)
      const data = await response.json()
      
      if (data.session) {
        setSession(data.session)
      }
    } catch (error) {
      console.error('세션 정보 조회 오류:', error)
      toast.error('결제 정보를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p>결제 정보를 확인하는 중...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* 성공 메시지 */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                결제가 완료되었습니다!
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              안전한 결제가 성공적으로 처리되었습니다.
              <br />
              이제 전문 가이드와 함께 특별한 여행을 준비해보세요!
            </p>
          </div>

          {/* 결제 정보 */}
          <Card className="max-w-2xl mx-auto mb-8">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <CreditCard className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold">결제 정보</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">결제 상태:</span>
                  <Badge className="bg-green-100 text-green-800">
                    결제 완료
                  </Badge>
                </div>
                
                {session && (
                  <>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">결제 금액:</span>
                      <span className="text-xl font-bold text-emerald-600">
                        {new Intl.NumberFormat('ko-KR', {
                          style: 'currency',
                          currency: 'KRW'
                        }).format(session.amount_total || 0)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">결제 방법:</span>
                      <span className="text-gray-700">
                        {session.payment_method_types?.[0] === 'card' ? '신용카드' : '기타'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">결제 일시:</span>
                      <span className="text-gray-700">
                        {new Date(session.created * 1000).toLocaleString('ko-KR')}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 다음 단계 안내 */}
          <Card className="max-w-2xl mx-auto mb-8">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">다음 단계</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">상담 일정 조율</h3>
                    <p className="text-gray-600">
                      24시간 내에 전문 가이드가 연락드려 상담 일정을 조율합니다.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">맞춤 여행 계획</h3>
                    <p className="text-gray-600">
                      상담을 통해 당신만을 위한 완벽한 여행 계획을 수립합니다.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">여행 실행</h3>
                    <p className="text-gray-600">
                      계획된 일정에 따라 현지 가이드와 함께 특별한 여행을 시작합니다.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 액션 버튼 */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  마이페이지에서 확인
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <Link href="/reviews">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  여행 후기 작성
                </Button>
              </Link>
            </div>
            
            <Link href="/">
              <Button variant="ghost" className="text-gray-600">
                홈으로 돌아가기
              </Button>
            </Link>
          </div>

          {/* 연락처 정보 */}
          <div className="mt-16 text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">문의사항이 있으신가요?</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📧 help@tourguider.com</p>
                  <p>📞 1588-0000</p>
                  <p>🕒 평일 9:00-18:00</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p>결제 정보를 확인하는 중...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
} 