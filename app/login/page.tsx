'use client';

import React, { useEffect, useState, Suspense } from 'react';
import "@/lib/firebase.client";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getAuthInstance } from '@/lib/firebase';

function LoginContent() {
  const router = useRouter();
  const { signIn, signInWithGoogle, loading } = useAuth();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  // OAuth redirect handler: provider=naver|kakao & code 수신 시 Functions로 교환 후 custom token 로그인
  useEffect(() => {
    const provider = searchParams?.get('provider');
    const code = searchParams?.get('code');
    const state = searchParams?.get('state') || '';
    if (!provider || !code) return;

    const exchange = async () => {
      try {
        const base = window.location.origin;
        const redirectUri = `${base}/login?provider=${provider}`;
        const endpoint = provider === 'kakao' ? 'kakaoOAuth' : 'naverOAuth';
        const resp = await fetch(`https://us-central1-${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.cloudfunctions.net/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            code, 
            state, 
            redirectUri,
            clientId: provider === 'kakao' ? process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID : process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
            clientSecret: provider === 'kakao' ? process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET : process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET
          })
        });
        const data = await resp.json();
        if (!resp.ok || !data.customToken) throw new Error('소셜 로그인 처리 실패');

        // Firebase signInWithCustomToken
        const { signInWithCustomToken } = await import('firebase/auth');
        const auth = getAuthInstance();
        if (!auth) throw new Error('Firebase Auth 초기화 실패');
        await signInWithCustomToken(auth, data.customToken);
        router.push('/dashboard');
      } catch (e: any) {
        setLocalError(e.message || '소셜 로그인에 실패했습니다.');
      }
    };
    exchange();
  }, [searchParams]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    
    if (!email || !password) {
      setLocalError('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    
    const result = await signIn(email, password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setLocalError(result.error || '로그인에 실패했습니다.');
    }
  };

  const handleSocialLogin = async (provider: 'google') => {
    setLocalError('');
    
    const result = await signInWithGoogle();
    
    if (result.success) {
      router.push('/dashboard');
    } else {
      setLocalError(result.error || '로그인에 실패했습니다.');
    }
  };

  const currentError = localError;

  return (
    <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-natural-primary">트래블플래너</span>
          </Link>
          <p className="text-natural-text-light">
            트래블플래너 계정으로 로그인하세요
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader>
            <CardTitle className="text-center bg-gradient-primary bg-clip-text text-transparent font-extrabold">로그인</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">이메일</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-natural-text-light" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-natural-text-light" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-natural-text-light hover:text-natural-text"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {currentError && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{currentError}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 text-white"
                disabled={loading}
              >
                {loading ? '로그인 중...' : '이메일로 로그인'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-2 text-natural-text-light text-sm">또는</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google로 로그인
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full border-yellow-300 hover:bg-yellow-50 text-yellow-700"
                disabled={true}
              >
                <div className="w-5 h-5 mr-2 bg-yellow-400 rounded flex items-center justify-center">
                  <span className="text-black text-xs font-bold">K</span>
                </div>
                카카오로 로그인 (준비 중)
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full border-green-300 hover:bg-green-50 text-green-700"
                disabled={true}
              >
                <div className="w-5 h-5 mr-2 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">N</span>
                </div>
                네이버로 로그인 (준비 중)
              </Button>
            </div>

            {/* Links */}
            <div className="text-center space-y-2 pt-4 border-t border-natural-beige">
              <p className="text-sm text-natural-text-light">
                계정이 없으신가요?{' '}
                <Link href="/signup" className="text-natural-primary hover:underline font-medium">
                  회원가입
                </Link>
              </p>
              <p className="text-sm text-natural-text-light">
                <Link href="/forgot-password" className="text-natural-primary hover:underline">
                  비밀번호를 잊으셨나요?
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
            <p className="text-sm text-natural-text-light">
            로그인하면{' '}
            <Link href="/terms" className="text-natural-primary hover:underline">이용약관</Link>
            {' '}및{' '}
            <Link href="/privacy" className="text-natural-primary hover:underline">개인정보처리방침</Link>
            에 동의하는 것으로 간주됩니다.
          </p>
          
          <div className="pt-4">
            <Link href="/" className="text-natural-primary hover:underline text-sm">
              ← 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <LoginContent />
    </Suspense>
  );
}