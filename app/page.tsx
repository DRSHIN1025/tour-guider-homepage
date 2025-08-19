// DEV-MARK
'use client'

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useReferralCode } from "@/hooks/useReferralCode"
import PWAInstaller from "@/components/PWAInstaller"
import KakaoChat from "@/components/KakaoChat"
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Download,
  Star,
  Shield,
  Users,
  Heart,
  Home,
  Briefcase,
  CheckCircle,
  Quote,
  User,
  LogOut,
  Gift,
  Share2,
  TrendingUp,
  Award,
  Globe,
  Plane,
  Camera,
  Coffee,
  Mountain,
  Copy,
  Calendar,
  Mail,
  ArrowRight
} from "lucide-react"

export default function KBizTravelHomepage() {
  const { user, logout } = useAuth();
  const { userReferralCode, userStats, generateUserReferralCode, copyReferralCode } = useReferralCode();
  const [quoteData, setQuoteData] = useState({
    destination: '',
    duration: '',
    people: '',
    budget: '',
    startDate: '',
    requirements: '',
    contactMethod: '',
    contactPhone: ''
  });

  const handleLogout = async () => {
    try {
      await logout()
      console.log('로그아웃 완료')
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setQuoteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuoteRequest = () => {
    const params = new URLSearchParams({
      destination: quoteData.destination,
      duration: quoteData.duration,
      people: quoteData.people,
      budget: quoteData.budget,
      startDate: quoteData.startDate,
      requirements: quoteData.requirements,
      contactMethod: quoteData.contactMethod,
      contactPhone: quoteData.contactPhone
    });
    window.location.href = `/quote?${params.toString()}`;
  };

  const handleKakaoChat = () => {
    const KAKAO_CHANNEL_ID = 'TEMP_CHANNEL';
    window.open(`https://pf.kakao.com/${KAKAO_CHANNEL_ID}/chat`, '_blank');
  };

  const handlePayment = () => {
    window.location.href = '/payment';
  };

  const handleReferralCodeGenerate = async () => {
    try {
      await generateUserReferralCode();
      alert('레퍼럴 코드가 생성되었습니다!');
    } catch (error) {
      alert('레퍼럴 코드 생성에 실패했습니다.');
    }
  };

  const handleReferralCodeCopy = async () => {
    try {
      await copyReferralCode();
    } catch (error) {
      alert('코드 복사에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Area */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">K-BIZ TRAVEL</span>
                <p className="text-xs text-gray-500">동남아 특화 맞춤여행</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/about" className="text-gray-600 hover:text-green-600 transition-colors">회사소개</Link>
              <Link href="/quote" className="text-gray-600 hover:text-green-600 transition-colors">견적 요청</Link>
              <Link href="/payment" className="text-gray-600 hover:text-green-600 transition-colors">서비스 결제</Link>
              <Link href="/referral" className="text-gray-600 hover:text-green-600 transition-colors">레퍼럴</Link>
              <Link href="/admin" className="text-gray-600 hover:text-green-600 transition-colors">관리자</Link>
              <Link href="/reviews" className="text-gray-600 hover:text-green-600 transition-colors">후기</Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || '사용자'} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-600" />
                    )}
                    <span className="text-sm text-gray-700 hidden md:block">
                      {user.displayName || user.email}
                    </span>
                  </div>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                      <Briefcase className="w-4 h-4 mr-1" />
                      대시보드
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLogout}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    로그아웃
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/signup">
                    <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                      신규 등록
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
                      로그인
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Additional Tags */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                베스트 셀러
              </Badge>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">레퍼럴</span>
                <p className="text-xs text-gray-500">보상 프로그램</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - First Image Design */}
      <section className="py-20 bg-gradient-to-r from-blue-500 via-green-500 to-purple-600 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              맞춤형 여행 전문가와 함께
            </h1>
            
            <p className="text-2xl text-white mb-12 max-w-4xl mx-auto leading-relaxed font-medium opacity-90">
              현지 전문가들이 직접 설계하는 맞춤형 여행 일정.<br />
              꿈꿔왔던 완벽한 여행을 현실로 만들어보세요.
            </p>
            
            {/* CTA Button */}
            <Button 
              onClick={handleQuoteRequest}
              size="lg" 
              className="px-16 py-6 text-2xl font-bold bg-white text-gray-800 border-2 border-gray-300 hover:bg-gray-50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              무료 맞춤 견적 요청하기
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </div>

          {/* Key Statistics */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">1,000+</div>
              <div className="text-lg">현지 가이드</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2 flex items-center justify-center">
                <Star className="w-8 h-8 text-yellow-400 mr-2" />
                4.9/5.0
              </div>
              <div className="text-lg">평점</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                100%
              </div>
              <div className="text-lg">안전한 여행 보장</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section - First Image Design */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              인기 여행지
            </h2>
            <p className="text-xl text-gray-600">
              지금 가장 많이 선택받는 동남아 여행 코스
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1: Thailand - First Image Design */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-red-500 text-white border-0">NEW</Badge>
                  </div>
                  <Globe className="w-16 h-16 text-white opacity-80" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">태국 방콕 파타야 럭셔리 5일</h3>
                  <p className="text-gray-600 mb-3">방콕과 파타야 비치 리조트에서</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">4박 5일</span>
                    <span className="text-lg font-bold text-blue-600">150만원대~</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">치앙마이</Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">파타야 비치</Badge>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    상세 보기 및 견적 요청
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Vietnam - First Image Design */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <Mountain className="w-16 h-16 text-white opacity-80" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">베트남 하노이 하롱베이 5일</h3>
                  <p className="text-gray-600 mb-3">하노이의 역사와 하롱베이의 자연을 경험</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">4박 5일</span>
                    <span className="text-lg font-bold text-green-600">120만원대~</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">하노이 구시가지</Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">하롱베이 크루즈</Badge>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    상세 보기 및 견적 요청
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Philippines - First Image Design */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-white opacity-80" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">필리핀 보라카이 힐링 4일</h3>
                  <p className="text-gray-600 mb-3">세계 최고의 해변에서 특별한 활동 시간</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">3박 4일</span>
                    <span className="text-lg font-bold text-purple-600">120만원대~</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">화이트 비치</Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">선셋 크루즈</Badge>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    상세 보기 및 견적 요청
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose K-BIZ TRAVEL Section - First Image Design */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              왜 K-BIZ TRAVEL을 선택해야 할까요?
            </h2>
            <p className="text-xl text-gray-600">
              현지 가이드들과 함께하는 특별한 여행을 경험해보세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">현지 전문가</h3>
                <p className="text-gray-600">
                  현지에서 5년 이상 거주한 전문 가이드들이 직접 일정을 설계해드립니다.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">안전 보장</h3>
                <p className="text-gray-600">
                  모든 여행에 대해 100% 보험 처리하고 24시간 응급 상황 지원을 제공합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
                  <Gift className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">맞춤 서비스</h3>
                <p className="text-gray-600">
                  획일화된 일정이 아닌 맞춤형 여행을 제공합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section - First Image Design (4 cards in 2x2 grid) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              고객 후기
            </h2>
            <p className="text-xl text-gray-600">
              K-BIZ TRAVEL과 함께한 특별한 여행이야기
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "가이드님이 정말 친절하고 여행 일정도 완벽했어요. 
                  혼자 여행하는데도 안전하고 편안하게 즐길 수 있었습니다."
                </p>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">김민수</p>
                  <p className="text-gray-500">태국 방콕 2024.01.15</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "부모님과 함께한 여행이었는데, 가이드님이 부모님 속도에 맞춰 
                  일정을 조정해주셔서 정말 감사했습니다."
                </p>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">이영희</p>
                  <p className="text-gray-500">베트남 하노이 2024.02.20</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "바쁜 직장생활 중에 짧은 휴가를 냈는데, K-BIZ TRAVEL 덕분에 
                  효율적이고 즐거운 여행을 할 수 있었어요."
                </p>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">박철수</p>
                  <p className="text-gray-500">필리핀 보라카이 2024.03.10</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "첫 해외여행이었는데, 가이드님이 모든 것을 도와주셔서 
                  걱정 없이 즐길 수 있었습니다. 정말 감사해요!"
                </p>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">최지영</p>
                  <p className="text-gray-500">캄보디아 앙코르 2024.04.05</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* More Reviews Button */}
          <div className="text-center">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              더 많은 후기 보기
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - First Image Design */}
      <footer className="bg-gray-900 text-white">
        {/* Top Footer */}
        <div className="py-16 border-b border-gray-700">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-bold mb-2">전화 상담</h4>
                <p className="text-2xl font-bold text-blue-400 mb-1">02-1234-5678</p>
                <p className="text-gray-400">(09:00-18:00)</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">K</span>
                </div>
                <h4 className="text-lg font-bold mb-2">카카오톡</h4>
                <p className="text-2xl font-bold text-yellow-400 mb-1">@kbiztravel</p>
                <p className="text-gray-400">[24시간 상담]</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-bold mb-2">이메일</h4>
                <p className="text-2xl font-bold text-green-400 mb-1">contact@kbiztravel.co.kr</p>
                <p className="text-gray-400">빠른 답변 보장</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-12">
              <div className="space-y-4">
                <h4 className="text-2xl font-bold text-white">© K-BIZ TRAVEL</h4>
                <p className="text-white/90">동남아 특화 맞춤여행</p>
                <p className="text-white/90">여행에 즐거움을 더하다</p>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white">서비스</h4>
                <div className="space-y-2 text-white/90">
                  <p>여행상품</p>
                  <p>견적 상담</p>
                  <p>고객후기</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white">고객지원</h4>
                <div className="space-y-2 text-white/90">
                  <p>전화: 1588-0000</p>
                  <p>이메일: help@travelplanner.co.kr</p>
                  <p>카카오톡: @travelplanner</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white">파트너 프로그램</h4>
                <p className="text-white/90">여행 추천으로 수익 창출!</p>
                <p className="text-white/90">부업으로 시작해보세요.</p>
                <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg">
                  파트너 되기
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright and Legal Links */}
        <div className="py-6 bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 K-BIZ TRAVEL. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="#" className="text-gray-400 hover:text-white text-sm">이용약관</Link>
                <Link href="#" className="text-gray-400 hover:text-white text-sm">개인정보처리방침</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* PWA 설치 프롬프트 */}
      <PWAInstaller />
      
      {/* 실시간 채팅 */}
      <KakaoChat />
    </div>
  )
}