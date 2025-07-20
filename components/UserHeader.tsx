'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface User {
  id: string;
  nickname: string;
  email: string;
  profileImage?: string;
  loginType: string;
}

export function UserHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUserAuth = () => {
      if (typeof window !== 'undefined') {
        const userAuth = localStorage.getItem('userAuth');
        const userData = localStorage.getItem('user');
        
        if (userAuth && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setIsLoggedIn(true);
          } catch (e) {
            console.error('사용자 정보 파싱 오류:', e);
          }
        }
      }
    };

    checkUserAuth();
    
    // 로그인 상태 변경 감지를 위한 이벤트 리스너
    const handleStorageChange = () => {
      checkUserAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userAuth');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
  };

  if (isLoggedIn && user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-sm">
          {user.profileImage && (
            <img 
              src={user.profileImage} 
              alt="프로필" 
              className="w-8 h-8 rounded-full"
            />
          )}
          <div className="text-right">
            <p className="font-medium text-gray-700">{user.nickname}님</p>
            <p className="text-xs text-gray-500">
              {user.loginType === 'email' ? '이메일' :
               user.loginType === 'kakao' ? '카카오' :
               user.loginType === 'naver' ? '네이버' :
               user.loginType === 'google' ? '구글' : '소셜'} 로그인
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          로그아웃
        </Button>
      </div>
    );
  }

  return (
    <Button
      asChild
      variant="outline"
      className="border-natural-green text-natural-green hover:bg-natural-green hover:text-white bg-transparent"
    >
      <Link href="/login">로그인</Link>
    </Button>
  );
} 