'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import UserSocialLogin from "@/components/UserSocialLogin";
import Link from "next/link";

export default function UserLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 사용자 로그인 처리 (데모)
    if (credentials.email && credentials.password) {
      localStorage.setItem('userAuth', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 'user-' + Date.now(),
        name: '사용자',
        email: credentials.email,
        loginType: 'email'
      }));
      router.push('/');
    } else {
      setError('이메일과 비밀번호를 입력해주세요.');
    }
  };

  const handleSocialSuccess = (user: any) => {
    // 일반 사용자로 로그인 (관리자 권한 체크 없음)
    const userData = {
      ...user,
      isUser: true // 일반 사용자 플래그
    };
    
    localStorage.setItem('userAuth', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    
    console.log('사용자 소셜 로그인 성공:', userData);
    router.push('/');
  };

  const handleSocialError = (error: any) => {
    setError('소셜 로그인에 실패했습니다. 다시 시도해주세요.');
    console.error('소셜 로그인 오류:', error);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F5EF" }}>
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-natural-beige">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#2D5C4D" }}
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold" style={{ color: "#3A3A3A" }}>
                투어가이더
              </span>
              <p className="text-xs text-gray-500">tourguider.com</p>
            </div>
          </Link>
        </div>
      </header>

      {/* 로그인 폼 */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold" style={{ color: "#3A3A3A" }}>
              투어가이더 로그인
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              간편하게 로그인하고 맞춤 여행을 시작하세요
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 소셜 로그인 버튼들 */}
            <div className="space-y-3">
              <UserSocialLogin provider="kakao" onSuccess={handleSocialSuccess} onError={handleSocialError} />
              <UserSocialLogin provider="naver" onSuccess={handleSocialSuccess} onError={handleSocialError} />
              <UserSocialLogin provider="google" onSuccess={handleSocialSuccess} onError={handleSocialError} />
            </div>

            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-2 text-sm text-gray-500">또는 이메일로</span>
              </div>
            </div>

            {/* 이메일 로그인 */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  required
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <Button 
                type="submit" 
                className="w-full" 
                style={{ backgroundColor: "#2D5C4D" }}
              >
                이메일로 로그인
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                아직 계정이 없으신가요?{' '}
                <Link href="/signup" className="text-natural-green font-medium hover:underline">
                  회원가입
                </Link>
              </p>
              <p className="text-xs text-gray-500">
                <Link href="/admin/login" className="hover:underline">
                  관리자 로그인
                </Link>
              </p>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">🎉 소셜 로그인 혜택:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p>• 간편한 원클릭 로그인</p>
                <p>• 개인 맞춤 여행 추천</p>
                <p>• 견적 요청 이력 관리</p>
                <p>• 여행 후기 작성 및 공유</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 