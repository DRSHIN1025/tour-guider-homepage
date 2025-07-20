'use client';

import { useFormStatus, useFormState } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Check, MapPin, Calendar, Users, Plane, Hotel, Heart, User } from "lucide-react";
import { createQuoteSupabase } from "./actions-supabase";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full text-lg py-6" disabled={pending}>
      {pending ? '처리 중...' : '견적 요청 완료하기'}
    </Button>
  );
}

interface FormData {
  // Step 1: 여행 기본 정보
  destination: string;
  startDate: string;
  endDate: string;
  adults: string;
  children: string;
  infants: string;
  
  // Step 2: 세부 요청사항
  airline: string;
  hotel: string;
  travelStyle: string[];
  budget: string;
  requests: string;
  
  // Step 3: 연락처 정보
  name: string;
  phone: string;
  email: string;
}

function QuoteFormContent() {
    const searchParams = useSearchParams();
    const [state, formAction] = useFormState(createQuoteSupabase, null);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
      destination: '',
      startDate: '',
      endDate: '',
      adults: '2',
      children: '0',
      infants: '0',
      airline: '',
      hotel: '',
      travelStyle: [],
      budget: '',
      requests: '',
      name: '',
      phone: '',
      email: ''
    });

    useEffect(() => {
      // URL 파라미터에서 값 가져와서 초기값 설정
      const destination = searchParams.get('destination') || '';
      const duration = searchParams.get('duration') || '';
      const people = searchParams.get('people') || '';
      
      if (destination || duration || people) {
        setFormData(prev => ({
          ...prev,
          destination,
          // duration과 people은 참고용으로만 사용
        }));
      }
    }, [searchParams]);

    const steps = [
      { 
        number: 1, 
        title: '여행 기본 정보', 
        icon: MapPin,
        description: '어디로, 언제, 몇 명이서 여행하시나요?'
      },
      { 
        number: 2, 
        title: '세부 요청사항', 
        icon: Heart,
        description: '어떤 여행을 원하시나요?'
      },
      { 
        number: 3, 
        title: '연락처 정보', 
        icon: User,
        description: '견적을 받을 연락처를 알려주세요'
      }
    ];

    const updateFormData = (field: keyof FormData, value: any) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleTravelStyleChange = (style: string, checked: boolean) => {
      setFormData(prev => ({
        ...prev,
        travelStyle: checked 
          ? [...prev.travelStyle, style]
          : prev.travelStyle.filter(s => s !== style)
      }));
    };

    const validateStep = (step: number): boolean => {
      switch (step) {
        case 1:
          return !!(formData.destination && formData.startDate && formData.endDate && formData.adults);
        case 2:
          return true; // 세부 요청사항은 선택사항
        case 3:
          return !!(formData.name && formData.phone);
        default:
          return false;
      }
    };

    const nextStep = () => {
      if (validateStep(currentStep)) {
        setCurrentStep(prev => Math.min(prev + 1, 3));
      }
    };

    const prevStep = () => {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // FormData를 서버 액션 형식으로 변환
      const formDataForSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'travelStyle') {
          (value as string[]).forEach(style => {
            formDataForSubmit.append('travel-style', style);
          });
        } else if (key === 'startDate') {
          formDataForSubmit.append('start-date', value as string);
        } else if (key === 'endDate') {
          formDataForSubmit.append('end-date', value as string);
        } else {
          formDataForSubmit.append(key, value as string);
        }
      });

      formAction(formDataForSubmit);
    };

    const renderStep = () => {
      switch (currentStep) {
        case 1:
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-2xl font-bold mb-2">여행 기본 정보</h3>
                <p className="text-gray-600">어디로, 언제, 몇 명이서 여행하시나요?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="destination" className="text-lg font-semibold">여행지 *</Label>
                  <Input 
                    id="destination" 
                    value={formData.destination}
                    onChange={(e) => updateFormData('destination', e.target.value)}
                    placeholder="예: 베트남 다낭" 
                    className="mt-2 py-4 text-lg"
                    required 
                  />
                  {searchParams.get('destination') && (
                    <p className="text-sm text-green-600 mt-1">✓ 메인 페이지에서 자동 입력됨</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="start-date" className="text-lg font-semibold">여행 시작일 *</Label>
                  <Input 
                    id="start-date" 
                    type="date" 
                    value={formData.startDate}
                    onChange={(e) => updateFormData('startDate', e.target.value)}
                    className="mt-2 py-4"
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="end-date" className="text-lg font-semibold">여행 종료일 *</Label>
                  <Input 
                    id="end-date" 
                    type="date" 
                    value={formData.endDate}
                    onChange={(e) => updateFormData('endDate', e.target.value)}
                    className="mt-2 py-4"
                    required 
                  />
                </div>
              </div>

              <div>
                <Label className="text-lg font-semibold">인원 *</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <Label htmlFor="adults" className="text-sm text-gray-600">성인</Label>
                    <Input 
                      id="adults"
                      type="number" 
                      value={formData.adults}
                      onChange={(e) => updateFormData('adults', e.target.value)}
                      min="1"
                      className="py-3"
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="children" className="text-sm text-gray-600">아동 (2-11세)</Label>
                    <Input 
                      id="children"
                      type="number" 
                      value={formData.children}
                      onChange={(e) => updateFormData('children', e.target.value)}
                      min="0"
                      className="py-3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="infants" className="text-sm text-gray-600">유아 (0-1세)</Label>
                    <Input 
                      id="infants"
                      type="number" 
                      value={formData.infants}
                      onChange={(e) => updateFormData('infants', e.target.value)}
                      min="0"
                      className="py-3"
                    />
                  </div>
                </div>
                {searchParams.get('people') && (
                  <p className="text-sm text-green-600 mt-2">✓ 참고: {searchParams.get('people')}</p>
                )}
              </div>
            </div>
          );

        case 2:
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Heart className="w-12 h-12 mx-auto mb-4 text-pink-600" />
                <h3 className="text-2xl font-bold mb-2">세부 요청사항</h3>
                <p className="text-gray-600">어떤 여행을 원하시나요?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="airline" className="text-lg font-semibold">항공사 선호도</Label>
                  <Input 
                    id="airline" 
                    value={formData.airline}
                    onChange={(e) => updateFormData('airline', e.target.value)}
                    placeholder="예: 대한항공, 저비용항공, 상관없음" 
                    className="mt-2 py-4"
                  />
                </div>
                
                <div>
                  <Label htmlFor="hotel" className="text-lg font-semibold">호텔 등급</Label>
                  <Input 
                    id="hotel" 
                    value={formData.hotel}
                    onChange={(e) => updateFormData('hotel', e.target.value)}
                    placeholder="예: 3성급, 4성급, 5성급, 리조트" 
                    className="mt-2 py-4"
                  />
                </div>
                
                <div>
                  <Label htmlFor="budget" className="text-lg font-semibold">예산 (1인 기준)</Label>
                  <Input 
                    id="budget" 
                    value={formData.budget}
                    onChange={(e) => updateFormData('budget', e.target.value)}
                    placeholder="예: 100만원, 150만원" 
                    className="mt-2 py-4"
                  />
                </div>
              </div>

              <div>
                <Label className="text-lg font-semibold">여행 스타일 (복수 선택 가능)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {['휴양', '관광', '쇼핑', '맛집', '액티비티', '문화체험', '자연', '사진촬영'].map((style) => (
                    <label key={style} className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        checked={formData.travelStyle.includes(style)}
                        onChange={(e) => handleTravelStyleChange(style, e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">{style}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="requests" className="text-lg font-semibold">추가 요청사항</Label>
                <Textarea
                  id="requests"
                  value={formData.requests}
                  onChange={(e) => updateFormData('requests', e.target.value)}
                  placeholder="특별한 요청사항이나 선호하는 일정이 있으시면 자유롭게 작성해주세요."
                  rows={4}
                  className="mt-2"
                />
                {searchParams.get('duration') && (
                  <p className="text-sm text-green-600 mt-2">✓ 참고 여행기간: {searchParams.get('duration')}</p>
                )}
              </div>
            </div>
          );

        case 3:
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <User className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-2xl font-bold mb-2">연락처 정보</h3>
                <p className="text-gray-600">견적을 받을 연락처를 알려주세요</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-lg font-semibold">이름 *</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="홍길동" 
                    className="mt-2 py-4 text-lg"
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-lg font-semibold">연락처 *</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="010-1234-5678" 
                    className="mt-2 py-4 text-lg"
                    required 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-lg font-semibold">이메일 (선택)</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="example@email.com" 
                  className="mt-2 py-4 text-lg"
                />
              </div>

              {/* 요약 정보 */}
              <div className="bg-gray-50 rounded-lg p-6 mt-8">
                <h4 className="font-semibold text-lg mb-4">📋 견적 요청 요약</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>여행지:</strong> {formData.destination}</p>
                  <p><strong>기간:</strong> {formData.startDate} ~ {formData.endDate}</p>
                  <p><strong>인원:</strong> 성인 {formData.adults}명
                    {formData.children !== '0' && `, 아동 ${formData.children}명`}
                    {formData.infants !== '0' && `, 유아 ${formData.infants}명`}
                  </p>
                  {formData.budget && <p><strong>예산:</strong> {formData.budget}</p>}
                  {formData.travelStyle.length > 0 && (
                    <p><strong>여행스타일:</strong> {formData.travelStyle.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    if (state?.success) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">견적 요청이 완료되었습니다!</h2>
          <p className="text-gray-600 mb-6">
            전문 가이드들이 확인 후 맞춤 견적을 보내드리겠습니다.
          </p>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <a href="/">메인 페이지로 돌아가기</a>
          </Button>
        </div>
      );
    }

    return (
        <div className="space-y-8">
          {/* 진행 상황 표시 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              {steps.map((step) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted ? 'bg-green-600 text-white' :
                      isActive ? 'bg-blue-600 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? <Check className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Progress value={(currentStep / 3) * 100} className="h-2" />
            <p className="text-center text-sm text-gray-600">
              {currentStep}/3 단계 - {steps[currentStep - 1].description}
            </p>
          </div>

          {/* 현재 단계 내용 */}
          <Card>
            <CardContent className="p-8">
              {renderStep()}
            </CardContent>
          </Card>

          {/* 네비게이션 버튼 */}
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              이전
            </Button>

            {currentStep < 3 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
                className="flex items-center gap-2"
              >
                다음
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <form onSubmit={handleSubmit}>
                <SubmitButton />
              </form>
            )}
          </div>

          {state?.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">{state.error}</p>
            </div>
          )}
        </div>
    );
}

function QuoteForm() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <QuoteFormContent />
        </Suspense>
    );
}

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" style={{ color: "#3A3A3A" }}>
              맞춤 여행 견적 요청
            </h1>
            <p className="text-xl text-gray-600">
              단계별로 정보를 입력하시면 전문 가이드들이 맞춤 견적을 보내드립니다.
            </p>
          </div>
          
          <QuoteForm />
        </div>
      </div>
    </div>
  );
} 