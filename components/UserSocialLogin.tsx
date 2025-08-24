'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { GoogleLogin } from "./GoogleLogin";
import { KakaoLogin } from "./KakaoLogin";
import { NaverLogin } from "./NaverLogin";

declare global {
  interface Window {
    Kakao: any;
    naver: any;
    google: any;
  }
}

interface UserSocialLoginProps {
  onSuccess?: (user: any) => void;
  onError?: (error: any) => void;
  className?: string;
  children?: React.ReactNode;
}

export function UserSocialLogin({ onSuccess, onError, className, children }: UserSocialLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<string>('');

  const handleSocialSuccess = (userData: any) => {
    setIsLoading(false);
    setCurrentProvider('');
    
    if (onSuccess) {
      onSuccess(userData);
    }
  };

  const handleSocialError = (error: any) => {
    setIsLoading(false);
    setCurrentProvider('');
    
    const errorMessage = error?.message || '소셜 로그인 중 오류가 발생했습니다.';
    
    if (onError) {
      onError(error);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    setCurrentProvider(provider);

    try {
      if (provider === 'google') {
        // Google 로그인은 GoogleLogin 컴포넌트에서 처리됨
        return;
      } else if (provider === 'kakao') {
        // Kakao 로그인은 KakaoLogin 컴포넌트에서 처리됨
        return;
      } else if (provider === 'naver') {
        // Naver 로그인은 NaverLogin 컴포넌트에서 처리됨
        return;
      }
    } catch (error) {
      handleSocialError(error);
    }
  };

  const handleDemoLogin = (provider: string) => {
    setIsLoading(true);
    setCurrentProvider(provider);

    try {
      // 데모 사용자 데이터 생성
      const demoUserData = {
        id: `${provider}-demo-user-${Date.now()}`,
        email: `${provider}-demo@tourguider.com`,
        name: `${provider} 데모 사용자`,
        nickname: `${provider} Demo`,
        picture: '',
        loginType: provider,
        isDemo: true
      };

      console.log('데모 로그인 시도:', provider, demoUserData);

      // onSuccess 콜백을 통해 상위 컴포넌트에서 처리하도록 함
      setTimeout(() => {
        console.log('데모 로그인 성공 콜백 실행');
        handleSocialSuccess(demoUserData);
      }, 1000);
    } catch (error) {
      console.error('데모 로그인 오류:', error);
      handleSocialError(error);
    }
  };

  return (
    <div className={`space-y-3 ${className || ''}`}>
      <Button
        onClick={() => handleDemoLogin('google')}
        disabled={isLoading && currentProvider === 'google'}
        className="w-full bg-white text-gray-900 hover:bg-gray-100 border border-gray-300"
      >
        {isLoading && currentProvider === 'google' ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <span className="text-lg">G</span>
        )}
        Google로 로그인
      </Button>
      
      <Button
        onClick={() => handleDemoLogin('kakao')}
        disabled={isLoading && currentProvider === 'kakao'}
        className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
      >
        {isLoading && currentProvider === 'kakao' ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <span className="text-lg">카</span>
        )}
        카카오로 로그인
      </Button>
      
      <Button
        onClick={() => handleDemoLogin('naver')}
        disabled={isLoading && currentProvider === 'naver'}
        className="w-full bg-green-500 text-white hover:bg-green-600"
      >
        {isLoading && currentProvider === 'naver' ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <span className="text-lg">N</span>
        )}
        네이버로 로그인
      </Button>

    </div>
  );
} 