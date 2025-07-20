import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  MapPin,
  Users,
  Star,
  Phone,
  MessageCircle,
  Download,
  ArrowRight,
  CheckCircle,
  Quote,
  Heart,
  Shield,
  Clock,
  User,
  Baby,
  Briefcase,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { UserHeader } from "@/components/UserHeader"

export default function TourGuiderHomepage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F5EF" }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-natural-beige">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#2D5C4D" }}
            >
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold" style={{ color: "#3A3A3A" }}>
                투어가이더
              </span>
              <p className="text-xs text-gray-500">tourguider.com</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-gray-600 hover:text-natural-green transition-colors">
              회사소개
            </Link>
            <Link href="/quote" className="text-gray-600 hover:text-natural-green transition-colors">
              견적 요청
            </Link>
            <Link href="/admin" className="text-gray-600 hover:text-natural-green transition-colors">
              관리자
            </Link>
            <Link href="#" className="text-gray-600 hover:text-natural-green transition-colors">
              후기
            </Link>
            <Link href="#" className="text-gray-600 hover:text-natural-green transition-colors">
              고객센터
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-natural-green transition-colors">
              회사 소개
            </Link>
          </nav>
          <UserHeader />
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="py-20 lg:py-28 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #F7F5EF 0%, #E8E2D5 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <Image src="/placeholder.svg?height=800&width=1200" alt="동남아 자연 풍경" fill className="object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight" style={{ color: "#3A3A3A" }}>
                여행, 이제 직접
                <br />
                <span style={{ color: "#2D5C4D" }}>제안받고 고르세요</span>
              </h1>
              <p className="text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto" style={{ color: "#666" }}>
                동남아 현지 가이드들이 직접 맞춤 여행 일정을 제안해드립니다.
                <br />
                여러 견적을 비교하고 가장 마음에 드는 여행을 선택하세요.
              </p>
            </div>

            <div
              className="bg-white p-8 lg:p-10 rounded-3xl shadow-2xl border max-w-4xl mx-auto"
              style={{ borderColor: "#E8E2D5" }}
            >
              <form action="/quote" method="GET" className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold" style={{ color: "#3A3A3A" }}>
                      여행지
                    </label>
                    <Input 
                      name="destination"
                      placeholder="베트남, 태국, 필리핀..." 
                      className="border-natural-beige py-4 text-lg" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-semibold" style={{ color: "#3A3A3A" }}>
                      여행 기간
                    </label>
                    <Input 
                      name="duration"
                      placeholder="3박4일, 4박5일..." 
                      className="border-natural-beige py-4 text-lg" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-semibold" style={{ color: "#3A3A3A" }}>
                      인원
                    </label>
                    <Input 
                      name="people"
                      placeholder="성인 2명, 아동 1명..." 
                      className="border-natural-beige py-4 text-lg" 
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full py-6 text-xl font-bold text-white rounded-2xl hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#2D5C4D" }}
                >
                  맞춤 견적 요청하기
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </form>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-gray-600">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" style={{ color: "#2D5C4D" }} />
                <span className="font-medium">1,000+ 현지 가이드</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">평점 4.9/5.0</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" style={{ color: "#2D5C4D" }} />
                <span className="font-medium">안전한 여행 보장</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Flow Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#3A3A3A" }}>
              간단한 3단계로 완성되는 맞춤 여행
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">복잡한 여행 계획, 이제 전문 가이드에게 맡기세요</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center space-y-6">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg"
                style={{ backgroundColor: "#E8E2D5" }}
              >
                <MapPin className="w-12 h-12" style={{ color: "#2D5C4D" }} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold" style={{ color: "#3A3A3A" }}>
                  1. 맞춤 여행 요청
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  여행지, 기간, 인원, 예산 등<br />
                  원하는 여행 조건을 알려주세요
                </p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg"
                style={{ backgroundColor: "#E8E2D5" }}
              >
                <Users className="w-12 h-12" style={{ color: "#2D5C4D" }} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold" style={{ color: "#3A3A3A" }}>
                  2. 현지 가이드 견적 제안
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  현지 전문 가이드들이
                  <br />
                  맞춤 일정과 견적을 제안해드려요
                </p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg"
                style={{ backgroundColor: "#E8E2D5" }}
              >
                <CheckCircle className="w-12 h-12" style={{ color: "#2D5C4D" }} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold" style={{ color: "#3A3A3A" }}>
                  3. 선택 후 출발
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  마음에 드는 일정을 선택하고
                  <br />
                  안전하고 즐거운 여행을 떠나세요
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20" style={{ backgroundColor: "#F7F5EF" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#3A3A3A" }}>
              투어가이더와 함께한 특별한 여행
            </h2>
            <p className="text-xl text-gray-600">실제 여행객들의 생생한 후기를 확인해보세요</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="bg-white border-natural-beige hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-600">5.0</span>
                </div>
                <Quote className="w-8 h-8 text-gray-300 mb-4" />
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                  "60대 부부 여행으로 걱정이 많았는데, 가이드님이 부모님을 정말 잘 챙겨주셔서
                  <strong className="text-natural-green"> 정말 편안한 여행이었어요.</strong>
                  숨은 맛집과 포토스팟까지 소개해주셔서 감사했습니다."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-natural-beige rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-natural-green" />
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-natural-text">김○○님</p>
                    <p className="text-sm text-gray-600">베트남 다낭 4박5일</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-natural-beige hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-600">5.0</span>
                </div>
                <Quote className="w-8 h-8 text-gray-300 mb-4" />
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                  "여러 가이드님들이 견적을 보내주셔서 비교할 수 있어서 좋았어요.
                  <strong className="text-natural-green">가이드님이 부모님을 잘 챙겨주셨어요</strong>
                  태국 현지 문화까지 자세히 설명해주셨습니다."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-natural-beige rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-natural-green" />
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-natural-text">박○○님</p>
                    <p className="text-sm text-gray-600">태국 방콕·파타야 5박6일</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-natural-beige hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-600">5.0</span>
                </div>
                <Quote className="w-8 h-8 text-gray-300 mb-4" />
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                  "혼자 필리핀 여행 계획 세우기 어려웠는데, 가이드님이 완벽한 일정을 짜주셨어요.
                  <strong className="text-natural-green">정말 편안한 여행이었어요</strong>
                  중장년층 동남아 여행에 정말 추천해요!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-natural-beige rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-natural-green" />
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-natural-text">이○○님</p>
                    <p className="text-sm text-gray-600">필리핀 세부 3박4일</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Target Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#3A3A3A" }}>
              이런 분들을 위해 준비했습니다
            </h2>
            <p className="text-xl text-gray-600">안전하고 편안한 동남아 여행을 원하시는 모든 분들께</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center space-y-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: "#E8E2D5" }}
              >
                <User className="w-10 h-10" style={{ color: "#2D5C4D" }} />
              </div>
              <h3 className="text-xl font-semibold" style={{ color: "#3A3A3A" }}>
                혼자 여행하는 중년층
              </h3>
              <p className="text-gray-600">
                안전하고 편안한
                <br />
                혼자만의 특별한 여행
              </p>
            </div>

            <div className="text-center space-y-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: "#E8E2D5" }}
              >
                <Heart className="w-10 h-10" style={{ color: "#2D5C4D" }} />
              </div>
              <h3 className="text-xl font-semibold" style={{ color: "#3A3A3A" }}>
                부모님 모시고 가는 여행
              </h3>
              <p className="text-gray-600">
                부모님 속도에 맞춘
                <br />
                편안한 효도 여행
              </p>
            </div>

            <div className="text-center space-y-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: "#E8E2D5" }}
              >
                <Baby className="w-10 h-10" style={{ color: "#2D5C4D" }} />
              </div>
              <h3 className="text-xl font-semibold" style={{ color: "#3A3A3A" }}>
                가족 여행
              </h3>
              <p className="text-gray-600">
                온 가족이 함께하는
                <br />
                안전한 동남아 여행
              </p>
            </div>

            <div className="text-center space-y-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: "#E8E2D5" }}
              >
                <Briefcase className="w-10 h-10" style={{ color: "#2D5C4D" }} />
              </div>
              <h3 className="text-xl font-semibold" style={{ color: "#3A3A3A" }}>
                바쁜 직장인
              </h3>
              <p className="text-gray-600">
                계획 없이도 완벽한
                <br />
                스트레스 프리 여행
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-20" style={{ backgroundColor: "#F7F5EF" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#3A3A3A" }}>
                지금 바로 시작하세요
              </h2>
              <p className="text-xl text-gray-600">간편한 상담부터 안전한 결제까지, 모든 과정이 쉽고 투명합니다</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white border-natural-beige hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center space-y-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                    style={{ backgroundColor: "#FFE500" }}
                  >
                    <MessageCircle className="w-8 h-8 text-gray-800" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold" style={{ color: "#3A3A3A" }}>
                      카카오톡 상담
                    </h3>
                    <p className="text-gray-600">
                      친근하고 편안한 카톡으로
                      <br />
                      언제든 문의해주세요
                    </p>
                  </div>
                  <Button
                    className="w-full py-4 text-lg font-semibold text-gray-800 rounded-xl"
                    style={{ backgroundColor: "#FFE500" }}
                  >
                    카카오톡으로 문의하기
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border-natural-beige hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center space-y-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                    style={{ backgroundColor: "#2D5C4D" }}
                  >
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold" style={{ color: "#3A3A3A" }}>
                      예약금 결제
                    </h3>
                    <p className="text-gray-600">
                      안전한 결제 시스템으로
                      <br />
                      간편하게 예약하세요
                    </p>
                  </div>
                  <Button
                    className="w-full py-4 text-lg font-semibold text-white rounded-xl"
                    style={{ backgroundColor: "#2D5C4D" }}
                  >
                    예약금 결제하기
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <div className="flex items-center justify-center space-x-6 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" style={{ color: "#2D5C4D" }} />
                  <span className="text-lg font-semibold">1588-0000</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" style={{ color: "#2D5C4D" }} />
                  <span>평일 9:00-18:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#2D5C4D" }}
                >
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">투어가이더</span>
                  <p className="text-xs text-gray-400">tourguider.com</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                현지 가이드와 함께하는
                <br />
                특별한 맞춤 여행
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">서비스</h4>
              <div className="space-y-3 text-gray-300">
                <Link href="#" className="block hover:text-white transition-colors">
                  맞춤 견적 요청
                </Link>
                <Link href="#" className="block hover:text-white transition-colors">
                  가이드 찾기
                </Link>
                <Link href="#" className="block hover:text-white transition-colors">
                  여행 후기
                </Link>
                <Link href="#" className="block hover:text-white transition-colors">
                  여행 가이드
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">고객지원</h4>
              <div className="space-y-3 text-gray-300">
                <Link href="#" className="block hover:text-white transition-colors">
                  자주 묻는 질문
                </Link>
                <Link href="#" className="block hover:text-white transition-colors">
                  고객센터
                </Link>
                <Link href="#" className="block hover:text-white transition-colors">
                  이용약관
                </Link>
                <Link href="#" className="block hover:text-white transition-colors">
                  개인정보 처리방침
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">연락처</h4>
              <div className="space-y-3 text-gray-300">
                <p className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>1588-0000</span>
                </p>
                <p>이메일: help@tourguider.com</p>
                <p>평일 9:00-18:00</p>
                <div className="pt-4 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-800 bg-transparent"
                  >
                    <MessageCircle className="mr-2 w-4 h-4" />
                    카카오채널
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-gray-800 bg-transparent"
                  >
                    <Download className="mr-2 w-4 h-4" />앱 설치
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 투어가이더(tourguider.com). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
