"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"
import { MapPin, Clock, Users, Calendar, MessageCircle, Phone, Mail, Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"

export default function QuotePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const [formData, setFormData] = useState({
    destination: '',
    duration: '',
    people: '',
    budget: '',
    travelDate: '',
    specialRequests: '',
    contactMethod: 'email',
    phone: '',
    email: user?.email || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('로그인이 필요합니다.')
      return
    }

    if (!formData.destination || !formData.duration || !formData.people) {
      toast.error('필수 항목을 모두 입력해주세요.')
      return
    }

    setLoading(true)

    try {
      const quoteData = {
        ...formData,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0],
        userEmail: user.email,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await addDoc(collection(db, 'quotes'), quoteData)
      
      toast.success('견적 요청이 성공적으로 제출되었습니다!')
      setSubmitted(true)
    } catch (error) {
      console.error('견적 요청 오류:', error)
      toast.error('견적 요청 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30 py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                견적 요청 완료!
              </h1>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                요청하신 견적을 검토하여 24시간 내에 이메일로 답변드리겠습니다.
                <br />
                추가 문의사항이 있으시면 언제든 연락주세요.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>help@tourguider.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>1588-0000</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button className="w-full sm:w-auto">
                    홈으로 돌아가기
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full sm:w-auto">
                    마이페이지에서 확인
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                맞춤 견적 요청
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              현지 전문 가이드들이 직접 맞춤 여행 일정을 제안해드립니다.
              <br />
              여러 견적을 비교하고 가장 마음에 드는 여행을 선택하세요.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    여행 정보 입력
                  </CardTitle>
                  <p className="text-gray-600">
                    원하는 여행 정보를 입력해주시면 현지 가이드들이 맞춤 견적을 제안해드립니다.
                  </p>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                          여행지 *
                        </label>
                        <Input
                          placeholder="베트남, 태국, 필리핀..."
                          value={formData.destination}
                          onChange={(e) => handleInputChange('destination', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-blue-600" />
                          여행 기간 *
                        </label>
                        <Input
                          placeholder="3박4일, 4박5일..."
                          value={formData.duration}
                          onChange={(e) => handleInputChange('duration', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                          <Users className="w-4 h-4 mr-2 text-purple-600" />
                          인원 *
                        </label>
                        <Input
                          placeholder="성인 2명, 아동 1명..."
                          value={formData.people}
                          onChange={(e) => handleInputChange('people', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                          예상 여행일
                        </label>
                        <Input
                          type="date"
                          value={formData.travelDate}
                          onChange={(e) => handleInputChange('travelDate', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        예산 범위
                      </label>
                      <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="예산 범위를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100-200">100-200만원</SelectItem>
                          <SelectItem value="200-300">200-300만원</SelectItem>
                          <SelectItem value="300-400">300-400만원</SelectItem>
                          <SelectItem value="400-500">400-500만원</SelectItem>
                          <SelectItem value="500+">500만원 이상</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        특별 요청사항
                      </label>
                      <Textarea
                        placeholder="특별히 원하는 활동, 식사, 숙박 스타일 등이 있다면 알려주세요..."
                        value={formData.specialRequests}
                        onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        연락 방법
                      </label>
                      <Select value={formData.contactMethod} onValueChange={(value) => handleInputChange('contactMethod', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">이메일</SelectItem>
                          <SelectItem value="phone">전화</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {formData.contactMethod === 'phone' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          전화번호
                        </label>
                        <Input
                          type="tel"
                          placeholder="010-1234-5678"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                    )}
                    
                    <Button
                      type="submit"
                      className="w-full h-12 text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          견적 요청 중...
                        </>
                      ) : (
                        '맞춤 견적 요청하기'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-800">
                    서비스 특징
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">전문 현지 가이드</h4>
                      <p className="text-sm text-gray-600">1,000+ 현지 전문가들이 직접 제안</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">빠른 응답</h4>
                      <p className="text-sm text-gray-600">24시간 내 견적 제안</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">맞춤 상담</h4>
                      <p className="text-sm text-gray-600">개인별 맞춤 여행 계획</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-800">
                    연락처
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-gray-800">1588-0000</p>
                      <p className="text-sm text-gray-600">평일 9:00-18:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-gray-800">help@tourguider.com</p>
                      <p className="text-sm text-gray-600">24시간 이메일 상담</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 