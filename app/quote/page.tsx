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
    email: user?.email || '',
    name: user?.displayName || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 필수 항목 검증 (로그인 불필요)
    if (!formData.destination || !formData.duration || !formData.people) {
      toast.error('필수 항목을 모두 입력해주세요.')
      return
    }

    // 연락처 정보 검증
    if (!formData.email && !formData.phone) {
      toast.error('이메일 또는 전화번호를 입력해주세요.')
      return
    }

    if (!formData.name) {
      toast.error('이름을 입력해주세요.')
      return
    }

    setLoading(true)

    try {
      console.log('🔥 Firebase 연결 시도 시작...');
      console.log('🔥 DB 객체 상태:', db);
      console.log('🔥 Firebase 앱 상태:', db.app);
      console.log('🔥 Firebase 프로젝트 ID:', db.app.options.projectId);
      
      const quoteData = {
        ...formData,
        userId: user?.uid || 'anonymous',
        userName: formData.name || user?.displayName || '익명',
        userEmail: formData.email || user?.email || '',
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      console.log('🔥 전송할 데이터:', quoteData);
      console.log('🔥 Firestore 컬렉션 참조 생성 중...');
      
      const quotesCollection = collection(db, 'quotes');
      console.log('🔥 컬렉션 참조 생성 완료:', quotesCollection);
      
      console.log('🔥 Firestore에 문서 추가 중...');
      const docRef = await addDoc(quotesCollection, quoteData);
      
      console.log('🔥 ✅ 견적 요청 성공!');
      console.log('🔥 ✅ 생성된 문서 ID:', docRef.id);
      console.log('🔥 ✅ 문서 경로:', docRef.path);
      
      toast.success('견적 요청이 성공적으로 제출되었습니다!')
      setSubmitted(true)
    } catch (error) {
      console.error('🔥 ❌ 견적 요청 실패!');
      console.error('🔥 ❌ 오류 타입:', typeof error);
      console.error('🔥 ❌ 오류 객체:', error);
      
      if (error instanceof Error) {
        console.error('🔥 ❌ 오류 메시지:', error.message);
        console.error('🔥 ❌ 오류 스택:', error.stack);
        toast.error(`견적 요청 실패: ${error.message}`)
      } else {
        console.error('🔥 ❌ 알 수 없는 오류:', error);
        toast.error('견적 요청 중 알 수 없는 오류가 발생했습니다.')
      }
      
      // Firebase 연결 상태 재확인
      console.log('🔥 ❌ Firebase 재확인:');
      console.log('🔥 ❌ DB 상태:', db);
      console.log('🔥 ❌ 앱 상태:', db?.app);
      console.log('🔥 ❌ 프로젝트 ID:', db?.app?.options?.projectId);
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
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                견적 요청이 완료되었습니다!
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                전문 여행 플래너가 24시간 내에 맞춤 견적을 보내드립니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button size="lg" variant="outline" className="px-8">
                    홈으로 돌아가기
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" className="px-8">
                    내 견적 확인하기
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
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            맞춤 여행 견적 요청
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            단계별로 정보를 입력하시면 전문 가이드들이 맞춤 견적을 보내드립니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <span className="ml-2 text-sm font-medium text-emerald-600">여행 기본 정보</span>
              </div>
              <div className="w-16 h-1 bg-emerald-200"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <span className="ml-2 text-sm font-medium text-emerald-600">세부 요청사항</span>
              </div>
              <div className="w-16 h-1 bg-emerald-200"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="ml-2 text-sm font-medium text-blue-600">연락처 정보</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-gray-800">연락처 정보</CardTitle>
              <p className="text-gray-600">견적을 받을 연락처를 알려주세요</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="홍길동"
                    className="h-12"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="010-1234-5678"
                    className="h-12"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  이메일 (선택)
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@email.com"
                  className="h-12"
                />
              </div>

              {/* Travel Information Summary */}
              <div className="bg-gray-50 rounded-xl p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
                  견적 요청 요약
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div><strong>여행지:</strong> {formData.destination || '미정'}</div>
                  <div><strong>기간:</strong> {formData.duration || '미정'}</div>
                  <div><strong>인원:</strong> {formData.people || '미정'}</div>
                  <div><strong>예산:</strong> {formData.budget || '미정'}</div>
                  <div className="md:col-span-2"><strong>여행 날짜:</strong> {formData.travelDate || '미정'}</div>
                </div>
              </div>

              {/* Hidden fields for travel data with proper attributes */}
              <input type="hidden" name="destination" value={formData.destination} />
              <input type="hidden" name="duration" value={formData.duration} />
              <input type="hidden" name="people" value={formData.people} />
              <input type="hidden" name="budget" value={formData.budget} />
              <input type="hidden" name="travelDate" value={formData.travelDate} />
              <input type="hidden" name="specialRequests" value={formData.specialRequests} />

              <div className="flex justify-between pt-6">
                <Link href="/">
                  <Button type="button" variant="outline" size="lg" className="px-8">
                    <MapPin className="w-4 h-4 mr-2" />
                    이전
                  </Button>
                </Link>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={loading}
                  className="px-12 bg-emerald-600 hover:bg-emerald-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      처리 중...
                    </>
                  ) : (
                    <>
                      견적 요청 완료하기
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
} 