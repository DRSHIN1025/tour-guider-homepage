'use client';

import { Users, Shield, Heart } from "lucide-react";

export default function Benefits() {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">왜 K-BIZ TRAVEL을 선택해야 할까요?</h2>
      <p className="text-xl text-gray-600 mb-12">현지 전문가와 함께하는 특별한 여행 경험</p>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">현지 전문가</h3>
          <p className="text-gray-600">현지에서 5년 이상 거주한 전문 가이드</p>
        </div>
        
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">안전 보장</h3>
          <p className="text-gray-600">100% 보험 처리 및 24시간 응급 지원</p>
        </div>
        
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">맞춤 서비스</h3>
          <p className="text-gray-600">개인 맞춤형 여행 일정 설계</p>
        </div>
      </div>
    </div>
  );
}