'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Kakao: any;
  }
}

interface KakaoLoginProps {
  onSuccess?: (user: any) => void;
  onError?: (error: any) => void;
}

export default function KakaoLogin({ onSuccess, onError }: KakaoLoginProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializeKakao = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        // 환경변수에서 카카오 앱 키 가져오기
        const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY || 'demo-key';
        
        try {
          window.Kakao.init(kakaoAppKey);
          setIsInitialized(true);
          console.log('카카오 SDK 초기화 완료');
        } catch (error) {
          console.error('카카오 SDK 초기화 실패:', error);
          // 데모 모드로 동작
          setIsInitialized(true);
        }
      } else if (window.Kakao?.isInitialized()) {
        setIsInitialized(true);
      }
    };

    // 스크립트가 로드될 때까지 대기
    const checkKakao = setInterval(() => {
      if (window.Kakao) {
        initializeKakao();
        clearInterval(checkKakao);
      }
    }, 100);

    return () => clearInterval(checkKakao);
  }, []);

  const handleKakaoLogin = () => {
    if (!isInitialized) {
      alert('카카오 로그인을 초기화하는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // 데모 모드 체크 (실제 카카오 앱 키가 없는 경우)
    const isDemo = !process.env.NEXT_PUBLIC_KAKAO_APP_KEY || process.env.NEXT_PUBLIC_KAKAO_APP_KEY === 'demo-key';

    if (isDemo) {
      // 데모 모드: 가상의 사용자 정보로 로그인
      const demoUser = {
        id: 'demo-admin',
        nickname: '투어가이더 관리자',
        email: 'admin@tourguider.com',
        profileImage: '',
        loginType: 'kakao'
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

    // 실제 카카오 로그인
    if (!window.Kakao) {
      alert('카카오 로그인 서비스를 불러올 수 없습니다.');
      return;
    }

    window.Kakao.Auth.login({
      success: function(authObj: any) {
        console.log('카카오 로그인 성공:', authObj);
        
        // 사용자 정보 가져오기
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: function(res: any) {
            console.log('사용자 정보:', res);
            
            const user = {
              id: res.id,
              nickname: res.properties?.nickname || '사용자',
              email: res.kakao_account?.email || '',
              profileImage: res.properties?.profile_image || '',
              loginType: 'kakao'
            };

            // 관리자 권한 확인 (실제로는 서버에서 확인해야 함)
            // 여기서는 간단히 특정 조건으로 관리자 판별
            const isAdmin = res.kakao_account?.email === 'admin@tourguider.com' || 
                           res.properties?.nickname === '투어가이더관리자';

            if (isAdmin) {
              // 관리자 인증 정보 저장
              localStorage.setItem('adminAuth', 'true');
              localStorage.setItem('adminUser', JSON.stringify(user));
              
              if (onSuccess) {
                onSuccess(user);
              } else {
                router.push('/admin');
              }
            } else {
              alert('관리자 권한이 없습니다. 관리자 계정으로 로그인해주세요.');
              window.Kakao.Auth.logout();
            }
          },
          fail: function(error: any) {
            console.error('사용자 정보 가져오기 실패:', error);
            if (onError) {
              onError(error);
            }
          }
        });
      },
      fail: function(err: any) {
        console.error('카카오 로그인 실패:', err);
        if (onError) {
          onError(err);
        }
      }
    });
  };

  return (
    <Button 
      onClick={handleKakaoLogin}
      className="w-full bg-[#FEE500] hover:bg-[#FFEB00] text-black font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3"
      disabled={!isInitialized}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path 
          d="M10 0C4.477 0 0 3.58 0 8c0 2.797 1.8 5.262 4.5 6.722L3.5 18.5l4.764-2.382C8.83 16.04 9.402 16 10 16c5.523 0 10-3.58 10-8S15.523 0 10 0z" 
          fill="#3C1E1E"
        />
      </svg>
      {isInitialized ? '카카오 로그인' : '로딩 중...'}
    </Button>
  );
} 