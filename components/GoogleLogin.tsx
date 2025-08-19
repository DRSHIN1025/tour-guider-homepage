'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleLoginProps {
  onSuccess?: (user: any) => void;
  onError?: (error: any) => void;
}

export default function GoogleLogin({ onSuccess, onError }: GoogleLoginProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializeGoogle = () => {
      // 데모 모드 체크
      const isDemo = !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === 'demo-key';
      
      if (isDemo) {
        setIsInitialized(true);
        return;
      }

      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse
          });
          setIsInitialized(true);
          console.log('구글 SDK 초기화 완료');
        } catch (error) {
          console.error('구글 SDK 초기화 실패:', error);
          setIsInitialized(true);
        }
      }
    };

    const checkGoogle = setInterval(() => {
      if (window.google || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        initializeGoogle();
        clearInterval(checkGoogle);
      }
    }, 100);

    return () => clearInterval(checkGoogle);
  }, []);

  const handleGoogleResponse = (response: any) => {
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      console.log('구글 로그인 성공:', payload);
      
      // Firebase Auth를 사용한 실제 로그인
      const { signInWithGoogle } = useAuth();
      
      signInWithGoogle().then(() => {
        console.log('Firebase Google 로그인 성공');
        if (onSuccess) {
          onSuccess(payload);
        } else {
          router.push('/');
        }
      }).catch((error) => {
        console.error('Firebase Google 로그인 실패:', error);
        if (onError) {
          onError(error);
        }
      });
    } catch (error) {
      console.error('구글 로그인 처리 실패:', error);
      if (onError) {
        onError(error);
      }
    }
  };

  const handleGoogleLogin = () => {
    if (!isInitialized) {
      alert('구글 로그인을 초기화하는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // Firebase Auth를 사용한 Google 로그인
    const { signInWithGoogle } = useAuth();
    
    signInWithGoogle().then(() => {
      console.log('Firebase Google 로그인 성공');
      if (onSuccess) {
        onSuccess(null);
      } else {
        router.push('/');
      }
    }).catch((error) => {
      console.error('Firebase Google 로그인 실패:', error);
      if (onError) {
        onError(error);
      }
    });
  };

  return (
    <Button 
      onClick={handleGoogleLogin}
      className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3"
      disabled={!isInitialized}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path 
          d="M19.8055 8.0415H10.2222V12.1108H15.8389C15.4722 14.0693 13.7778 15.4998 10.2222 15.4998C6.25 15.4998 3.05556 12.3054 3.05556 8.33317C3.05556 4.36095 6.25 1.1665 10.2222 1.1665C12.0833 1.1665 13.75 1.83317 15 2.91651L17.9167 0C16.0556 -1.5835 13.6389 -2.5835 10.2222 -2.5835C4.58333 -2.5835 0 2.0835 0 7.6665C0 13.2498 4.58333 17.9165 10.2222 17.9165C15.6944 17.9165 20 14.1665 20 8.33317C20 7.74984 19.9167 7.1665 19.8055 6.58317V8.0415Z" 
          fill="#4285F4"
        />
        <path 
          d="M1.30556 5.9165L4.69444 8.49984C5.41667 6.58317 7.61111 5.24984 10.2222 5.24984C11.6944 5.24984 13.0278 5.7915 14.0278 6.6665L17.25 3.4165C15.4167 1.74984 13.0278 0.749837 10.2222 0.749837C6.41667 0.749837 3.19444 2.99984 1.30556 5.9165Z" 
          fill="#34A853"
        />
        <path 
          d="M10.2222 17.9165C13.0278 17.9165 15.4167 16.9165 17.25 15.2498L13.8611 12.2498C12.8611 12.9998 11.6111 13.4998 10.2222 13.4998C6.69444 13.4998 4.02778 12.1665 3.19444 10.2498L1.30556 12.9998C3.19444 15.9165 6.41667 17.9165 10.2222 17.9165Z" 
          fill="#FBBC05"
        />
        <path 
          d="M19.8055 8.0415C19.9167 7.1665 20 6.58317 20 5.9165C20 4.24984 19.5278 2.74984 18.6944 1.4165L15.0278 4.4165C15.6944 5.49984 16.1111 6.74984 16.1111 8.0415H19.8055Z" 
          fill="#EA4335"
        />
      </svg>
      {isInitialized ? '구글 로그인' : '로딩 중...'}
    </Button>
  );
} 