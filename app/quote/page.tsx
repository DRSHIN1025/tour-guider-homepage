'use client';

import { useFormStatus, useFormState } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createQuoteSupabase } from "./actions-supabase";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full text-lg py-6" disabled={pending}>
      {pending ? '처리 중...' : '견적 요청 제출하기'}
    </Button>
  );
}

function QuoteFormContent() {
    const searchParams = useSearchParams();
    const [state, formAction] = useFormState(createQuoteSupabase, null);
    
    // URL 파라미터에서 값 가져오기
    const [prefilledData, setPrefilledData] = useState({
        destination: '',
        duration: '',
        people: ''
    });

    useEffect(() => {
        const destination = searchParams.get('destination') || '';
        const duration = searchParams.get('duration') || '';
        const people = searchParams.get('people') || '';
        
        console.log('URL Parameters:', { destination, duration, people }); // 디버깅용
        
        setPrefilledData({
            destination,
            duration,
            people
        });
    }, [searchParams]);

    return (
        <form action={formAction} className="space-y-8">
            {/* 여행 정보 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">여행 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="destination">여행지</Label>
                  <Input 
                    id="destination" 
                    name="destination" 
                    placeholder="예: 베트남 다낭" 
                    defaultValue={prefilledData.destination}
                    required 
                  />
                  {prefilledData.destination && (
                    <p className="text-sm text-green-600">✓ 메인 페이지에서 자동 입력됨</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="airline">항공사</Label>
                  <Input id="airline" name="airline" placeholder="예: 대한항공, 저비용항공, 직접 구매 등" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start-date">여행 시작일</Label>
                  <Input id="start-date" name="start-date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">여행 종료일</Label>
                  <Input id="end-date" name="end-date" type="date" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>인원</Label>
                <div className="grid grid-cols-3 gap-4">
                  <Input type="number" name="adults" placeholder="성인" required />
                  <Input type="number" name="children" placeholder="아동" />
                  <Input type="number" name="infants" placeholder="유아" />
                </div>
                {prefilledData.people && (
                  <p className="text-sm text-green-600">✓ 참고: {prefilledData.people}</p>
                )}
              </div>
            </div>

            {/* 세부 요청 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">세부 요청사항</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="hotel">호텔 등급</Label>
                  <Input id="hotel" name="hotel" placeholder="예: 3성급, 4성급, 5성급, 리조트" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">예산</Label>
                  <Input id="budget" name="budget" placeholder="예: 100만원, 200만원" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>여행 스타일 (복수 선택 가능)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['휴양', '관광', '쇼핑', '맛집', '액티비티', '문화체험', '자연', '사진촬영'].map((style) => (
                    <label key={style} className="flex items-center space-x-2">
                      <input type="checkbox" name="travel-style" value={style} />
                      <span className="text-sm">{style}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="requests">추가 요청사항</Label>
                <Textarea
                  id="requests"
                  name="requests"
                  placeholder="특별한 요청사항이나 선호하는 일정이 있으시면 자유롭게 작성해주세요."
                  rows={4}
                />
                {prefilledData.duration && (
                  <p className="text-sm text-green-600">✓ 참고 여행기간: {prefilledData.duration}</p>
                )}
              </div>
            </div>

            {/* 연락처 정보 섹션 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">연락처 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input id="name" name="name" placeholder="홍길동" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">연락처</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="010-1234-5678" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일 (선택)</Label>
                <Input id="email" name="email" type="email" placeholder="example@email.com" />
              </div>
            </div>

            {state?.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700">{state.error}</p>
              </div>
            )}

            <SubmitButton />
        </form>
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
              자세한 정보를 입력해주시면 전문 가이드들이 맞춤 견적을 보내드립니다.
            </p>
          </div>
          
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">
                견적 요청서
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <QuoteForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 