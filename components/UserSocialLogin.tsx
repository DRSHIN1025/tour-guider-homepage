'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Kakao: any;
    naver: any;
    google: any;
  }
}

interface UserSocialLoginProps {
  provider: 'kakao' | 'naver' | 'google';
  onSuccess?: (user: any) => void;
  onError?: (error: any) => void;
}

export default function UserSocialLogin({ provider, onSuccess, onError }: UserSocialLoginProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initialize = () => {
      // 항상 데모 모드로 작동 (사용자용)
      setIsInitialized(true);
    };

    initialize();
  }, []);

  const handleLogin = () => {
    if (!isInitialized) {
      alert('로그인을 초기화하는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // 데모 사용자 데이터 생성
    const demoUsers = {
      kakao: {
        id: 'kakao-user-' + Date.now(),
        nickname: '카카오 사용자',
        email: 'kakao-user@example.com',
        profileImage: '',
        loginType: 'kakao'
      },
      naver: {
        id: 'naver-user-' + Date.now(),
        nickname: '네이버 사용자',
        email: 'naver-user@example.com',
        profileImage: '',
        loginType: 'naver'
      },
      google: {
        id: 'google-user-' + Date.now(),
        nickname: '구글 사용자',
        email: 'google-user@example.com',
        profileImage: '',
        loginType: 'google'
      }
    };

    const userData = demoUsers[provider];

    localStorage.setItem('userAuth', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    
    if (onSuccess) {
      onSuccess(userData);
    } else {
      router.push('/');
    }
  };

  const getButtonConfig = () => {
    switch (provider) {
      case 'kakao':
        return {
          className: "w-full bg-[#FEE500] hover:bg-[#FFEB00] text-black font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3",
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.477 0 0 3.58 0 8c0 2.797 1.8 5.262 4.5 6.722L3.5 18.5l4.764-2.382C8.83 16.04 9.402 16 10 16c5.523 0 10-3.58 10-8S15.523 0 10 0z" fill="#3C1E1E"/>
            </svg>
          ),
          text: '카카오 로그인'
        };
      case 'naver':
        return {
          className: "w-full bg-[#03C75A] hover:bg-[#02B351] text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3",
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13.6 0H6.4C2.9 0 0 2.9 0 6.4v7.2C0 17.1 2.9 20 6.4 20h7.2c3.5 0 6.4-2.9 6.4-6.4V6.4C20 2.9 17.1 0 13.6 0zM12.5 10.8L7.5 18H4.2l5-7.2L4.2 2h3.3l5 7.2z" fill="white"/>
            </svg>
          ),
          text: '네이버 로그인'
        };
      case 'google':
        return {
          className: "w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3",
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M19.8055 8.0415H10.2222V12.1108H15.8389C15.4722 14.0693 13.7778 15.4998 10.2222 15.4998C6.25 15.4998 3.05556 12.3054 3.05556 8.33317C3.05556 4.36095 6.25 1.1665 10.2222 1.1665C12.0833 1.1665 13.75 1.83317 15 2.91651L17.9167 0C16.0556 -1.5835 13.6389 -2.5835 10.2222 -2.5835C4.58333 -2.5835 0 2.0835 0 7.6665C0 13.2498 4.58333 17.9165 10.2222 17.9165C15.6944 17.9165 20 14.1665 20 8.33317C20 7.74984 19.9167 7.1665 19.8055 6.58317V8.0415Z" fill="#4285F4"/>
              <path d="M1.30556 5.9165L4.69444 8.49984C5.41667 6.58317 7.61111 5.24984 10.2222 5.24984C11.6944 5.24984 13.0278 5.7915 14.0278 6.6665L17.25 3.4165C15.4167 1.74984 13.0278 0.749837 10.2222 0.749837C6.41667 0.749837 3.19444 2.99984 1.30556 5.9165Z" fill="#34A853"/>
              <path d="M10.2222 17.9165C13.0278 17.9165 15.4167 16.9165 17.25 15.2498L13.8611 12.2498C12.8611 12.9998 11.6111 13.4998 10.2222 13.4998C6.69444 13.4998 4.02778 12.1665 3.19444 10.2498L1.30556 12.9998C3.19444 15.9165 6.41667 17.9165 10.2222 17.9165Z" fill="#FBBC05"/>
              <path d="M19.8055 8.0415C19.9167 7.1665 20 6.58317 20 5.9165C20 4.24984 19.5278 2.74984 18.6944 1.4165L15.0278 4.4165C15.6944 5.49984 16.1111 6.74984 16.1111 8.0415H19.8055Z" fill="#EA4335"/>
            </svg>
          ),
          text: '구글 로그인'
        };
    }
  };

  const config = getButtonConfig();

  return (
    <Button 
      onClick={handleLogin}
      className={config.className}
      disabled={!isInitialized}
    >
      {config.icon}
      {isInitialized ? config.text : '로딩 중...'}
    </Button>
  );
} 