import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// 환경변수 로딩 상태 디버깅
console.log('🔥 Firebase 환경변수 확인:');
console.log('API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ 로드됨' : '❌ 없음');
console.log('AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ 로드됨' : '❌ 없음');
console.log('PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ 로드됨' : '❌ 없음');

// Firebase 설정 - 환경변수 우선, fallback 사용
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCJfso0a1JKqny2Qgn9sXJgxaL0Gz57wno",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "tour-guider-homepage.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tour-guider-homepage",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "tour-guider-homepage.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "879427263594",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:879427263594:web:d43e9b06e0536e8a687e13",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-PT0Z1K0EWK"
};

console.log('🔥 Firebase 설정 확인:', firebaseConfig);

// Firebase 앱 초기화
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('🔥 Firebase 앱 초기화 성공!');
} catch (error) {
  console.error('🔥 Firebase 앱 초기화 실패:', error);
  throw error;
}

// Firebase 서비스 내보내기
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

console.log('🔥 Firebase 서비스 초기화 완료:', {
  auth: auth ? '✅' : '❌',
  db: db ? '✅' : '❌',
  storage: storage ? '✅' : '❌'
});

// Analytics (클라이언트 사이드에서만 초기화)
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
    console.log('🔥 Firebase Analytics 초기화 성공!');
  } catch (error) {
    console.log('🔥 Firebase Analytics 초기화 실패 (정상):', error instanceof Error ? error.message : error);
  }
}
export { analytics };

export default app; 