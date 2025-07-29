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
  Plane,
  Camera,
  Award,
  TrendingUp,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { UserHeader } from "@/components/UserHeader"
import { KakaoChat } from "@/components/KakaoChat"

export default function TourGuiderHomepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30">
      {/* Enhanced Header with glassmorphism effect */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 shadow-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                투어가이더
              </span>
              <p className="text-xs text-gray-500 font-medium">Premium Travel Experience</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium relative group">
              회사소개
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/quote" className="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium relative group">
              견적 요청
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/reviews" className="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium relative group">
              후기
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium relative group">
              고객센터
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
          
          <UserHeader />
        </div>
      </header>

      {/* Enhanced Hero Section with animated elements */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 opacity-20 animate-bounce delay-300">
          <Plane className="w-8 h-8 text-emerald-600" />
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-20 animate-bounce delay-700">
          <Camera className="w-6 h-6 text-blue-600" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 opacity-20 animate-bounce delay-1000">
          <Heart className="w-7 h-7 text-pink-500" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div className="space-y-8">
              
              <h1 className="text-6xl lg:text-8xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  여행, 이제 직접
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                  제안받고 고르세요
                </span>
              </h1>
              
              <p className="text-2xl lg:text-3xl leading-relaxed max-w-4xl mx-auto text-gray-600 font-light">
                동남아 현지 가이드들이 직접 <span className="font-semibold text-emerald-600">맞춤 여행 일정</span>을 제안해드립니다.
                <br />
                여러 견적을 비교하고 가장 마음에 드는 여행을 선택하세요.
              </p>
            </div>

            {/* Enhanced Search Form */}
            <div className="bg-white/90 backdrop-blur-xl p-10 lg:p-12 rounded-3xl shadow-2xl border border-white/20 max-w-5xl mx-auto transform hover:scale-[1.02] transition-all duration-300">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">✈️ 맞춤 여행 요청</h3>
                <p className="text-gray-600">현지 가이드들이 직접 제안하는 맞춤 여행</p>
              </div>
              
              <form action="/quote" method="GET" className="space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3 group">
                    <label className="text-sm font-bold text-gray-700 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                      여행지
                    </label>
                    <div className="relative">
                      <Input 
                        name="destination"
                        placeholder="베트남, 태국, 필리핀..." 
                        className="h-14 text-lg border-2 border-gray-200 focus:border-emerald-500 rounded-2xl pl-4 pr-12 transition-all duration-300 group-hover:border-emerald-300" 
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 group">
                    <label className="text-sm font-bold text-gray-700 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      여행 기간
                    </label>
                    <div className="relative">
                      <Input 
                        name="duration"
                        placeholder="3박4일, 4박5일..." 
                        className="h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-2xl pl-4 pr-12 transition-all duration-300 group-hover:border-blue-300" 
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="w-3 h-3 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 group">
                    <label className="text-sm font-bold text-gray-700 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-purple-600" />
                      인원
                    </label>
                    <div className="relative">
                      <Input 
                        name="people"
                        placeholder="성인 2명, 아동 1명..." 
                        className="h-14 text-lg border-2 border-gray-200 focus:border-purple-500 rounded-2xl pl-4 pr-12 transition-all duration-300 group-hover:border-purple-300" 
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-3 h-3 text-purple-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full h-16 text-2xl font-bold text-white rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  <Sparkles className="mr-3 w-6 h-6" />
                  맞춤 견적 요청하기 →
                </Button>
              </form>
            </div>

            {/* Enhanced Stats */}
            <div className="flex flex-wrap items-center justify-center gap-12 text-gray-600 mt-12">
              <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <span className="font-bold text-xl text-emerald-600">1,000+</span>
                  <p className="text-sm text-gray-600">현지 가이드</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <span className="font-bold text-xl text-yellow-600">평점 4.9/5.0</span>
                  <p className="text-sm text-gray-600">고객 만족도</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <span className="font-bold text-xl text-blue-600">100%</span>
                  <p className="text-sm text-gray-600">안전한 여행 보장</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Service Flow Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50/80 to-blue-50/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-lg border border-gray-200 mb-6">
              <TrendingUp className="w-5 h-5 text-emerald-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Simple Process</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                간단한 3단계로 완성되는
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                맞춤 여행
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              복잡한 여행 계획, 이제 전문 가이드에게 맡기세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {[
              {
                step: "01",
                icon: MapPin,
                title: "맞춤 여행 요청",
                description: "원하는 여행지와 일정을\n간단히 입력해주세요",
                color: "emerald",
                bgColor: "from-emerald-500 to-teal-500"
              },
              {
                step: "02", 
                icon: Users,
                title: "현지 가이드 견적 제안",
                description: "현지 전문 가이드들이\n맞춤 일정과 견적을 제안",
                color: "blue",
                bgColor: "from-blue-500 to-indigo-500"
              },
              {
                step: "03",
                icon: CheckCircle,
                title: "선택 후 출발",
                description: "마음에 드는 여행을 선택하고\n즐거운 여행을 시작하세요",
                color: "purple", 
                bgColor: "from-purple-500 to-pink-500"
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.bgColor} flex items-center justify-center shadow-lg`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-gray-200 group-hover:text-gray-300 transition-colors">
                      {item.step}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                  
                  <div className={`mt-6 w-full h-1 bg-gradient-to-r ${item.bgColor} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                </div>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Reviews Section */}
      <section className="py-24 bg-gradient-to-br from-white to-emerald-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full shadow-lg mb-6">
              <Award className="w-5 h-5 text-emerald-600 mr-2" />
              <span className="text-sm font-medium text-emerald-700">Customer Stories</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                실제 고객들의
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                생생한 여행 이야기
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              5,000여 명의 고객이 경험한 특별한 여행의 순간들을 만나보세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-8xl mx-auto">
            {[
              {
                name: "김민지님",
                age: "30대",
                trip: "베트남 다낭 4박5일",
                rating: 5,
                title: "신혼여행으로 완벽했어요!",
                content: "가이드님이 로맨틱한 장소들을 많이 추천해주시고, 사진도 정말 잘 찍어주셨어요. 평생 잊지 못할 추억이 되었습니다.",
                highlight: "로맨틱 여행",
                avatar: "👩‍💼"
              },
              {
                name: "박상훈님", 
                age: "50대",
                trip: "태국 방콕·파타야 5박6일",
                rating: 5,
                title: "부모님께 효도할 수 있어서 좋았습니다",
                content: "부모님 걸음에 맞춰 천천히 안내해주시고, 현지 맛집까지 소개해주셔서 정말 만족스러운 여행이었습니다.",
                highlight: "효도 여행",
                avatar: "👨‍💼"
              },
              {
                name: "이수진님",
                age: "40대", 
                trip: "필리핀 세부 3박4일",
                rating: 5,
                title: "혼자 여행도 이렇게 안전할 수 있구나",
                content: "혼자 여행하는 여성이라 걱정했는데, 가이드님이 항상 챙겨주셔서 정말 편안한 여행이었어요.",
                highlight: "안전한 혼자 여행", 
                avatar: "👩"
              }
            ].map((review, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <div className="text-3xl">{review.avatar}</div>
                  </div>

                  <Quote className="w-10 h-10 text-emerald-200 mb-4" />
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {review.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                    {review.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-800 flex items-center">
                        {review.name} 
                        <span className="text-sm text-gray-500 ml-2">({review.age})</span>
                      </p>
                      <p className="text-sm text-gray-600">{review.trip}</p>
                    </div>
                    
                    <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                      #{review.highlight}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/reviews">
              <Button
                size="lg"
                className="px-8 py-4 text-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                더 많은 후기 보기
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Target Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50/40 to-indigo-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                이런 분들을 위해
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                특별히 준비했습니다
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: User,
                title: "혼자 여행하는\n중년층",
                description: "안전하고 편안한\n나만의 특별한 여행",
                color: "from-purple-500 to-pink-500",
                bgColor: "from-purple-50 to-pink-50"
              },
              {
                icon: Heart,
                title: "부모님 모시고\n가는 여행",
                description: "부모님 속도에 맞춘\n편안한 효도 여행",
                color: "from-red-500 to-rose-500", 
                bgColor: "from-red-50 to-rose-50"
              },
              {
                icon: Baby,
                title: "온 가족이 함께\n하는 여행",
                description: "아이들과 함께하는\n안전한 가족 여행",
                color: "from-orange-500 to-yellow-500",
                bgColor: "from-orange-50 to-yellow-50"
              },
              {
                icon: Briefcase,
                title: "바쁜 직장인의\n힐링 여행",
                description: "계획 없이도 완벽한\n스트레스 프리 여행",
                color: "from-blue-500 to-cyan-500",
                bgColor: "from-blue-50 to-cyan-50"
              }
            ].map((item, index) => (
              <div key={index} className={`bg-gradient-to-br ${item.bgColor} p-8 rounded-3xl hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group`}>
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 text-center mb-4 whitespace-pre-line">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 text-center leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-700 via-teal-700 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center text-white">
            <h2 className="text-5xl lg:text-6xl font-bold mb-8">
              특별한 여행의 시작
            </h2>
            <p className="text-2xl mb-12 opacity-90 font-light">
              지금 바로 맞춤 견적을 받고 꿈꾸던 여행을 현실로 만드세요
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
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
                  <KakaoChat />
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
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-colors" 
                    onClick={() => {
                      console.log('전화 버튼 클릭됨');
                      window.location.href = 'tel:1588-0000';
                    }}
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
                
                <Link href="/payment">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-12 py-6 text-2xl font-bold border-white text-white hover:bg-white hover:text-emerald-600 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                  >
                    💳 상담 서비스 결제
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
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
              <div className="flex space-x-4">
                <div 
                  className="w-10 h-10 bg-gray-700 hover:bg-emerald-600 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                  onClick={() => window.open('https://facebook.com/tourguider', '_blank')}
                >
                  <span className="text-sm">📘</span>
                </div>
                <div 
                  className="w-10 h-10 bg-gray-700 hover:bg-emerald-600 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                  onClick={() => window.open('https://instagram.com/tourguider', '_blank')}
                >
                  <span className="text-sm">📷</span>
                </div>
                <div 
                  className="w-10 h-10 bg-gray-700 hover:bg-emerald-600 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                  onClick={() => window.open('https://twitter.com/tourguider', '_blank')}
                >
                  <span className="text-sm">🐦</span>
                </div>
              </div>
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
                    onClick={() => {
                      console.log('푸터 카카오채널 버튼 클릭됨');
                      window.open('https://pf.kakao.com/_your_channel_id/chat', '_blank');
                    }}
                  >
                    <MessageCircle className="mr-2 w-4 h-4" />
                    카카오채널
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 py-3 rounded-xl transition-colors" 
                    onClick={() => {
                      console.log('앱 다운로드 버튼 클릭됨');
                      window.open('https://play.google.com/store/apps/details?id=com.tourguider.app', '_blank');
                    }}
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
