'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function Testimonials() {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">고객 후기</h2>
      <p className="text-xl text-gray-600 mb-12">실제 여행객들의 생생한 후기</p>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-0">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">김</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">김민수</h4>
                <p className="text-sm text-gray-500">태국 방콕</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">"태국 방콕 여행이 정말 특별했어요! 현지 가이드 덕분에 숨겨진 맛집과 명소를 많이 알 수 있었습니다."</p>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-0">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">이</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">이지영</h4>
                <p className="text-sm text-gray-500">베트남 하롱베이</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">"베트남 하롱베이 크루즈가 꿈이었는데 완벽하게 이루어졌어요! 가이드의 설명이 너무 좋았습니다."</p>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}