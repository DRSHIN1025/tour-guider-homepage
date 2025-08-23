'use client';

import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  nickname?: string;
  profileImage?: string;
  loginType?: string;
  referralCode?: string;
  isAdmin?: boolean;
  phone?: string;
  createdAt?: Date;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

// localStorage 안전하게 사용하는 헬퍼 함수
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
};

export function useLocalAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  // 로그인 상태 확인
  const checkAuth = useCallback(() => {
    try {
      const userAuth = safeLocalStorage.getItem('userAuth');
      const userData = safeLocalStorage.getItem('userData');
      const adminAuth = safeLocalStorage.getItem('adminAuth');
      const adminUser = safeLocalStorage.getItem('adminUser');

      if (adminAuth === 'true' && adminUser) {
        const parsedUser = JSON.parse(adminUser);
        setAuthState({
          isAuthenticated: true,
          user: { ...parsedUser, isAdmin: true },
          isLoading: false,
        });
      } else if (userAuth === 'true' && userData) {
        const parsedUser = JSON.parse(userData);
        setAuthState({
          isAuthenticated: true,
          user: parsedUser,
          isLoading: false,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  }, []);

  // 로그인
  const login = useCallback((userData: User) => {
    try {
      safeLocalStorage.setItem('userAuth', 'true');
      safeLocalStorage.setItem('userData', JSON.stringify(userData));
      
      setAuthState({
        isAuthenticated: true,
        user: userData,
        isLoading: false,
      });
    } catch (error) {
      console.error('로그인 저장 실패:', error);
    }
  }, []);

  // 로그아웃
  const logout = useCallback(() => {
    try {
      safeLocalStorage.removeItem('userAuth');
      safeLocalStorage.removeItem('userData');
      safeLocalStorage.removeItem('adminAuth');
      safeLocalStorage.removeItem('adminUser');
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('로그아웃 처리 실패:', error);
    }
  }, []);

  // 관리자 로그인
  const adminLogin = useCallback((adminData: User) => {
    try {
      safeLocalStorage.setItem('adminAuth', 'true');
      safeLocalStorage.setItem('adminUser', JSON.stringify(adminData));
      
      setAuthState({
        isAuthenticated: true,
        user: { ...adminData, isAdmin: true },
        isLoading: false,
      });
    } catch (error) {
      console.error('관리자 로그인 저장 실패:', error);
    }
  }, []);

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Storage 변경 감지
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkAuth]);

  // 페이지 포커스 시 상태 재확인
  useEffect(() => {
    const handleFocus = () => {
      checkAuth();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuth();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkAuth]);

  return {
    ...authState,
    login,
    logout,
    adminLogin,
    checkAuth,
  };
}