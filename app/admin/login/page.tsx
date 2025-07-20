'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import KakaoLogin from "@/components/KakaoLogin";
import NaverLogin from "@/components/NaverLogin";
import GoogleLogin from "@/components/GoogleLogin";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 간단한 인증 (실제 프로덕션에서는 더 안전한 방법 사용)
    if (credentials.username === 'admin' && credentials.password === 'tourguider2024') {
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminUser', JSON.stringify({
        id: 'admin',
        nickname: '관리자',
        email: 'admin@tourguider.com',
        loginType: 'traditional'
      }));
      router.push('/admin');
    } else {
      setError('아이디 또는 비밀번호가 잘못되었습니다.');
    }
  };

  const handleSocialSuccess = (user: any) => {
    console.log('소셜 로그인 성공:', user);
    // 성공 처리는 각 컴포넌트에서 이미 처리됨
  };

  const handleSocialError = (error: any) => {
    setError('소셜 로그인에 실패했습니다. 다시 시도해주세요.');
    console.error('소셜 로그인 오류:', error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">관리자 로그인</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            투어가이더 관리자 시스템에 로그인하세요
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 소셜 로그인 버튼들 */}
          <div className="space-y-3">
            <KakaoLogin onSuccess={handleSocialSuccess} onError={handleSocialError} />
            <NaverLogin onSuccess={handleSocialSuccess} onError={handleSocialError} />
            <GoogleLogin onSuccess={handleSocialSuccess} onError={handleSocialError} />
          </div>

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-2 text-sm text-gray-500">또는</span>
            </div>
          </div>

          {/* 기존 로그인 */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">아이디</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button type="submit" className="w-full" variant="outline">
              기존 방식으로 로그인
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">💡 테스트 방법:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>소셜 로그인:</strong> 현재 데모 모드로 바로 로그인됩니다</p>
              <p><strong>기존 로그인:</strong> admin / tourguider2024</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 