'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Plane } from "lucide-react";
import { useState } from "react";

export default function Hero() {
  const [quoteData, setQuoteData] = useState({
    destination: '',
    duration: '',
    people: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setQuoteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuoteRequest = () => {
    const params = new URLSearchParams({
      destination: quoteData.destination,
      duration: quoteData.duration,
      people: quoteData.people
    });
    window.location.href = `/quote?${params.toString()}`;
  };

  return (
    <section id="hero" className="py-20 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 px-6 py-2 text-sm font-semibold">
            <TrendingUp className="w-4 h-4 mr-2" />
            동남아 여행의 새로운 기준
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            여행, 이제 직접<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 animate-pulse">
              제안받고 고르세요
            </span>
          </h1>
          
          <p className="text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            동남아 현지 가이드들이 직접 맞춤 여행 일정을 제안해드립니다.<br />
            <span className="text-green-600 font-semibold">여러 견적을 비교하고 가장 마음에 드는 여행을 선택하세요.</span>
          </p>
          
          {/* Enhanced Quote Form */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-10 max-w-5xl mx-auto shadow-2xl border border-white/30 transform hover:scale-[1.02] transition-all duration-500">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">무료 맞춤 견적 받기</h3>
              <p className="text-gray-600">3분만에 현지 가이드들의 맞춤 제안을 받아보세요!</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">여행지</label>
                <input
                  type="text"
                  placeholder="예: 태국 방콕"
                  value={quoteData.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">여행 기간</label>
                <input
                  type="text"
                  placeholder="예: 5박 6일"
                  value={quoteData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">인원</label>
                <input
                  type="text"
                  placeholder="예: 성인 2명"
                  value={quoteData.people}
                  onChange={(e) => handleInputChange('people', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleQuoteRequest}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Plane className="mr-2 w-5 h-5" />
              무료 견적 받기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}