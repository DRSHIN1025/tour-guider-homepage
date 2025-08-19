'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { signInWithKakao, signInWithNaver } from '@/lib/socialAuth'

interface UserSocialLoginProps {
  mode?: 'login' | 'signup'
}

export default function UserSocialLogin({ mode = 'login' }: UserSocialLoginProps) {
  const { signInWithGoogle } = useAuth()
  const router = useRouter()
  const [googleLoading, setGoogleLoading] = useState(false)
  const [kakaoLoading, setKakaoLoading] = useState(false)
  const [naverLoading, setNaverLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    try {
      console.log('UserSocialLogin에서 Google 로그인 시작');
      await signInWithGoogle()
      console.log('UserSocialLogin에서 Google 로그인 성공');
      toast.success('Google 로그인이 완료되었습니다!')
      
      // 로그인 성공 후 메인 페이지로 이동
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } catch (error: any) {
      console.error('UserSocialLogin에서 Google 로그인 오류:', error)
      toast.error(error.message || 'Google 로그인에 실패했습니다.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleKakaoLogin = async () => {
    setKakaoLoading(true)
    try {
      console.log('카카오 로그인 시작...')
      const result = await signInWithKakao()
      console.log('카카오 로그인 결과:', result)
      
      toast.success(`${result.message}`)
      
      // 로그인 성공 후 메인 페이지로 이동
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (error: any) {
      console.error('카카오 로그인 오류:', error)
      toast.error(error.message || '카카오 로그인에 실패했습니다.')
    } finally {
      setKakaoLoading(false)
    }
  }

  const handleNaverLogin = async () => {
    setNaverLoading(true)
    try {
      console.log('네이버 로그인 시작...')
      const result = await signInWithNaver()
      console.log('네이버 로그인 결과:', result)
      
      toast.success(`${result.message}`)
      
      // 로그인 성공 후 메인 페이지로 이동
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (error: any) {
      console.error('네이버 로그인 오류:', error)
      toast.error(error.message || '네이버 로그인에 실패했습니다.')
    } finally {
      setNaverLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            또는
          </span>
        </div>
      </div>

      {/* Google 로그인 */}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        Google로 {mode === 'login' ? '로그인' : '회원가입'}
      </Button>

      {/* 카카오 로그인 */}
      <Button
        variant="outline"
        className="w-full border-yellow-300 text-yellow-600 hover:bg-yellow-50"
        onClick={handleKakaoLogin}
        disabled={kakaoLoading}
      >
        {kakaoLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="#FEE500">
            <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
          </svg>
        )}
        카카오로 {mode === 'login' ? '로그인' : '회원가입'}
      </Button>

      {/* 네이버 로그인 */}
      <Button
        variant="outline"
        className="w-full border-green-500 text-green-600 hover:bg-green-50"
        onClick={handleNaverLogin}
        disabled={naverLoading}
      >
        {naverLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="#03C75A">
            <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z"/>
          </svg>
        )}
        네이버로 {mode === 'login' ? '로그인' : '회원가입'}
      </Button>

      {/* 개발 모드 안내 */}
      <div className="text-xs text-muted-foreground text-center mt-4 p-2 bg-muted rounded">
        <p>💡 개발 모드: 카카오/네이버 로그인이 시뮬레이션으로 작동합니다</p>
        <p>실제 소셜 로그인을 위해서는 각 플랫폼의 API 키 설정이 필요합니다.</p>
        <p>현재는 데모용으로 더미 로그인이 실행됩니다.</p>
      </div>
    </div>
  )
} 