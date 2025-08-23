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

    // onSuccess 콜백을 통해 상위 컴포넌트에서 처리하도록 함
    setTimeout(() => {
      handleSocialSuccess(demoUserData);
    }, 1000);
  };

  return (
    <div className={`space-y-3 ${className || ''}`}>
      <GoogleLogin
        onSuccess={handleSocialSuccess}
        onError={handleSocialError}
        className="w-full"
      />
      
      <KakaoLogin
        onSuccess={handleSocialSuccess}
        onError={handleSocialError}
        className="w-full"
      />
      
      <NaverLogin
        onSuccess={handleSocialSuccess}
        onError={handleSocialError}
        className="w-full"
      />

      {/* 데모 로그인 버튼들 (개발 환경에서만 표시) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3 text-center">개발용 데모 로그인</p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={() => handleDemoLogin('google')}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading && currentProvider === 'google' ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                'Google 데모'
              )}
            </Button>
            <Button
              onClick={() => handleDemoLogin('kakao')}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading && currentProvider === 'kakao' ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                'Kakao 데모'
              )}
            </Button>
            <Button
              onClick={() => handleDemoLogin('naver')}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading && currentProvider === 'naver' ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                'Naver 데모'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 