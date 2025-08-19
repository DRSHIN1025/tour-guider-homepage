import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { 
  getReferralCodeByCode, 
  useReferralCode as useReferralCodeAPI,
  getUserReferralStats,
  createReferralCode,
  ReferralCode
} from '@/lib/referral'
import { toast } from 'sonner'

export const useReferralCode = () => {
  const { user } = useAuth()
  const [userReferralCode, setUserReferralCode] = useState<ReferralCode | null>(null)
  const [userStats, setUserStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [hasCheckedUrl, setHasCheckedUrl] = useState(false)

  // 사용자의 레퍼럴 코드 생성 또는 조회
  const generateUserReferralCode = useCallback(async () => {
    if (!user) {
      throw new Error('로그인이 필요합니다.')
    }

    setLoading(true)
    try {
      const code = await createReferralCode(
        user.uid,
        user.displayName || user.email || '사용자',
        user.email || ''
      )
      setUserReferralCode(code)
      return code
    } catch (error: any) {
      console.error('레퍼럴 코드 생성 오류:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [user])

  // 레퍼럴 코드 유효성 검사
  const validateReferralCode = useCallback(async (code: string) => {
    if (!code.trim()) {
      throw new Error('레퍼럴 코드를 입력해주세요.')
    }

    try {
      const referralCode = await getReferralCodeByCode(code.trim())
      if (!referralCode) {
        throw new Error('유효하지 않은 레퍼럴 코드입니다.')
      }

      // 자기 자신의 코드인지 확인
      if (user && referralCode.userId === user.uid) {
        throw new Error('자기 자신의 레퍼럴 코드는 사용할 수 없습니다.')
      }

      return {
        isValid: true,
        referrerName: referralCode.userName,
        code: referralCode.code
      }
    } catch (error: any) {
      throw error
    }
  }, [user])

  // 레퍼럴 코드 적용
  const applyReferralCode = useCallback(async (code: string) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.')
    }

    try {
      await useReferralCodeAPI(
        code,
        user.uid,
        user.displayName || user.email || '사용자',
        user.email || ''
      )
      
      // 사용자 통계 업데이트
      await loadUserStats()
      
      return true
    } catch (error: any) {
      console.error('레퍼럴 코드 적용 오류:', error)
      throw error
    }
  }, [user])

  // 사용자 레퍼럴 통계 로드
  const loadUserStats = useCallback(async () => {
    if (!user) return

    try {
      const stats = await getUserReferralStats(user.uid)
      setUserStats(stats)
      setUserReferralCode(stats.referralCode)
    } catch (error) {
      console.error('사용자 통계 로드 오류:', error)
    }
  }, [user])

  // 레퍼럴 코드 복사
  const copyReferralCode = useCallback(async () => {
    if (!userReferralCode) {
      await generateUserReferralCode()
    }

    if (userReferralCode) {
      try {
        await navigator.clipboard.writeText(userReferralCode.code)
        toast.success('레퍼럴 코드가 복사되었습니다!')
        return userReferralCode.code
      } catch (error) {
        console.error('클립보드 복사 오류:', error)
        toast.error('코드 복사에 실패했습니다.')
      }
    }
  }, [userReferralCode, generateUserReferralCode])

  // 레퍼럴 링크 생성
  const generateReferralLink = useCallback(() => {
    if (!userReferralCode) return null
    
    const baseUrl = window.location.origin
    return `${baseUrl}/signup?ref=${userReferralCode.code}`
  }, [userReferralCode])

  // 레퍼럴 링크 복사
  const copyReferralLink = useCallback(async () => {
    const link = generateReferralLink()
    if (link) {
      try {
        await navigator.clipboard.writeText(link)
        toast.success('레퍼럴 링크가 복사되었습니다!')
        return link
      } catch (error) {
        console.error('링크 복사 오류:', error)
        toast.error('링크 복사에 실패했습니다.')
      }
    }
  }, [generateReferralLink])

  // URL에서 레퍼럴 코드 확인 (한 번만 실행)
  const checkUrlReferralCode = useCallback(() => {
    if (typeof window === 'undefined' || hasCheckedUrl) return null
    
    const urlParams = new URLSearchParams(window.location.search)
    const refCode = urlParams.get('ref')
    
    if (refCode && user) {
      setHasCheckedUrl(true)
      // 자동으로 레퍼럴 코드 적용 시도
      applyReferralCode(refCode).catch(error => {
        console.log('URL 레퍼럴 코드 적용 실패:', error.message)
      })
    }
    
    return refCode
  }, [hasCheckedUrl, user, applyReferralCode])

  // 컴포넌트 마운트 시 사용자 통계 로드
  useEffect(() => {
    if (user) {
      loadUserStats()
    }
  }, [user, loadUserStats])

  // URL 레퍼럴 코드 확인 (한 번만)
  useEffect(() => {
    if (user && !hasCheckedUrl) {
      checkUrlReferralCode()
    }
  }, [user, hasCheckedUrl, checkUrlReferralCode])

  return {
    // 상태
    userReferralCode,
    userStats,
    loading,
    
    // 액션
    generateUserReferralCode,
    validateReferralCode,
    applyReferralCode,
    loadUserStats,
    copyReferralCode,
    generateReferralLink,
    copyReferralLink,
    checkUrlReferralCode
  }
}
