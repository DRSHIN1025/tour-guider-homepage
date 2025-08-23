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
import { MapPin } from "lucide-react";
import { designSystem, commonClasses } from "@/lib/design-system";

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-teal-50/20 to-purple-50/30">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className={commonClasses.container}>
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-purple-600 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-500 to-purple-600 bg-clip-text text-transparent">
                  K-BIZ TRAVEL
                </div>
                <div className="text-sm text-gray-500">동남아 특화 맞춤여행</div>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">회사소개</Link>
              <Link href="/quote" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">견적 요청</Link>
              <Link href="/reviews" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">여행 후기</Link>
              <Link href="/admin" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">관리자</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* 로그인 폼 */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <Card className="w-full max-w-lg shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-emerald-600" />
            </div>
            <CardTitle className="text-4xl font-bold text-gray-900 mb-6">
              K-BIZ TRAVEL 로그인
            </CardTitle>
            <p className="text-xl text-gray-600">
              간편하게 로그인하고 맞춤 여행을 시작하세요
            </p>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            {/* 소셜 로그인 버튼들 */}
            <div className="space-y-4">
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
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-lg font-medium">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  className="h-14 text-lg"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-lg font-medium">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="h-14 text-lg"
                  required
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <Button 
                type="submit" 
                className="w-full h-16 text-xl font-semibold bg-gradient-to-r from-emerald-400 via-teal-500 to-purple-600 hover:from-emerald-500 hover:via-teal-600 hover:to-purple-700" 
              >
                이메일로 로그인
              </Button>
            </form>

            <div className="text-center space-y-3">
              <p className="text-base text-gray-600">
                아직 계정이 없으신가요?{' '}
                <Link href="/signup" className="text-emerald-600 font-semibold hover:underline text-lg">
                  회원가입
                </Link>
              </p>
              <p className="text-sm text-gray-500">
                <Link href="/admin/login" className="hover:underline">
                  관리자 로그인
                </Link>
              </p>
            </div>

            <div className="mt-8 p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
              <h4 className="font-semibold text-base mb-3">🎉 소셜 로그인 혜택:</h4>
              <div className="text-sm text-gray-600 space-y-2">
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