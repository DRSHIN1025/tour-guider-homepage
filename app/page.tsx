"use client"

// 🔥 DEPLOYMENT TRIGGER - 버튼 강제 작동 보장
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Download,
  Star,
  Users,
  Shield,
  Calendar,
  Globe,
  Heart
} from "lucide-react"

export default function TourGuiderHomepage() {
  // 강제로 작동하는 버튼 핸들러들
  const handleKakaoChat = () => {
    console.log('카카오톡 버튼 클릭됨 - 강제 작동');
    alert('카카오톡 채팅 페이지로 이동합니다!');
    window.open('https://pf.kakao.com/_your_channel_id/chat', '_blank');
  };

  const handlePhoneCall = () => {
    console.log('전화 버튼 클릭됨 - 강제 작동');
    alert('전화 연결을 시도합니다!');
    window.location.href = 'tel:1588-0000';
  };

  const handlePayment = () => {
    console.log('결제 버튼 클릭됨 - 강제 작동');
    alert('결제 페이지로 이동합니다!');
    window.location.href = '/payment';
  };

  const handleAppDownload = () => {
    console.log('앱 다운로드 버튼 클릭됨 - 강제 작동');
    alert('앱 다운로드 페이지로 이동합니다!');
    window.open('https://play.google.com/store/apps/details?id=com.tourguider.app', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">투어가이더</span>
                <p className="text-sm text-gray-500">Premium Travel Experience</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-gray-600 hover:text-emerald-600 transition-colors">회사소개</Link>
              <Link href="/quote" className="text-gray-600 hover:text-emerald-600 transition-colors">견적 요청</Link>
              <Link href="/admin" className="text-gray-600 hover:text-emerald-600 transition-colors">관리자</Link>
              <Link href="/reviews" className="text-gray-600 hover:text-emerald-600 transition-colors">후기</Link>
              <Link href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">고객센터</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                  로그인
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-emerald-700 via-teal-700 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              여행, 이제 직접<br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                제안받고 고르세요
              </span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
              동남아 현지 가이드들이 직접 맞춤 여행 일정을 제안해드립니다.<br />
              여러 견적을 비교하고 가장 마음에 드는 여행을 선택하세요.
            </p>
            
            {/* Quote Form */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-4xl mx-auto border border-white/20">
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">여행지</label>
                  <input 
                    type="text" 
                    placeholder="예: 태국 방콕" 
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">여행 기간</label>
                  <input 
                    type="text" 
                    placeholder="예: 5박 6일" 
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">인원</label>
                  <input 
                    type="text" 
                    placeholder="예: 성인 2명" 
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">예산</label>
                  <input 
                    type="text" 
                    placeholder="예: 200만원" 
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
              </div>
              <Link href="/quote">
                <Button 
                  size="lg" 
                  className="w-full md:w-auto px-12 py-4 text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                >
                  <Sparkles className="mr-3 w-6 h-6" />
                  맞춤 견적 요청하기
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2">1,000+</div>
              <div className="text-lg opacity-90">현지 가이드</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2 flex items-center justify-center">
                <Star className="w-8 h-8 text-yellow-300 mr-2" />
                4.9/5.0
              </div>
              <div className="text-lg opacity-90">평점</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl font-bold mb-2 flex items-center justify-center">
                <Shield className="w-8 h-8 text-emerald-300 mr-2" />
                100%
              </div>
              <div className="text-lg opacity-90">안전한 여행 보장</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-700 via-teal-700 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              간편한 상담부터 안전한 결제까지, 모든 과정이 쉽고 투명합니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/95 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center mx-auto">
                  <MessageCircle className="w-8 h-8 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    카카오톡 상담
                  </h3>
                  <p className="text-gray-600 mb-6">
                    친근하고 편안한 카톡으로<br />24시간 언제든 문의해주세요
                  </p>
                </div>
                <Button 
                  onClick={handleKakaoChat}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-2xl transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  카카오톡으로 문의하기
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto">
                  <Phone className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    전화 상담
                  </h3>
                  <p className="text-gray-600 mb-6">
                    전문 상담사와 직접 통화로<br />자세한 상담을 받아보세요
                  </p>
                </div>
                <Button 
                  onClick={handlePhoneCall}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  1588-0000
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-lg opacity-90 mb-6">
              💎 무료 견적 · 🎯 맞춤 상담 · 💰 투명한 가격 · 🛡️ 안전 보장
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link href="/quote">
                <Button
                  size="lg"
                  className="px-12 py-6 text-2xl font-bold bg-white text-emerald-600 hover:bg-gray-50 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                >
                  <Sparkles className="mr-3 w-7 h-7" />
                  지금 바로 견적 받기
                  <ArrowRight className="ml-3 w-7 h-7" />
                </Button>
              </Link>
              
              <Button
                size="lg"
                variant="outline"
                onClick={handlePayment}
                className="px-12 py-6 text-2xl font-bold border-white text-white hover:bg-white hover:text-emerald-600 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                💳 상담 서비스 결제
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">투어가이더</span>
                  <p className="text-sm text-gray-400">Premium Travel Experience</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                현지 가이드와 함께하는<br />
                특별한 맞춤 여행의 새로운 기준
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-lg text-emerald-400">서비스</h4>
              <div className="space-y-3 text-gray-300">
                <Link href="/quote" className="block hover:text-emerald-400 transition-colors">맞춤 견적 요청</Link>
                <Link href="/reviews" className="block hover:text-emerald-400 transition-colors">여행 후기</Link>
                <Link href="/about" className="block hover:text-emerald-400 transition-colors">회사 소개</Link>
                <Link href="#" className="block hover:text-emerald-400 transition-colors">가이드 찾기</Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-lg text-emerald-400">고객지원</h4>
              <div className="space-y-3 text-gray-300">
                <Link href="#" className="block hover:text-emerald-400 transition-colors">자주 묻는 질문</Link>
                <Link href="#" className="block hover:text-emerald-400 transition-colors">고객센터</Link>
                <Link href="#" className="block hover:text-emerald-400 transition-colors">이용약관</Link>
                <Link href="#" className="block hover:text-emerald-400 transition-colors">개인정보 처리방침</Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-lg text-emerald-400">연락처</h4>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="font-bold text-white">1588-0000</p>
                    <p className="text-sm">평일 9:00-18:00</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="font-bold text-white">help@tourguider.com</p>
                    <p className="text-sm">24시간 이메일 상담</p>
                  </div>
                </div>
                
                <div className="pt-4 space-y-3">
                  <Button 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-xl transition-colors"
                    onClick={handleKakaoChat}
                  >
                    <MessageCircle className="mr-2 w-4 h-4" />
                    카카오채널
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 py-3 rounded-xl transition-colors" 
                    onClick={handleAppDownload}
                  >
                    <Download className="mr-2 w-4 h-4" />
                    앱 다운로드
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 투어가이더(tourguider.com). All rights reserved.
              <span className="mx-2">|</span>
              사업자등록번호: 123-45-67890
              <span className="mx-2">|</span>
              통신판매업신고: 제2024-서울강남-1234호
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
