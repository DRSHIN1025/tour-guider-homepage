'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    Kakao: any;
  }
}

interface KakaoLoginProps {
  onSuccess?: (user: any) => void;
  onError?: (error: any) => void;
  className?: string;
  children?: React.ReactNode;
}

export function KakaoLogin({ onSuccess, onError, className, children }: KakaoLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  useEffect(() => {
    // Kakao SDK가 이미 로드되어 있는지 확인
    if (window.Kakao && window.Kakao.isInitialized()) {
      setIsKakaoLoaded(true);
      return;
    }

    // Kakao SDK 로드
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.Kakao) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY);
        setIsKakaoLoaded(true);
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleKakaoLogin = () => {
    if (!isKakaoLoaded) {
      if (onError) {
        onError(new Error('카카오 로그인을 초기화하는 중입니다. 잠시 후 다시 시도해주세요.'));
      }
      return;
    }

    setIsLoading(true);

    try {
      window.Kakao.Auth.login({
        success: function(authObj: any) {
          window.Kakao.API.request({
            url: '/v2/user/me',
            success: function(res: any) {
              const userData = {
                id: res.id.toString(),
                email: res.kakao_account?.email || '',
                name: res.properties?.nickname || '카카오 사용자',
                picture: res.properties?.profile_image || '',
                loginType: 'kakao'
              };

              if (onSuccess) {
                onSuccess(userData);
              }
              setIsLoading(false);
            },
            fail: function(error: any) {
              setIsLoading(false);
              if (onError) {
                onError(error);
              }
            }
          });
        },
        fail: function(err: any) {
          setIsLoading(false);
          if (onError) {
            onError(err);
          }
        }
      });
    } catch (error) {
      setIsLoading(false);
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <Button
      onClick={handleKakaoLogin}
      disabled={isLoading || !isKakaoLoaded}
      className={className}
      variant="outline"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3c5.799 0 10.5 4.701 10.5 10.5S17.799 24 12 24S1.5 19.299 1.5 13.5S6.201 3 12 3m0 1.5c-4.971 0-9 4.029-9 9s4.029 9 9 9s9-4.029 9-9s-4.029-9-9-9z"/>
          <path d="M12 6.75c-2.071 0-3.75 1.679-3.75 3.75S9.929 14.25 12 14.25s3.75-1.679 3.75-3.75S14.071 6.75 12 6.75z"/>
        </svg>
      )}
      {children || '카카오로 로그인'}
    </Button>
  );
} 