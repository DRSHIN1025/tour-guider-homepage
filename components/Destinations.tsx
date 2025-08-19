'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Mountain, Camera } from "lucide-react";

export default function Destinations() {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">인기 여행지</h2>
      <p className="text-xl text-gray-600 mb-12">현지 가이드들이 추천하는 베스트 여행지</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">태국 방콕 파타야</h3>
            <p className="text-gray-600 mb-4">방콕의 야경과 파타야 비치 리조트</p>
            <Badge className="bg-green-100 text-green-800">인기 1위</Badge>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Mountain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">베트남 하노이 하롱베이</h3>
            <p className="text-gray-600 mb-4">하롱베이 크루즈와 하노이 도심 탐방</p>
            <Badge className="bg-blue-100 text-blue-800">인기 2위</Badge>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">인도네시아 발리</h3>
            <p className="text-gray-600 mb-4">발리의 신성한 사원과 아름다운 해변</p>
            <Badge className="bg-purple-100 text-purple-800">인기 3위</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}