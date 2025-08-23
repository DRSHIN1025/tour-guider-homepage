import { useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase Auth가 설정되어 있을 때만 실행
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Firebase가 없을 때는 로컬 Auth 사용
      const localUser = localStorage.getItem('tempUser');
      if (localUser) {
        setUser(JSON.parse(localUser));
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      return { success: false, error: 'Firebase가 설정되지 않았습니다. 데모 로그인을 사용해주세요.' };
    }
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!auth) {
      return { success: false, error: 'Firebase가 설정되지 않았습니다. 데모 회원가입을 사용해주세요.' };
    }
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    if (!auth) {
      // Firebase가 없을 때 임시 구글 로그인
      const tempUser = {
        uid: `temp_google_${Date.now()}`,
        email: 'demo-google@tourguider.com',
        displayName: 'Google 데모 사용자',
        photoURL: '',
        emailVerified: true
      };
      
      localStorage.setItem('tempUser', JSON.stringify(tempUser));
      setUser(tempUser as any);
      
      return { success: true, user: tempUser };
    }
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      } else {
        // 로컬 로그아웃
        localStorage.removeItem('tempUser');
        setUser(null);
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout
  };
} 