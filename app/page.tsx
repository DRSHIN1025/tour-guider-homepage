'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  ArrowRight, 
  MapPin, 
  Phone, 
  MessageCircle,
  Shield,
  Users,
  Sparkles,
  Globe,
  Plane,
  Camera,
  Mountain,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { designSystem, commonClasses } from "@/lib/design-system";

const testimonials = [
  {
    id: 1,
    name: "김영희",
    location: "태국 방콕 5박 6일",
    rating: 5,
    content: "현지 가이드분이 숨겨진 맛집들을 소개해주셔서 정말 특별한 여행이었어요. 일정도 완벽했고, 안전하게 잘 다녀왔습니다!",
    date: "2024년 3월"
  },
  {
    id: 2,
    name: "박민수",
    location: "베트남 하롱베이 4박 5일",
    rating: 5,
    content: "가격 대비 너무 만족스러웠어요. 특히 하롱베이 크루즈는 평생 잊지 못할 추억이 되었습니다. K-BIZ 덕분입니다!",
    date: "2024년 2월"
  },
  {
    id: 3,
    name: "이수진",
    location: "필리핀 보라카이 3박 4일",
    rating: 5,
    content: "혼자 여행이 걱정됐는데, 현지 가이드분이 친절하게 안내해주셔서 안전하고 즐거운 여행을 할 수 있었어요.",
    date: "2024년 4월"
  },
  {
    id: 4,
    name: "최준호",
    location: "인도네시아 발리 7박 8일",
    rating: 5,
    content: "커플 여행으로 갔는데 로맨틱한 일정들을 많이 준비해주셨어요. 프로포즈도 성공했습니다! 감사합니다.",
    date: "2024년 1월"
  }
];

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className={commonClasses.container}>
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  K-BIZ TRAVEL
                </div>
                <div className="text-sm text-gray-500">동남아 특화 맞춤여행</div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">회사소개</Link>
              <Link href="/quote" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">견적 요청</Link>
              <Link href="/reviews" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">여행 후기</Link>
              <Link href="/referral" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">레퍼럴</Link>
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
      <section className="relative min-h-[42vh] flex items-center bg-gradient-to-br from-emerald-400 via-teal-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className={commonClasses.container + " relative z-10"}>
          <div className="max-w-5xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 px-6 py-3 text-sm font-medium backdrop-blur-sm">
              🌟 동남아 여행 전문 플랫폼
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              맞춤형 여행의<br />
              <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                새로운 경험
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
              K-BIZ TRAVEL과 함께 동남아의 숨겨진 보석같은 여행지를 발견하세요.<br />
              현지 전문가가 직접 설계하는 맞춤형 여행 일정을 경험해보세요.
            </p>

            <div className="mb-12">
              <Link href="/quote">
                <Button 
                  size="lg" 
                  className="px-12 py-4 text-xl font-bold bg-white text-purple-600 hover:bg-gray-50 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                >
                  <Sparkles className="mr-3 w-6 h-6" />
                  무료 견적 요청하기
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">1,000+</div>
                <div className="text-white/90 font-medium">현지 전문가</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
                  <Star className="w-7 h-7 text-yellow-300 mr-2 fill-current" />
                  4.9/5.0
                </div>
                <div className="text-white/90 font-medium">고객 만족도</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-green-300 mr-2" />
                  100%
                </div>
                <div className="text-white/90 font-medium">여행 안전 보장</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-24 bg-gray-50">
        <div className={commonClasses.container}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">인기 여행지</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              K-BIZ 가이드들이 추천하는 동남아 베스트 여행지
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 태국 방콕 파타야 */}
            <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src="/images/destinations/thailand-bangkok.svg"
                  alt="태국 방콕 파타야"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 transition-all duration-500 items-center justify-center" 
                  style={{ display: 'none' }}
                >
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <Plane className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-lg font-semibold">태국 방콕 파타야</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Plane className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">태국 방콕 파타야</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">방콕의 화려한 야경과 파타야의 아름다운 해변을 모두 즐기는 완벽한 조합</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">4박 5일 패키지</div>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    자세히 보기 <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 베트남 하롱베이 */}
            <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src="/images/destinations/vietnam-halong.svg"
                  alt="베트남 하롱베이"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-green-800 transition-all duration-500 items-center justify-center"
                  style={{ display: 'none' }}
                >
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <Mountain className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-lg font-semibold">베트남 하롱베이</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Mountain className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">베트남 하노이 하롱베이</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">신비로운 하롱베이 크루즈와 하노이 올드쿼터의 매력적인 문화 체험</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">3박 4일 패키지</div>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    자세히 보기 <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 인도네시아 발리 */}
            <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src="/images/destinations/indonesia-bali.svg"
                  alt="인도네시아 발리"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 transition-all duration-500 items-center justify-center"
                  style={{ display: 'none' }}
                >
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-lg font-semibold">인도네시아 발리</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">인도네시아 발리</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">발리의 신성한 사원과 인스타그램에서 핫한 포토스팟들의 완벽한 만남</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">5박 6일 패키지</div>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    자세히 보기 <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className={commonClasses.container}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              왜 K-BIZ TRAVEL을 선택해야 할까요?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              현지 가이드들과 함께하는 특별한 여행 경험을 만들어보세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">현지 전문가</h3>
              <p className="text-gray-600 leading-relaxed">
                현지에서 직접 거주하며 그 지역을 가장 잘 아는 가이드들이<br />
                진짜 숨겨진 명소들을 안내해드립니다
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">안전 보장</h3>
              <p className="text-gray-600 leading-relaxed">
                모든 여행에는 100% 안전 보험이 포함되며<br />
                24시간 응급상황 지원 서비스를 제공합니다
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">맞춤 서비스</h3>
              <p className="text-gray-600 leading-relaxed">
                취향과 예산에 맞는 완전 맞춤형 여행 일정을<br />
                전문가가 직접 설계해드립니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews - Rotating Carousel */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
        <div className={commonClasses.container}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">고객 후기</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              K-BIZ TRAVEL과 함께한 특별한 여행 이야기
            </p>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <div className="overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="w-full flex-shrink-0 bg-white shadow-xl border-0">
                    <CardContent className="p-12 text-center">
                      <div className="flex justify-center mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      
                      <blockquote className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed italic">
                        "{testimonial.content}"
                      </blockquote>
                      
                      <div className="flex items-center justify-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                          <p className="text-gray-600">{testimonial.location}</p>
                          <p className="text-gray-500 text-sm">{testimonial.date}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <Button
              onClick={prevTestimonial}
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-gray-200 rounded-full w-12 h-12 shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            
            <Button
              onClick={nextTestimonial}
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-gray-200 rounded-full w-12 h-12 shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Dots indicator */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className={commonClasses.container + " relative z-10"}>
          <div className="text-center text-white mb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              지금 바로 특별한 여행을 시작하세요
            </h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              현지 전문가들이 제안하는 맞춤 여행 일정을 확인하고<br />
              가장 완벽한 여행을 선택하세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <Card className="bg-white/95 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-yellow-100 flex items-center justify-center mx-auto">
                  <MessageCircle className="w-10 h-10 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">카카오톡 상담</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    친근하고 편안한 카톡으로<br />24시간 언제든 문의해주세요
                  </p>
                </div>
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-2xl transition-colors">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  카카오톡으로 문의하기
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-green-100 flex items-center justify-center mx-auto">
                  <Phone className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">전화 상담</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    전문 상담사와 직접 통화로<br />자세한 상담을 받아보세요
                  </p>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl transition-colors">
                  <Phone className="w-5 h-5 mr-2" />
                  1588-0000 (평일 9-18시)
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/quote">
              <Button
                size="lg"
                className="px-16 py-6 text-2xl font-bold bg-white text-blue-600 hover:bg-gray-50 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="mr-4 w-8 h-8" />
                지금 바로 무료 견적 받기
                <ArrowRight className="ml-4 w-8 h-8" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-14">
        <div className={commonClasses.container}>
          <div className="grid md:grid-cols-4 gap-12 mb-12">
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
                <Link href="/referral" className="block hover:text-blue-400 transition-colors">레퍼럴 시스템</Link>
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
                  <MessageCircle className="w-5 h-5 text-green-400" />
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
              사업자등록번호: 123-45-67890
              <span className="mx-2">|</span>
              통신판매업신고: 제2024-서울강남-1234호
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}