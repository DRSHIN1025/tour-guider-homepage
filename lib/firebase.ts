import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Firebase 앱 초기화
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Firestore 초기화
export const db = getFirestore(app);

// Storage 초기화
export const storage = getStorage(app);

// Auth 초기화
export const auth = getAuth(app);

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
    if (process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    
    // Storage 에뮬레이터
    if (process.env.NEXT_PUBLIC_STORAGE_EMULATOR_HOST) {
      connectStorageEmulator(storage, 'localhost', 9199);
    }
    
    // Auth 에뮬레이터
    if (process.env.NEXT_PUBLIC_AUTH_EMULATOR_HOST) {
      connectAuthEmulator(auth, 'http://localhost:9099');
    }
  } catch (error) {
    // 에뮬레이터가 이미 연결된 경우 무시
  }
}

export default app;