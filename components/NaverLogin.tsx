'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    naver: any;
  }
}

interface NaverLoginProps {
  onSuccess?: (user: any) => void;
  onError?: (error: any) => void;
}

export default function NaverLogin({ onSuccess, onError }: NaverLoginProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializeNaver = () => {
      // 데모 모드 체크
      const isDemo = !process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || process.env.NEXT_PUBLIC_NAVER_CLIENT_ID === 'demo-key';
      
      if (isDemo) {
        setIsInitialized(true);
        return;
      }

      if (window.naver) {
        try {
          const naverLogin = new window.naver.LoginWithNaverId({
            clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
            callbackUrl: window.location.origin + '/admin/login',
            isPopup: true,
            loginButton: { color: "green", type: 3, height: 60 }
          });
          
          naverLogin.init();
          setIsInitialized(true);
          console.log('네이버 SDK 초기화 완료');
        } catch (error) {
          console.error('네이버 SDK 초기화 실패:', error);
          setIsInitialized(true);
        }
      }
    };

    const checkNaver = setInterval(() => {
      if (window.naver || !process.env.NEXT_PUBLIC_NAVER_CLIENT_ID) {
        initializeNaver();
        clearInterval(checkNaver);
      }
    }, 100);

    return () => clearInterval(checkNaver);
  }, []);

  const handleNaverLogin = () => {
    if (!isInitialized) {
      alert('네이버 로그인을 초기화하는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // 데모 모드
    const isDemo = !process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || process.env.NEXT_PUBLIC_NAVER_CLIENT_ID === 'demo-key';

    if (isDemo) {
      const demoUser = {
        id: 'naver-demo-admin',
        nickname: '네이버 관리자',
        email: 'naver-admin@tourguider.com',
        profileImage: '',
        loginType: 'naver'
      };

      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminUser', JSON.stringify(demoUser));
      
      if (onSuccess) {
        onSuccess(demoUser);
      } else {
        router.push('/admin');
      }
      return;
    }

    // 실제 네이버 로그인
    if (window.naver) {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
        callbackUrl: window.location.origin + '/admin/login',
        isPopup: true
      });

      naverLogin.getLoginStatus((status: boolean) => {
        if (status) {
          const user = {
            id: naverLogin.user.id,
            nickname: naverLogin.user.nickname || '네이버 사용자',
            email: naverLogin.user.email || '',
            profileImage: naverLogin.user.profile_image || '',
            loginType: 'naver'
          };

          // 관리자 권한 확인
          const isAdmin = user.email === 'admin@tourguider.com' || 
                         user.nickname === '투어가이더관리자';

          if (isAdmin) {
            localStorage.setItem('adminAuth', 'true');
            localStorage.setItem('adminUser', JSON.stringify(user));
            
            if (onSuccess) {
              onSuccess(user);
            } else {
              router.push('/admin');
            }
          } else {
            alert('관리자 권한이 없습니다. 관리자 계정으로 로그인해주세요.');
          }
        } else {
          if (onError) {
            onError('네이버 로그인 실패');
          }
        }
      });

      naverLogin.login();
    }
  };

  return (
    <Button 
      onClick={handleNaverLogin}
      className="w-full bg-[#03C75A] hover:bg-[#02B351] text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3"
      disabled={!isInitialized}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path 
          d="M13.6 0H6.4C2.9 0 0 2.9 0 6.4v7.2C0 17.1 2.9 20 6.4 20h7.2c3.5 0 6.4-2.9 6.4-6.4V6.4C20 2.9 17.1 0 13.6 0zM12.5 10.8L7.5 18H4.2l5-7.2L4.2 2h3.3l5 7.2z" 
          fill="white"
        />
      </svg>
      {isInitialized ? '네이버 로그인' : '로딩 중...'}
    </Button>
  );
} 