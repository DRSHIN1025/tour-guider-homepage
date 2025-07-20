'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function TestContent() {
  const searchParams = useSearchParams();
  
  const destination = searchParams.get('destination');
  const duration = searchParams.get('duration');
  const people = searchParams.get('people');
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">URL 파라미터 테스트</h1>
      <div className="space-y-2">
        <p><strong>여행지:</strong> {destination || '없음'}</p>
        <p><strong>기간:</strong> {duration || '없음'}</p>
        <p><strong>인원:</strong> {people || '없음'}</p>
      </div>
      <div className="mt-6">
        <a href="/test?destination=베트남&duration=3박4일&people=성인2명" className="text-blue-500 underline">
          테스트 링크 클릭
        </a>
      </div>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <TestContent />
    </Suspense>
  );
} 