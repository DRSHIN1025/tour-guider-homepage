import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Analytics 임시 비활성화
};

// 환경 변수 디버깅
console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? '설정됨' : '설정되지 않음',
  authDomain: firebaseConfig.authDomain ? '설정됨' : '설정되지 않음',
  projectId: firebaseConfig.projectId ? '설정됨' : '설정되지 않음',
  storageBucket: firebaseConfig.storageBucket ? '설정됨' : '설정되지 않음',
  messagingSenderId: firebaseConfig.messagingSenderId ? '설정됨' : '설정되지 않음',
  appId: firebaseConfig.appId ? '설정됨' : '설정되지 않음',
});

// Firebase 앱 초기화 (클라이언트 사이드에서만)
let app: any = null;
let authInstance: any = null;
let dbInstance: any = null;
let storageInstance: any = null;

export const getAuthInstance = () => {
  if (typeof window === 'undefined') {
    console.log('서버 사이드에서 Firebase Auth 초기화 시도 무시');
    return null;
  }
  
  try {
    if (!app) {
      if (!getApps().length) {
        console.log('Firebase 앱 초기화 중...');
        app = initializeApp(firebaseConfig);
        console.log('Firebase 앱 초기화 완료');
      } else {
        app = getApps()[0];
        console.log('기존 Firebase 앱 사용');
      }
    }
    
    if (!authInstance) {
      console.log('Firebase Auth 초기화 중...');
      authInstance = getAuth(app);
      console.log('Firebase Auth 초기화 완료');
    }
    return authInstance;
  } catch (error) {
    console.error('Firebase Auth 초기화 실패:', error);
    return null;
  }
};

export const getFirestoreInstance = () => {
  if (typeof window === 'undefined') {
    console.log('서버 사이드에서 Firestore 초기화 시도 무시');
    return null;
  }
  
  try {
    if (!app) {
      if (!getApps().length) {
        console.log('Firebase 앱 초기화 중...');
        app = initializeApp(firebaseConfig);
        console.log('Firebase 앱 초기화 완료');
      } else {
        app = getApps()[0];
        console.log('기존 Firebase 앱 사용');
      }
    }
    
    if (!dbInstance) {
      console.log('Firestore 초기화 중...');
      dbInstance = getFirestore(app);
      console.log('Firestore 초기화 완료');
    }
    return dbInstance;
  } catch (error) {
    console.error('Firestore 초기화 실패:', error);
    return null;
  }
};

export const getStorageInstance = () => {
  if (typeof window === 'undefined') {
    console.log('서버 사이드에서 Firebase Storage 초기화 시도 무시');
    return null;
  }
  
  try {
    if (!app) {
      if (!getApps().length) {
        console.log('Firebase 앱 초기화 중...');
        app = initializeApp(firebaseConfig);
        console.log('Firebase 앱 초기화 완료');
      } else {
        app = getApps()[0];
        console.log('기존 Firebase 앱 사용');
      }
    }
    
    if (!storageInstance) {
      console.log('Firebase Storage 초기화 중...');
      storageInstance = getStorage(app);
      console.log('Firebase Storage 초기화 완료');
    }
    return storageInstance;
  } catch (error) {
    console.error('Firebase Storage 초기화 실패:', error);
    return null;
  }
};

// 기존 export 유지 (하위 호환성)
export const auth = getAuthInstance();
export const db = getFirestoreInstance();
export const storage = getStorageInstance();

export default app;