'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Users, Gift, MapPin } from "lucide-react";
import Link from "next/link";

export default function SimpleServices() {
  const services = [
    {
      icon: Plane,
      title: "맞춤 여행 설계",
      description: "개인/단체 맞춤 여행 일정 설계",
      color: "from-blue-500 to-blue-700"
    },
    {
      icon: Users,
      title: "전속 가이드",
      description: "현지 전문 가이드와 함께하는 여행",
      color: "from-green-500 to-green-700"
    },
    {
      icon: Gift,
      title: "레퍼럴 시스템",
      description: "함께 성장하는 상생 플랫폼",
      color: "from-purple-500 to-purple-700"
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-to-r from-green-600 to-blue-600 text-white border-0 px-6 py-2 text-sm font-semibold">
            <MapPin className="w-4 h-4 mr-2" />
            핵심 서비스
          </Badge>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            <span className="block">왜 K-BIZ TRAVEL을</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              선택해야 할까요?
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            동남아 여행 전문가들이 제공하는 <span className="font-semibold text-gray-800">맞춤형 서비스</span>로<br className="hidden sm:block" />
            잊을 수 없는 여행 경험을 만들어드립니다
          </p>

          {/* 서비스 카드 */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="group">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg font-medium">
                여행 상품 보기
              </Button>
            </Link>
            <Link href="/referral">
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 px-6 py-3 text-lg font-medium">
                레퍼럴 파트너 신청
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


