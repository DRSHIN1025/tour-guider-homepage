import { useState, useEffect } from 'react'
import { getAuthInstance } from '@/lib/firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  updateProfile
} from 'firebase/auth'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuthInstance()
    if (!auth) {
      // 클라이언트에서 Auth 초기화에 실패한 경우 안전하게 종료
      setLoading(false)
      return () => {}
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    const auth = getAuthInstance()
    if (!auth) return { success: false, error: 'Auth not initialized' }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: result.user }
    } catch (error: any) {
      console.error('로그인 오류:', error)
      return { success: false, error: error.message }
    }
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    const auth = getAuthInstance()
    if (!auth) return { success: false, error: 'Auth not initialized' }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // displayName이 제공된 경우 업데이트
      if (displayName && result.user) {
        await updateProfile(result.user, {
          displayName: displayName
        })
      }
      
      return { success: true, user: result.user }
    } catch (error: any) {
      console.error('회원가입 오류:', error)
      return { success: false, error: error.message }
    }
  }

  const signInWithGoogle = async () => {
    const auth = getAuthInstance()
    if (!auth) return { success: false, error: 'Auth not initialized' }
    const provider = new GoogleAuthProvider()
    
    try {
      const result = await signInWithPopup(auth, provider)
      return { success: true, user: result.user }
    } catch (error: any) {
      console.error('구글 로그인 오류:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    const auth = getAuthInstance()
    if (!auth) return { success: false, error: 'Auth not initialized' }
    try {
      await signOut(auth)
      return { success: true }
    } catch (error: any) {
      console.error('로그아웃 오류:', error)
      return { success: false, error: error.message }
    }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout
  }
} 