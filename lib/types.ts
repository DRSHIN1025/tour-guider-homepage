// 사용자 관련 타입
export interface User {
  id: string;
  email: string;
  name?: string;
  nickname?: string;
  profileImage?: string;
  loginType?: 'google' | 'kakao' | 'naver' | 'email';
  referralCode?: string;
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// 견적 요청 관련 타입
export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: string;
  interests: string[];
  specialRequests: string;
  status: 'pending' | 'reviewing' | 'responded' | 'completed' | 'cancelled';
  response?: string;
  responseAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  attachedFiles?: AttachedFile[];
}

// 첨부 파일 타입
export interface AttachedFile {
  name: string;
  type: string;
  size: number;
  url?: string;
  path?: string;
}

// 레퍼럴 관련 타입
export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  referrerEmail: string;
  referredEmail: string;
  status: 'pending' | 'completed' | 'cancelled';
  rewardAmount: number;
  rewardType: 'cash' | 'credit' | 'discount';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// 소셜 로그인 응답 타입
export interface SocialLoginResponse {
  id: string;
  email: string;
  name: string;
  picture?: string;
  loginType: 'google' | 'kakao' | 'naver';
}

// 결제 관련 타입
export interface PaymentSession {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  customerEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 환경 변수 타입
export interface EnvironmentVariables {
  NEXT_PUBLIC_FIREBASE_API_KEY: string;
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
  NEXT_PUBLIC_FIREBASE_APP_ID: string;
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?: string;
  NEXT_PUBLIC_GOOGLE_CLIENT_ID?: string;
  NEXT_PUBLIC_KAKAO_APP_KEY?: string;
  NEXT_PUBLIC_NAVER_CLIENT_ID?: string;
  NEXT_PUBLIC_KAKAO_CHANNEL_ID?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_PUBLISHABLE_KEY?: string;
}
