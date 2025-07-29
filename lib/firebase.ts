import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyCJfso0a1JKqny2Qgn9sXJgxaL0Gz57wno",
  authDomain: "tour-guider-homepage.firebaseapp.com",
  projectId: "tour-guider-homepage",
  storageBucket: "tour-guider-homepage.firebasestorage.app",
  messagingSenderId: "879427263594",
  appId: "1:879427263594:web:d43e9b06e0536e8a687e13",
  measurementId: "G-PT0Z1K0EWK"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firebase 서비스 내보내기
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics (클라이언트 사이드에서만 초기화)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

export default app; 