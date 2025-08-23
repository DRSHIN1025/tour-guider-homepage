'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    naver: any;
  }
}

interface NaverLoginProps {
  onSuccess?: (user: any) => void;
  onError?: (error: any) => void;
  className?: string;
  children?: React.ReactNode;
}

export function NaverLogin({ onSuccess, onError, className, children }: NaverLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isNaverLoaded, setIsNaverLoaded] = useState(false);

  useEffect(() => {
    // Naver SDK가 이미 로드되어 있는지 확인
    if (window.naver && window.naver.Login) {
      setIsNaverLoaded(true);
      return;
    }

    // Naver SDK 로드
    const script = document.createElement('script');
    script.src = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsNaverLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleNaverLogin = () => {
    if (!isNaverLoaded) {
      if (onError) {
        onError(new Error('네이버 로그인을 초기화하는 중입니다. 잠시 후 다시 시도해주세요.'));
      }
      return;
    }

    setIsLoading(true);

    try {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
        callbackUrl: `${window.location.origin}/auth/naver/callback`,
        isPopup: false,
        loginButton: { color: 'green', type: 3, height: 60 }
      });

      naverLogin.init();
      naverLogin.authorize();
    } catch (error) {
      setIsLoading(false);
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <Button
      onClick={handleNaverLogin}
      disabled={isLoading || !isNaverLoaded}
      className={className}
      variant="outline"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z"/>
        </svg>
      )}
      {children || '네이버로 로그인'}
    </Button>
  );
} 