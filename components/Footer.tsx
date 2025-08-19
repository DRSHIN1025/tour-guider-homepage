'use client';

import Link from "next/link";
import { Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Top Footer */}
      <div className="py-16 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold mb-2">전화 상담</h4>
              <p className="text-2xl font-bold text-blue-400 mb-1">02-1234-5678</p>
              <p className="text-gray-400">(09:00-18:00)</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">K</span>
              </div>
              <h4 className="text-lg font-bold mb-2">카카오톡</h4>
              <p className="text-2xl font-bold text-yellow-400 mb-1">@kbiztravel</p>
              <p className="text-gray-400">[24시간 상담]</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold mb-2">이메일</h4>
              <p className="text-2xl font-bold text-green-400 mb-1">contact@kbiztravel.co.kr</p>
              <p className="text-gray-400">빠른 답변 보장</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-white">© K-BIZ TRAVEL</h4>
              <p className="text-white/90">동남아 특화 맞춤여행</p>
              <p className="text-white/90">여행에 즐거움을 더하다</p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">서비스</h4>
              <div className="space-y-2 text-white/90">
                <p>여행상품</p>
                <p>견적 상담</p>
                <p>고객후기</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">고객지원</h4>
              <div className="space-y-2 text-white/90">
                <p>전화: 1588-0000</p>
                <p>이메일: help@travelplanner.co.kr</p>
                <p>카카오톡: @travelplanner</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">파트너 프로그램</h4>
              <p className="text-white/90">여행 추천으로 수익 창출!</p>
              <p className="text-white/90">부업으로 시작해보세요.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright and Legal Links */}
      <div className="border-t py-4 text-sm text-slate-500">
        <div className="container mx-auto px-4 text-center">
          © 2025 K-BIZ TRAVEL · 이용약관 · 개인정보처리방침
        </div>
      </div>
    </footer>
  );
}
