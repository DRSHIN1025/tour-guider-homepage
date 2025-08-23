'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Clock,
  CheckCircle,
  Target,
  Compass,
  ArrowRight,
  Building,
  Calendar,
  TrendingUp,
  Zap
} from "lucide-react";
import Link from "next/link";
import { designSystem, commonClasses } from "@/lib/design-system";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className={commonClasses.container}>
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  K-BIZ TRAVEL
                </div>
                <div className="text-sm text-gray-500">동남아 특화 맞춤여행</div>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-blue-600 hover:text-blue-700 transition-colors font-medium border-b-2 border-blue-600">회사소개</Link>
              <Link href="/quote" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">견적 요청</Link>
              <Link href="/reviews" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">여행 후기</Link>
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">관리자</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button 
                  variant="outline" 
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 font-medium"
                >
                  로그인
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-400 via-teal-500 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className={commonClasses.container + " relative z-10"}>
          <div className="max-w-5xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 px-6 py-3 text-sm font-medium backdrop-blur-sm">
              🏢 K-BIZ TRAVEL CORP.
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              합리적인 비용, 맞춤형 서비스<br />
              <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                차별화된 프로그램, 완성되는 트렌드
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-4xl mx-auto">
              K-BIZ TRAVEL은 2023년 7월 설립된 종합여행업 전문기업으로<br />
              해외 출장업무 지원, 항공 예약 및 여행상품 개발, 인바운드 관광객 유치를 전문으로 합니다.
            </p>
            
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <Calendar className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-white font-semibold">설립 2023.07</div>
                <div className="text-white/80 text-sm">법인 독립</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <Building className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-white font-semibold">종합여행업</div>
                <div className="text-white/80 text-sm">793-81-03224</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <Users className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-white font-semibold">700명 전세기</div>
                <div className="text-white/80 text-sm">대규모 투어</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <Globe className="w-6 h-6 text-white mx-auto mb-2" />
                <div className="text-white font-semibold">창원시청</div>
                <div className="text-white/80 text-sm">공무지원</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-gray-50">
        <div className={commonClasses.container}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">우리의 미션 & 비전</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              K-BIZ TRAVEL이 추구하는 가치와 목표를 소개합니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="bg-white hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0">
              <CardContent className="p-12 text-center space-y-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto">
                  <Target className="w-12 h-12 text-blue-600" />
                </div>
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-gray-900">미션</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    합리적인 비용으로 <strong className="text-blue-600">맞춤형 서비스</strong>를 제공하여
                    <br />
                    고객의 다양한 요구에 부응하는 차별화된 프로그램으로
                    <br />
                    완성되는 트렌드를 만들어나갑니다.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0">
              <CardContent className="p-12 text-center space-y-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto">
                  <Compass className="w-12 h-12 text-green-600" />
                </div>
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-gray-900">비전</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    해외 출장업무 지원, 항공 예약 및 여행상품 개발,
                    <br />
                    <strong className="text-green-600">인바운드 관광객 유치</strong>를 전문으로 하는
                    <br />
                    동남아시아 최고의 종합여행업체가 되겠습니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white">
        <div className={commonClasses.container}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              K-BIZ TRAVEL의 핵심 가치
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              우리가 추구하는 가치와 원칙으로 최고의 서비스를 제공합니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="w-14 h-14 text-blue-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">안전 최우선</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  모든 가이드는 철저한 검증을 거치며,
                  <br />
                  24시간 비상연락체계를 통해
                  <br />
                  안전한 여행을 보장합니다.
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="w-28 h-28 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Heart className="w-14 h-14 text-green-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">진정성 있는 서비스</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  현지 문화를 깊이 이해한 전문가들이
                  <br />
                  진심을 담아 여러분의 여행을
                  <br />
                  특별하게 만들어드립니다.
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="w-28 h-28 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Award className="w-14 h-14 text-purple-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">품질 보장</h3>
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
      <section className="py-24 bg-gradient-to-br from-blue-50 to-green-50">
        <div className={commonClasses.container}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              숫자로 보는 K-BIZ TRAVEL
            </h2>
            <p className="text-xl text-gray-600">신뢰할 수 있는 성과와 경험</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="text-5xl font-bold text-blue-600 mb-4">50+</div>
                <p className="text-xl font-semibold text-gray-700">검증된 현지 전문가</p>
                <p className="text-gray-500 mt-2">철저한 검증을 통과한 가이드</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="text-5xl font-bold text-green-600 mb-4">200+</div>
                <p className="text-xl font-semibold text-gray-700">성공한 여행</p>
                <p className="text-gray-500 mt-2">만족스러운 여행 경험 제공</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="text-5xl font-bold text-yellow-500 mb-4">95%</div>
                <p className="text-xl font-semibold text-gray-700">고객 만족도</p>
                <p className="text-gray-500 mt-2">높은 수준의 서비스 품질</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="text-5xl font-bold text-purple-600 mb-4">5</div>
                <p className="text-xl font-semibold text-gray-700">서비스 국가</p>
                <p className="text-gray-500 mt-2">동남아 주요 국가 커버</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className={commonClasses.container}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              왜 K-BIZ TRAVEL을 선택해야 할까요?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              차별화된 서비스와 전문성으로 특별한 여행 경험을 만들어드립니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">현지 전문가 네트워크</h3>
              <p className="text-gray-600">그 지역을 가장 잘 아는 현지 거주 전문가들</p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto">
                <Zap className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">빠른 대응</h3>
              <p className="text-gray-600">24시간 내 견적 제공 및 즉시 상담 가능</p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">투명한 가격</h3>
              <p className="text-gray-600">숨겨진 비용 없는 명확하고 투명한 가격 체계</p>
            </div>

            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto">
                <TrendingUp className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">지속적 개선</h3>
              <p className="text-gray-600">고객 피드백을 반영한 지속적인 서비스 개선</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className={commonClasses.container + " relative z-10"}>
          <div className="text-center text-white mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              K-BIZ TRAVEL과 함께하세요
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              언제든 문의해주세요. 전문 상담사가 친절하게 도와드리겠습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <Card className="bg-white/95 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-blue-100 flex items-center justify-center mx-auto">
                  <Phone className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">전화 상담</h3>
                  <p className="text-gray-600 mb-4">평일 9:00-18:00</p>
                  <p className="text-2xl font-bold text-blue-600 mb-4">1588-0000</p>
                  <p className="text-gray-600">
                    전문 상담사가 맞춤 여행 계획을 도와드립니다
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-green-100 flex items-center justify-center mx-auto">
                  <Mail className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">이메일 상담</h3>
                  <p className="text-gray-600 mb-4">24시간 접수 가능</p>
                  <p className="text-xl font-bold text-green-600 mb-4">help@kbiztravel.com</p>
                  <p className="text-gray-600">
                    자세한 문의사항을 이메일로 보내주세요
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/quote">
              <Button
                size="lg"
                className="px-16 py-6 text-2xl font-bold bg-white text-blue-600 hover:bg-gray-50 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                <ArrowRight className="mr-4 w-8 h-8" />
                지금 바로 견적 요청하기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className={commonClasses.container}>
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                    K-BIZ TRAVEL
                  </div>
                  <p className="text-sm text-gray-400">동남아 특화 맞춤여행</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                현지 전문가와 함께하는<br />
                특별한 맞춤 여행의 새로운 기준
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-lg text-blue-400">서비스</h4>
              <div className="space-y-3 text-gray-300">
                <Link href="/quote" className="block hover:text-blue-400 transition-colors">맞춤 견적 요청</Link>
                <Link href="/reviews" className="block hover:text-blue-400 transition-colors">여행 후기</Link>
                <Link href="/about" className="block hover:text-blue-400 transition-colors">회사 소개</Link>
                <Link href="#" className="block hover:text-blue-400 transition-colors">가이드 찾기</Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-lg text-green-400">고객지원</h4>
              <div className="space-y-3 text-gray-300">
                <Link href="#" className="block hover:text-green-400 transition-colors">자주 묻는 질문</Link>
                <Link href="#" className="block hover:text-green-400 transition-colors">고객센터</Link>
                <Link href="#" className="block hover:text-green-400 transition-colors">이용약관</Link>
                <Link href="#" className="block hover:text-green-400 transition-colors">개인정보 처리방침</Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-lg text-blue-400">연락처</h4>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="font-bold text-white">1588-0000</p>
                    <p className="text-sm">평일 9:00-18:00</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="font-bold text-white">help@kbiztravel.com</p>
                    <p className="text-sm">24시간 이메일 상담</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 K-BIZ TRAVEL CORP. All rights reserved.
              <span className="mx-2">|</span>
              사업자등록번호: 793-81-03224
              <span className="mx-2">|</span>
              종합여행업 등록
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}