'use client';

import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowLeft,
  ArrowRight,
  Plane,
  Hotel,
  Car,
  Utensils,
  Camera,
  CheckCircle,
  Phone,
  Mail,
  Clock,
  Shield,
  Heart
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
    services: ["항공권", "호텔", "전용 가이드", "교통편", "식사"],
    description: "동남아의 대표적인 여행지 태국에서 방콕의 화려한 도시 문화와 파타야의 아름다운 해변을 동시에 경험할 수 있는 완벽한 패키지입니다.",
    detailedItinerary: [
      {
        day: "1일차",
        title: "인천 출발 → 방콕 도착",
        activities: ["인천공항 출발", "수완나품 공항 도착", "호텔 체크인", "짜뚜짝 주말시장 방문"]
      },
      {
        day: "2일차", 
        title: "방콕 시내 관광",
        activities: ["왕궁 및 에메랄드 사원", "왓포 사원", "차오프라야강 크루즈", "아시아티크 야시장"]
      },
      {
        day: "3일차",
        title: "방콕 → 파타야 이동",
        activities: ["파타야 이동", "해변 자유시간", "워킹스트리트 탐방", "호텔 휴식"]
      },
      {
        day: "4일차",
        title: "파타야 액티비티",
        activities: ["노아 종국 쇼", "콘서트홀 방문", "해변 액티비티", "쇼핑 자유시간"]
      },
      {
        day: "5일차",
        title: "파타야 → 방콕 → 인천",
        activities: ["면세점 쇼핑", "공항 이동", "인천공항 도착"]
      }
    ],
    included: [
      "왕복 항공료 (대한항공/아시아나항공)",
      "4박 숙박 (4성급 호텔)",
      "전용 가이드 및 차량",
      "주요 관광지 입장료",
      "일정표상 식사 (4조식, 3중식, 2석식)",
      "여행자 보험"
    ],
    excluded: [
      "개인 경비",
      "선택관광 비용", 
      "가이드/기사 팁",
      "매너팁 (1인당 $20)"
    ]
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
    services: ["항공권", "크루즈", "전용 가이드", "교통편", "식사"],
    description: "베트남의 수도 하노이와 세계문화유산 하롱베이의 신비로운 자연경관을 함께 즐길 수 있는 프리미엄 투어입니다.",
    detailedItinerary: [
      {
        day: "1일차",
        title: "인천 출발 → 하노이 도착",
        activities: ["인천공항 출발", "노이바이 공항 도착", "호텔 체크인", "구시가지 산책"]
      },
      {
        day: "2일차",
        title: "하노이 시내 관광",
        activities: ["호치민 묘소", "문묘", "하노이 대성당", "호안끼엠 호수"]
      },
      {
        day: "3일차", 
        title: "하노이 → 하롱베이",
        activities: ["하롱베이 이동", "크루즈 승선", "석회동굴 탐험", "크루즈 숙박"]
      },
      {
        day: "4일차",
        title: "하롱베이 크루즈",
        activities: ["일출 감상", "카약 체험", "크루즈 점심", "하노이 복귀"]
      },
      {
        day: "5일차",
        title: "하노이 자유시간",
        activities: ["36거리 쇼핑", "전통 마사지", "베트남 커피 체험", "야시장 탐방"]
      },
      {
        day: "6일차",
        title: "하노이 → 인천",
        activities: ["마지막 쇼핑", "공항 이동", "인천공항 도착"]
      }
    ],
    included: [
      "왕복 항공료 (베트남항공/비엣젯항공)",
      "5박 숙박 (4성급 호텔 + 크루즈 1박)",
      "하롱베이 프리미엄 크루즈",
      "전용 가이드 및 차량", 
      "주요 관광지 입장료",
      "일정표상 식사",
      "여행자 보험"
    ],
    excluded: [
      "개인 경비",
      "선택관광 비용",
      "가이드/기사 팁", 
      "매너팁 (1인당 $25)"
    ]
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
    services: ["항공권", "리조트", "전용 가이드", "교통편", "식사"],
    description: "신들의 섬 발리에서 신성한 사원과 아름다운 자연, 그리고 인스타그램 핫플레이스까지 모든 것을 경험할 수 있는 럭셔리 투어입니다.",
    detailedItinerary: [
      {
        day: "1일차",
        title: "인천 출발 → 발리 도착",
        activities: ["인천공항 출발", "덴파사르 공항 도착", "리조트 체크인", "해변 산책"]
      },
      {
        day: "2일차",
        title: "우붓 투어", 
        activities: ["우붓 라이스테라스", "원숭이 숲", "우붓 전통시장", "스파 체험"]
      },
      {
        day: "3일차",
        title: "사원 투어",
        activities: ["타나롯 사원", "울룬다누 사원", "전통 무용 관람", "리조트 휴식"]
      },
      {
        day: "4일차",
        title: "해변 액티비티",
        activities: ["누사두아 해변", "수상스포츠", "해변 카페", "선셋 디너"]
      },
      {
        day: "5일차",
        title: "쿠타 & 스미냑",
        activities: ["쿠타 해변", "스미냑 쇼핑", "인스타 스팟 투어", "바롱 댄스"]
      },
      {
        day: "6일차",
        title: "자유시간",
        activities: ["마지막 쇼핑", "스파 또는 해변", "리조트 휴식", "석별 만찬"]
      },
      {
        day: "7일차",
        title: "발리 → 인천", 
        activities: ["면세점 쇼핑", "공항 이동", "인천공항 도착"]
      }
    ],
    included: [
      "왕복 항공료 (가루다인도네시아/대한항공)",
      "6박 숙박 (5성급 리조트)",
      "전용 가이드 및 차량",
      "주요 관광지 입장료", 
      "일정표상 식사",
      "전통 스파 1회",
      "여행자 보험"
    ],
    excluded: [
      "개인 경비",
      "선택관광 비용",
      "가이드/기사 팁",
      "매너팁 (1인당 $30)"
    ]
  }
];

interface PageProps {
  params: { slug: string };
}

export default function ProductDetailPage({ params }: PageProps) {
  const destination = destinations.find(d => d.slug === params.slug);
  
  if (!destination) {
    notFound();
  }

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

      {/* Breadcrumb */}
      <section className="py-6 bg-gray-50 border-b">
        <div className={commonClasses.container}>
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-blue-600">홈</Link>
            <span className="text-gray-400">›</span>
            <Link href="/products" className="text-gray-500 hover:text-blue-600">여행 상품</Link>
            <span className="text-gray-400">›</span>
            <span className="text-blue-600 font-medium">{destination.name}</span>
          </div>
          <Link href="/products" className="inline-flex items-center text-blue-600 hover:text-blue-700 mt-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            상품 목록으로 돌아가기
          </Link>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${destination.image}')` }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className={commonClasses.container + " relative z-10 h-full flex items-center"}>
          <div className="text-white max-w-2xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              {destination.country}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{destination.name}</h1>
            <p className="text-xl mb-6 leading-relaxed opacity-90">
              {destination.description}
            </p>
            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">{destination.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{destination.rating}</span>
              </div>
              <div className="text-2xl font-bold">
                {destination.price}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-12 bg-white border-b">
        <div className={commonClasses.container}>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">여행 기간</h3>
              <p className="text-gray-600">{destination.duration}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">안전 보장</h3>
              <p className="text-gray-600">24시간 지원</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">전용 가이드</h3>
              <p className="text-gray-600">현지 전문가</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">맞춤 서비스</h3>
              <p className="text-gray-600">개인 맞춤</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Itinerary */}
      <section className="py-24 bg-gray-50">
        <div className={commonClasses.container}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">상세 일정표</h2>
            <p className="text-xl text-gray-600">
              매일매일 특별한 경험이 기다리고 있습니다
            </p>
          </div>

          <div className="space-y-8">
            {destination.detailedItinerary.map((day, index) => (
              <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">{day.day.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-blue-600 mb-2">{day.day}</h3>
                          <h4 className="text-2xl font-bold text-gray-900">{day.title}</h4>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        {day.activities.map((activity, actIndex) => (
                          <div key={actIndex} className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                            <span className="text-gray-700">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Included/Excluded */}
      <section className="py-24 bg-white">
        <div className={commonClasses.container}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">포함/불포함 사항</h2>
            <p className="text-xl text-gray-600">투명한 가격 정책으로 안심하세요</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-green-200 bg-green-50/30">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <CheckCircle className="w-6 h-6 mr-3" />
                  포함 사항
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {destination.included.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50/30">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <div className="w-6 h-6 mr-3 rounded-full border-2 border-red-600 flex items-center justify-center">
                    <div className="w-3 h-0.5 bg-red-600"></div>
                  </div>
                  불포함 사항
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {destination.excluded.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full border-2 border-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-0.5 bg-red-400"></div>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600">
        <div className={commonClasses.container}>
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              지금 바로 예약하세요!
            </h2>
            <p className="text-xl opacity-90 mb-10 max-w-3xl mx-auto">
              {destination.name}에서 잊지 못할 추억을 만들어보세요.<br />
              현지 전문가가 함께하는 특별한 여행이 시작됩니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/quote">
                <Button size="lg" className="px-12 py-6 text-xl font-bold bg-white text-blue-600 hover:bg-gray-50">
                  <Plane className="w-6 h-6 mr-3" />
                  지금 견적 요청하기
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-12 py-6 text-xl font-bold border-white text-white hover:bg-white/10">
                <Phone className="w-6 h-6 mr-3" />
                전화 상담 받기
              </Button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">📞 전화 상담</h3>
              <p className="text-xl font-bold mb-2">1588-0000</p>
              <p className="opacity-90">평일 9:00-18:00 (토요일 9:00-15:00)</p>
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