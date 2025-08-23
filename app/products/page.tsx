'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowRight,
  Plane,
  Hotel,
  Car,
  Utensils,
  Camera,
  CheckCircle,
  Phone,
  Mail
} from "lucide-react";
import Link from "next/link";
import { designSystem, commonClasses } from "@/lib/design-system";

const destinations = [
  {
    slug: "thailand-bangkok-pattaya",
    name: "태국 방콕 & 파타야",
    country: "🇹🇭 태국",
    duration: "4박 5일",
    price: "89만원부터",
    rating: 4.8,
         image: "/images/destinations/thailand-bangkok.jpg",
    highlights: ["왓프라켐", "차오프라야강 크루즈", "파타야 해변", "시암니라밋 쇼핑몰"],
    services: ["항공권", "호텔", "전용 가이드", "교통편", "식사"]
  },
  {
    slug: "vietnam-hanoi-halong",
    name: "베트남 하노이 & 하롱베이",
    country: "🇻🇳 베트남", 
    duration: "5박 6일",
    price: "95만원부터",
    rating: 4.9,
         image: "/images/destinations/vietnam-halong.jpg",
    highlights: ["하노이 구시가지", "하롱베이 크루즈", "호치민 묘", "응옥선 사원"],
    services: ["항공권", "크루즈", "전용 가이드", "교통편", "식사"]
  },
  {
    slug: "indonesia-bali",
    name: "인도네시아 발리",
    country: "🇮🇩 인도네시아",
    duration: "6박 7일", 
    price: "120만원부터",
    rating: 4.7,
         image: "/images/destinations/indonesia-bali.jpg",
    highlights: ["우붓 라이스테라스", "타나롯 사원", "누사두아 해변", "쿠타 해변"],
    services: ["항공권", "리조트", "전용 가이드", "교통편", "식사"]
  }
];

export default function ProductsPage() {
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
              <Link href="/products" className="text-blue-600 hover:text-blue-700 transition-colors font-medium border-b-2 border-blue-600">여행 상품</Link>
              <Link href="/reviews" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">여행 후기</Link>
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
        <div className={commonClasses.container + " relative z-10"}>
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 px-6 py-3 text-sm font-medium backdrop-blur-sm">
              🌏 동남아 여행 상품
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              현지 전문가와 함께하는<br />
              <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                특별한 맞춤 여행
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
              태국, 베트남, 인도네시아 등 동남아 주요 여행지를<br />
              현지 전문가의 시선으로 특별하게 경험해보세요
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 bg-gray-50">
        <div className={commonClasses.container}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">인기 여행 상품</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              검증된 현지 전문가가 설계한 프리미엄 여행 상품들을 만나보세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <Card key={destination.slug} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url('${destination.image}')` }}
                  ></div>
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      {destination.country}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center space-x-2 text-white">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{destination.rating}</span>
                    </div>
                  </div>
                </div>

                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {destination.name}
                  </CardTitle>
                  <div className="flex items-center justify-between text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{destination.duration}</span>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {destination.price}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  {/* 하이라이트 */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <Camera className="w-4 h-4 mr-2 text-blue-600" />
                      주요 관광지
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {destination.highlights.map((highlight, index) => (
                        <div key={index} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 포함 서비스 */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      포함 서비스
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {destination.services.map((service, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Link href={`/products/${destination.slug}`} className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        상세 보기
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/quote">
                      <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                        견적 요청
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className={commonClasses.container + " relative z-10"}>
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              맞춤 여행을 설계해드립니다
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-10">
              위 상품 외에도 개인/단체 맞춤 여행을 설계해드립니다.<br />
              언제든 문의해주세요!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote">
                <Button size="lg" className="px-12 py-6 text-xl font-bold bg-white text-blue-600 hover:bg-gray-50">
                  <Plane className="w-6 h-6 mr-3" />
                  맞춤 견적 요청하기
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="px-12 py-6 text-xl font-bold border-white text-white hover:bg-white/10">
                  <Users className="w-6 h-6 mr-3" />
                  회사 소개 보기
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
                    <p className="font-bold text-white">010-5940-0104</p>
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
