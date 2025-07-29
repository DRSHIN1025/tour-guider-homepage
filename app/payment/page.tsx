"use client"

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, 
  CheckCircle, 
  Star, 
  Users, 
  Clock, 
  MessageCircle,
  Loader2,
  Shield,
  Zap
} from "lucide-react"
import { PRODUCTS } from '@/lib/stripe'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'

const SERVICES = [
  {
    id: 'BASIC_CONSULTATION',
    name: '기본 상담 서비스',
    price: '50,000원',
    originalPrice: '80,000원',
    description: '전문 가이드와의 1:1 맞춤 상담',
    features: [
      '전문 가이드 1:1 상담 (30분)',
      '맞춤 여행 일정 제안',
      '현지 맛집 및 관광지 추천',
      '이메일 상담 지원',
      '기본 여행 가이드북 제공'
    ],
    popular: false,
    icon: MessageCircle
  },
  {
    id: 'PREMIUM_CONSULTATION',
    name: '프리미엄 상담 서비스',
    price: '100,000원',
    originalPrice: '150,000원',
    description: 'VIP 맞춤 여행 계획 및 상담',
    features: [
      '전문 가이드 1:1 상담 (60분)',
      '상세한 맞춤 여행 계획서',
      '현지 맛집 및 숨은 명소 추천',
      '전화/이메일 상담 지원',
      '프리미엄 여행 가이드북 제공',
      '항공/숙박 예약 도움',
      '현지 교통편 안내'
    ],
    popular: true,
    icon: Star
  },
  {
    id: 'FULL_PACKAGE',
    name: '완전 패키지 서비스',
    price: '200,000원',
    originalPrice: '300,000원',
    description: '여행 계획부터 현지 가이드까지 모든 서비스',
    features: [
      '전문 가이드 1:1 상담 (90분)',
      '완벽한 맞춤 여행 계획서',
      '항공/숙박 예약 대행',
      '현지 가이드 현지 배정',
      '24시간 긴급 연락망 제공',
      '여행 중 실시간 상담',
      '여행 후기 및 사진 정리',
      'VIP 전용 서비스'
    ],
    popular: false,
    icon: Zap
  }
]

export default function PaymentPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    if (!user) {
      toast.error('로그인이 필요합니다.')
      return
    }

    if (!selectedService) {
      toast.error('서비스를 선택해주세요.')
      return
    }

    setLoading(true)

    try {
      // 환경 변수가 없으면 테스트 모드로 진행
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        toast.success('개발 모드: 결제 시뮬레이션을 진행합니다.')
        setTimeout(() => {
          window.location.href = '/payment/success?session_id=test_session_' + Date.now()
        }, 2000)
        return
      }

      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedService,
          userId: user.uid,
        }),
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.error)
        return
      }

      // Stripe 결제 페이지로 리다이렉트
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('결제 오류:', error)
      toast.error('결제 처리 중 오류가 발생했습니다. 개발 중에는 테스트 모드로 진행됩니다.')
      
      // 개발 중에는 성공 페이지로 이동 (테스트용)
      setTimeout(() => {
        window.location.href = '/payment/success?session_id=test_session'
      }, 1000)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
            <p className="text-gray-600 mb-6">
              결제를 위해 로그인해주세요.
            </p>
            <Button onClick={() => router.push('/')}>
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                전문적인
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                여행 상담 서비스
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              현지 전문가와 함께하는 맞춤형 여행 계획
              <br />
              당신만을 위한 특별한 여행 경험을 만들어드립니다
            </p>
          </div>

          {/* 서비스 선택 */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {SERVICES.map((service) => {
              const IconComponent = service.icon
              const isSelected = selectedService === service.id
              
              return (
                <Card 
                  key={service.id} 
                  className={`relative cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    isSelected ? 'ring-2 ring-emerald-500 shadow-lg' : 'hover:-translate-y-2'
                  } ${service.popular ? 'border-emerald-500' : ''}`}
                  onClick={() => setSelectedService(service.id)}
                >
                  {service.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-emerald-600 text-white px-4 py-1">
                        인기 서비스
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-emerald-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      {service.name}
                    </CardTitle>
                    <p className="text-gray-600">{service.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <span className="text-3xl font-bold text-emerald-600">
                          {service.price}
                        </span>
                        <span className="text-lg text-gray-400 line-through">
                          {service.originalPrice}
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        할인가
                      </Badge>
                    </div>
                    
                    <ul className="space-y-3">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full ${
                        isSelected 
                          ? 'bg-emerald-600 hover:bg-emerald-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isSelected ? '선택됨' : '선택하기'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* 결제 버튼 */}
          {selectedService && (
            <div className="text-center">
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <Shield className="w-6 h-6 text-emerald-600" />
                    <h3 className="text-xl font-semibold">안전한 결제</h3>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">선택한 서비스:</span>
                      <span className="text-emerald-600 font-semibold">
                        {SERVICES.find(s => s.id === selectedService)?.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">결제 금액:</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        {SERVICES.find(s => s.id === selectedService)?.price}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 text-lg font-bold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        결제 처리 중...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        안전하게 결제하기
                      </>
                    )}
                  </Button>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    Stripe를 통한 안전한 결제 시스템을 사용합니다
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 추가 정보 */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">안전한 결제</h3>
              <p className="text-gray-600">
                Stripe의 보안 시스템으로 안전하게 결제하세요
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">빠른 처리</h3>
              <p className="text-gray-600">
                결제 즉시 서비스가 활성화됩니다
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">전문 상담</h3>
              <p className="text-gray-600">
                현지 전문가와 1:1 맞춤 상담
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 