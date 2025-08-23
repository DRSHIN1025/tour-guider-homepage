'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Users,
  Star,
  Gift,
  Share2,
  TrendingUp,
  Award,
  Globe,
  Heart,
  CheckCircle,
  ArrowRight,
  Copy,
  Phone,
  Mail,
  UserPlus,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { designSystem, commonClasses } from "@/lib/design-system";

export default function ReferralPage() {
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
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">회사소개</Link>
              <Link href="/quote" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">견적 요청</Link>
              <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">여행 상품</Link>
              <Link href="/referral" className="text-blue-600 hover:text-blue-700 transition-colors font-medium border-b-2 border-blue-600">레퍼럴 시스템</Link>
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
      <section className="py-16 bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className={commonClasses.container + " relative z-10"}>
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 px-6 py-3 text-sm font-medium backdrop-blur-sm">
              🎁 레퍼럴 시스템
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              함께 성장하는<br />
              <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                상생 플랫폼
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
              친구와 함께 여행하고, 함께 보상을 받으세요!<br />
              K-BIZ TRAVEL 레퍼럴 시스템으로 특별한 혜택을 누려보세요
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className={commonClasses.container}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">어떻게 작동하나요?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              간단한 3단계로 레퍼럴 보상을 받을 수 있습니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <UserPlus className="w-14 h-14 text-blue-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">1단계: 가입하기</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  K-BIZ TRAVEL에 가입하고<br />
                  나만의 레퍼럴 코드를 받으세요
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="w-28 h-28 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Share2 className="w-14 h-14 text-green-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">2단계: 공유하기</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  친구들에게 레퍼럴 코드를<br />
                  공유하고 여행을 추천하세요
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="w-28 h-28 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Gift className="w-14 h-14 text-purple-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">3단계: 보상받기</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  친구가 여행을 예약하면<br />
                  즉시 보상을 받을 수 있습니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards System */}
      <section className="py-24 bg-gray-50">
        <div className={commonClasses.container}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">레퍼럴 보상 체계</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              친구와 함께 여행할수록 더 큰 보상을 받을 수 있습니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">1명 추천</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">5,000원</div>
                <p className="text-gray-600">즉시 지급</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">5명 추천</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">30,000원</div>
                <p className="text-gray-600">추가 보너스</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Award className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">10명 추천</h3>
                <div className="text-3xl font-bold text-purple-600 mb-2">100,000원</div>
                <p className="text-gray-600">특별 보너스</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Star className="w-10 h-10 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">VIP 등급</h3>
                <div className="text-3xl font-bold text-orange-600 mb-2">전용 혜택</div>
                <p className="text-gray-600">우선 예약권</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Referral Code Generator */}
      <section className="py-24 bg-white">
        <div className={commonClasses.container}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">나만의 레퍼럴 코드 만들기</h2>
              <p className="text-xl text-gray-600">
                로그인하고 나만의 레퍼럴 코드를 생성해보세요
              </p>
            </div>

            <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-0 shadow-2xl">
              <CardContent className="p-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">레퍼럴 코드 생성</h3>
                    <p className="text-gray-600 leading-relaxed">
                      K-BIZ TRAVEL에 가입하면 자동으로 생성되는<br />
                      고유한 레퍼럴 코드를 받을 수 있습니다.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">고유한 8자리 코드</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">즉시 사용 가능</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">무제한 사용</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Link href="/signup">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg">
                          <UserPlus className="w-5 h-5 mr-2" />
                          지금 가입하기
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="text-center space-y-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl flex items-center justify-center mx-auto">
                        <Gift className="w-12 h-12 text-blue-600" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">예시 레퍼럴 코드</h4>
                      <div className="bg-gray-100 rounded-xl p-4">
                        <div className="text-2xl font-mono font-bold text-blue-600">KBZ2024</div>
                        <p className="text-sm text-gray-500 mt-2">이런 형태로 생성됩니다</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        친구가 이 코드로 가입하면<br />
                        즉시 보상을 받을 수 있습니다
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className={commonClasses.container}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">레퍼럴 시스템의 장점</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              친구와 함께 여행하면서 얻을 수 있는 특별한 혜택들
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">즉시 현금 지급</h3>
              <p className="text-gray-600 leading-relaxed">
                친구가 여행을 예약하면 24시간 내에 현금으로 지급됩니다. 
                별도의 조건이나 제한이 없습니다.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">전 세계 어디서나</h3>
              <p className="text-gray-600 leading-relaxed">
                해외에 계시는 친구도 추천할 수 있습니다. 
                국적이나 거주지에 상관없이 보상을 받을 수 있습니다.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">친구와 함께 성장</h3>
              <p className="text-gray-600 leading-relaxed">
                좋은 여행 경험을 친구와 공유하면서 
                함께 보상을 받고 성장할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className={commonClasses.container + " relative z-10"}>
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              지금 바로 시작하세요!
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-10">
              친구와 함께 여행하고, 함께 보상을 받으세요.<br />
              K-BIZ TRAVEL 레퍼럴 시스템이 여러분을 기다리고 있습니다!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="px-12 py-6 text-xl font-bold bg-white text-purple-600 hover:bg-gray-50">
                  <UserPlus className="w-6 h-6 mr-3" />
                  무료 가입하기
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="px-12 py-6 text-xl font-bold border-white text-white hover:bg-white/10">
                  <ArrowRight className="w-6 h-6 mr-3" />
                  로그인하기
                </Button>
              </Link>
            </div>
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
                <Link href="/products" className="block hover:text-blue-400 transition-colors">여행 상품</Link>
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

