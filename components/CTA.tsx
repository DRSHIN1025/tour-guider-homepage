'use client';

import { Button } from "@/components/ui/button";
import { MessageCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  const handleKakaoChat = () => {
    const KAKAO_CHANNEL_ID = 'TEMP_CHANNEL';
    window.open(`https://pf.kakao.com/${KAKAO_CHANNEL_ID}/chat`, '_blank');
  };

  const handlePayment = () => {
    window.location.href = '/payment';
  };

  return (
    <div className="bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">지금 바로 시작하세요</h2>
      <p className="text-xl opacity-90 max-w-3xl mx-auto mb-12">
        간편한 상담부터 안전한 결제까지, 모든 과정이 쉽고 투명합니다
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
        <div className="bg-yellow-400 rounded-2xl p-8 text-gray-900">
          <div className="w-16 h-16 rounded-2xl bg-yellow-500 flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-yellow-800" />
          </div>
          <h3 className="text-2xl font-bold mb-3">카카오톡 상담</h3>
          <p className="mb-6">친근하고 편안한 카톡으로<br />24시간 언제든 문의해주세요</p>
          <Button 
            onClick={handleKakaoChat}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 rounded-xl transition-colors"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            카카오톡으로 문의하기
          </Button>
        </div>

        <div className="bg-white rounded-2xl p-8 text-gray-900">
          <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold mb-3">예약금 결제</h3>
          <p className="mb-6">안전한 결제 시스템을 통해<br />예약금을 결제하세요</p>
          <Button 
            onClick={handlePayment}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            예약금 결제하기
          </Button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg opacity-90 mb-4">
          💎 무료 견적 · 🎯 맞춤 상담 · 💰 투명한 가격 · 🛡️ 안전 보장
        </p>
        <div className="text-2xl font-bold mb-2">1588-0000</div>
        <p className="text-lg opacity-90">평일 9:00-18:00</p>
      </div>
    </div>
  );
}