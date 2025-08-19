'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Gift, CheckCircle } from 'lucide-react'
import UserSocialLogin from '@/components/UserSocialLogin'
import ReferralCodeInput from '@/components/ReferralCodeInput'
import { toast } from 'sonner'

function SignupPageContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [referralCodeApplied, setReferralCodeApplied] = useState(false)
  const [appliedReferralCode, setAppliedReferralCode] = useState('')

  const { user, signUp } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasReferralCode = searchParams.get('ref')
  
  // URL에서 레퍼럴 코드가 있으면 초기값으로 설정
  if (hasReferralCode && !referralCodeApplied) {
    setReferralCodeApplied(true)
    setAppliedReferralCode(hasReferralCode)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.')
      return
    }

    setLoading(true)

    try {
      await signUp(email, password, displayName)
      toast.success('회원가입이 완료되었습니다!')
      router.push('/')
    } catch (error: any) {
      setError(error.message || '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleReferralCodeApplied = (code: string) => {
    setReferralCodeApplied(true)
    setAppliedReferralCode(code)
    toast.success('레퍼럴 코드가 적용되었습니다! 가입 후 10,000원 할인을 받을 수 있습니다.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">회원가입</CardTitle>
          <CardDescription>
            투어가이더 계정을 만들어보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">이름</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="홍길동"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              회원가입
            </Button>
          </form>

          <UserSocialLogin mode="signup" />

          {/* 레퍼럴 코드가 있는 경우 표시 */}
          {(hasReferralCode || referralCodeApplied) && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Gift className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">친구 추천 혜택</span>
              </div>
              {referralCodeApplied ? (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      레퍼럴 코드 <strong>{appliedReferralCode}</strong>가 적용되었습니다! 가입 후 10,000원 할인을 받을 수 있습니다.
                    </span>
                  </div>
                </div>
              ) : (
                <ReferralCodeInput 
                  variant="compact"
                  showBenefits={false}
                  onCodeApplied={handleReferralCodeApplied}
                  initialCode={hasReferralCode || undefined}
                />
              )}
            </div>
          )}

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">이미 계정이 있으신가요? </span>
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
              로그인하기
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <SignupPageContent />
    </Suspense>
  )
}
