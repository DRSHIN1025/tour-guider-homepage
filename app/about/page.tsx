import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

// ISR: 1시간마다 재생성
export const revalidate = 3600;
import { Card, CardContent } from "@/components/ui/card"
import {
  MapPin,
  Users,
  Star,
  Phone,
  Mail,
  Shield,
  Award,
  Globe,
  Heart,
  Target,
  Compass,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "회사소개 - K-BIZ TRAVEL CORP",
  description: "여행 비즈니스의 새로운 표준, K-BIZ TRAVEL CORP의 미션, 비전, 그리고 팀을 소개합니다.",
  keywords: [
    "K-BIZ TRAVEL CORP 소개", "회사소개", "동남아 여행사", "현지 가이드", "여행 전문가", 
    "안전한 여행", "맞춤 여행", "여행 파트너", "믿을 수 있는 여행사"
  ],
  openGraph: {
    title: "회사소개 - K-BIZ TRAVEL CORP",
    description: "여행 비즈니스의 새로운 표준, K-BIZ TRAVEL CORP의 미션, 비전, 그리고 팀을 소개합니다.",
    url: "https://www.tourguider.biz/about",
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F5EF" }}>
      {/* Header - 기존과 동일 */}
      <header className="bg-white shadow-sm border-b border-natural-beige">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#2D5C4D" }}
            >
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold" style={{ color: "#3A3A3C" }}>
                K-BIZ TRAVEL CORP
              </span>
              <p className="text-xs text-gray-500">tourguider.biz</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-natural-green font-medium">
              회사소개
            </Link>
            <Link href="/quote" className="text-gray-600 hover:text-natural-green transition-colors">
              견적 요청
            </Link>
            <Link href="#" className="text-gray-600 hover:text-natural-green transition-colors">
              후기
            </Link>
            <Link href="#" className="text-gray-600 hover:text-natural-green transition-colors">
              고객센터
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight" style={{ color: "#3A3A3A" }}>
                동남아 여행의
                <br />
                <span style={{ color: "#2D5C4D" }}>새로운 기준을 만듭니다</span>
              </h1>
              <p className="text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto" style={{ color: "#666" }}>
                현지 가이드와 직접 소통하며 나만의 특별한 여행을 만들어가세요.
                <br />
                투어가이더가 안전하고 믿을 수 있는 여행 경험을 제공합니다.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-gray-600">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" style={{ color: "#2D5C4D" }} />
                <span className="font-medium">설립 2020년</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5" style={{ color: "#2D5C4D" }} />
                <span className="font-medium">동남아 5개국 서비스</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">고객만족도 98%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20" style={{ backgroundColor: "#F7F5EF" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#3A3A3A" }}>
                우리의 미션 & 비전
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <Card className="bg-white border-natural-beige hover:shadow-xl transition-all duration-300">
                <CardContent className="p-10 text-center space-y-6">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                    style={{ backgroundColor: "#E8E2D5" }}
                  >
                    <Target className="w-10 h-10" style={{ color: "#2D5C4D" }} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold" style={{ color: "#3A3A3A" }}>
                      미션
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      현지 가이드와 여행객을 직접 연결하여
                      <br />
                      <strong className="text-natural-green">진정한 맞춤 여행 경험</strong>을 제공하고,
                      <br />
                      모든 여행이 안전하고 특별한 추억이 되도록 돕습니다.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-natural-beige hover:shadow-xl transition-all duration-300">
                <CardContent className="p-10 text-center space-y-6">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                    style={{ backgroundColor: "#E8E2D5" }}
                  >
                    <Compass className="w-10 h-10" style={{ color: "#2D5C4D" }} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold" style={{ color: "#3A3A3A" }}>
                      비전
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      아시아 최고의 현지 가이드 플랫폼이 되어
                      <br />
                      <strong className="text-natural-green">여행의 새로운 패러다임</strong>을 만들고,
                      <br />
                      전 세계 여행객들의 꿈을 현실로 만드는 회사가 되겠습니다.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#3A3A3A" }}>
              투어가이더의 핵심 가치
            </h2>
            <p className="text-xl text-gray-600">우리가 추구하는 가치와 원칙입니다</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center space-y-6">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg"
                style={{ backgroundColor: "#E8E2D5" }}
              >
                <Shield className="w-12 h-12" style={{ color: "#2D5C4D" }} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold" style={{ color: "#3A3A3A" }}>
                  안전 최우선
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  모든 가이드는 철저한 검증을 거치며,
                  <br />
                  24시간 비상연락체계를 통해
                  <br />
                  안전한 여행을 보장합니다.
                </p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg"
                style={{ backgroundColor: "#E8E2D5" }}
              >
                <Heart className="w-12 h-12" style={{ color: "#2D5C4D" }} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold" style={{ color: "#3A3A3A" }}>
                  진정성 있는 서비스
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  현지 문화를 깊이 이해한 가이드들이
                  <br />
                  진심을 담아 여러분의 여행을
                  <br />
                  특별하게 만들어드립니다.
                </p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg"
                style={{ backgroundColor: "#E8E2D5" }}
              >
                <Award className="w-12 h-12" style={{ color: "#2D5C4D" }} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold" style={{ color: "#3A3A3A" }}>
                  품질 보장
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  지속적인 교육과 품질 관리를 통해
                  <br />
                  일관되게 높은 수준의 서비스를
                  <br />
                  제공합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20" style={{ backgroundColor: "#F7F5EF" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#3A3A3A" }}>
              숫자로 보는 투어가이더
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center space-y-4">
              <div className="text-5xl font-bold" style={{ color: "#2D5C4D" }}>
                1,000+
              </div>
              <p className="text-xl font-medium text-gray-700">검증된 현지 가이드</p>
            </div>

            <div className="text-center space-y-4">
              <div className="text-5xl font-bold" style={{ color: "#2D5C4D" }}>
                5,000+
              </div>
              <p className="text-xl font-medium text-gray-700">성공한 여행</p>
            </div>

            <div className="text-center space-y-4">
              <div className="text-5xl font-bold" style={{ color: "#2D5C4D" }}>
                98%
              </div>
              <p className="text-xl font-medium text-gray-700">고객 만족도</p>
            </div>

            <div className="text-center space-y-4">
              <div className="text-5xl font-bold" style={{ color: "#2D5C4D" }}>
                5
              </div>
              <p className="text-xl font-medium text-gray-700">서비스 국가</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: "#3A3A3A" }}>
                투어가이더와 함께하세요
              </h2>
              <p className="text-xl text-gray-600">언제든 문의해주세요. 친절하게 도와드리겠습니다.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white border-natural-beige hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#E8E2D5" }}
                    >
                      <Phone className="w-6 h-6" style={{ color: "#2D5C4D" }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: "#3A3A3A" }}>
                        전화 문의
                      </h3>
                      <p className="text-gray-600">평일 9:00-18:00</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold" style={{ color: "#2D5C4D" }}>
                      1588-0000
                    </p>
                    <p className="text-gray-600">
                      전문 상담사가 맞춤 여행 계획을 도와드립니다
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-natural-beige hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#E8E2D5" }}
                    >
                      <Mail className="w-6 h-6" style={{ color: "#2D5C4D" }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: "#3A3A3A" }}>
                        이메일 문의
                      </h3>
                      <p className="text-gray-600">24시간 접수 가능</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold" style={{ color: "#2D5C4D" }}>
                      help@tourguider.com
                    </p>
                    <p className="text-gray-600">
                      자세한 문의사항을 이메일로 보내주세요
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Link href="/quote">
                <Button
                  className="px-12 py-4 text-xl font-bold text-white rounded-2xl hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#2D5C4D" }}
                >
                  맞춤 견적 요청하기
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 