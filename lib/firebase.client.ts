// 클라이언트 사이드 Firebase 초기화
// 환경 변수가 없어도 앱이 크래시되지 않도록 안전하게 처리

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'dummy',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'dummy',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dummy',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'dummy',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'dummy',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'dummy',
};

// 환경 변수가 더미인 경우 Firebase 초기화를 건너뜀
if (firebaseConfig.apiKey !== 'dummy') {
  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    console.log('Firebase 클라이언트 초기화 완료');
  } catch (error) {
    console.warn('Firebase 클라이언트 초기화 실패:', error);
  }
} else {
  console.log('Firebase 환경 변수가 설정되지 않음 - 더미 모드로 동작');
}


