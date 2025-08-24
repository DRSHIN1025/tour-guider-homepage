import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase 환경변수 확인
const hasFirebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                         process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
                         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:demo',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-DEMO',
};

// Firebase 앱 초기화
let app;
if (!getApps().length) {
  if (hasFirebaseConfig) {
    app = initializeApp(firebaseConfig);
  } else {
    // 환경변수가 없을 때 더미 앱 생성
    app = initializeApp({
      apiKey: 'demo-key',
      authDomain: 'demo-project.firebaseapp.com',
      projectId: 'demo-project',
      storageBucket: 'demo-project.appspot.com',
      messagingSenderId: '123456789',
      appId: '1:123456789:web:demo',
    });
  }
} else {
  app = getApps()[0];
}

// Firestore 초기화 (안전하게)
export const db = hasFirebaseConfig ? getFirestore(app) : null;

// Storage 초기화 (안전하게)
export const storage = hasFirebaseConfig ? getStorage(app) : null;

// Auth 초기화 (안전하게)
export const auth = hasFirebaseConfig ? getAuth(app) : null;

// Analytics 초기화 (브라우저에서만)
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      try {
        getAnalytics(app);
      } catch (error) {
        // Analytics 초기화 실패는 정상적인 상황일 수 있음
      }
    }
  });
}

// 개발 환경에서 에뮬레이터 연결
if (process.env.NODE_ENV === 'development') {
  try {
    // Firestore 에뮬레이터
    if (process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST && db) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    
    // Storage 에뮬레이터
    if (process.env.NEXT_PUBLIC_STORAGE_EMULATOR_HOST && storage) {
      connectStorageEmulator(storage, 'localhost', 9199);
    }
    
    // Auth 에뮬레이터
    if (process.env.NEXT_PUBLIC_AUTH_EMULATOR_HOST && auth) {
      connectAuthEmulator(auth, 'http://localhost:9099');
    }
  } catch (error) {
    // 에뮬레이터가 이미 연결된 경우 무시
  }
}

export default app;