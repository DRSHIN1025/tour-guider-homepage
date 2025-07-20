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

export default function UserSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.name && formData.email && formData.password) {
      const userData = {
        id: 'user-' + Date.now(),
        name: formData.name,
        nickname: formData.name,
        email: formData.email,
        loginType: 'email'
      };

      localStorage.setItem('userAuth', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      
      alert('회원가입이 완료되었습니다! 환영합니다.');
      router.push('/');
    } else {
      setError('모든 필드를 입력해주세요.');
    }
  };

  const handleSocialSuccess = (user: any) => {
    localStorage.setItem('userAuth', 'true');
    localStorage.setItem('user', JSON.stringify(user));
    
    alert('회원가입이 완료되었습니다! 환영합니다.');
    router.push('/');
  };

  const handleSocialError = (error: any) => {
    setError('소셜 회원가입에 실패했습니다. 다시 시도해주세요.');
    console.error('소셜 회원가입 오류:', error);
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

      {/* 회원가입 폼 */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold" style={{ color: "#3A3A3A" }}>
              투어가이더 회원가입
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              간편하게 가입하고 맞춤 여행을 시작하세요
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 소셜 회원가입 버튼들 */}
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

            {/* 이메일 회원가입 */}
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
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
                이메일로 회원가입
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                이미 계정이 있으신가요?{' '}
                <Link href="/login" className="text-natural-green font-medium hover:underline">
                  로그인
                </Link>
              </p>
            </div>

            <div className="text-xs text-gray-500 text-center">
              회원가입 시{' '}
              <Link href="#" className="underline">이용약관</Link> 및{' '}
              <Link href="#" className="underline">개인정보처리방침</Link>에 동의하게 됩니다.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 