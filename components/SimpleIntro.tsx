'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Users, Award } from "lucide-react";
import Link from "next/link";

export default function SimpleIntro() {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-green-600 text-white border-0 px-6 py-2 text-sm font-semibold">
            <Shield className="w-4 h-4 mr-2" />
            검증된 여행 전문성
          </Badge>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            <span className="block">동남아 여행의</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              새로운 기준
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            정부기관부터 대기업까지, 까다로운 요구사항을 완벽하게 소화해온 <br className="hidden sm:block" />
            <span className="font-semibold text-gray-800">검증된 여행 전문성을 경험하세요</span>
          </p>

          {/* 간단한 통계 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3년+</div>
              <div className="text-sm text-gray-600">축적된 경험</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">1,500명+</div>
              <div className="text-sm text-gray-600">고객 만족</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">15회+</div>
              <div className="text-sm text-gray-600">대형 프로젝트</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-600">안전 운영</div>
            </div>
          </div>

          <Link href="/about">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg font-medium">
              회사 소개 더보기
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}


