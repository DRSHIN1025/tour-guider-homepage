'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Copy, Gift, Users, Sparkles, ArrowRight } from 'lucide-react'
import { useReferralCode } from '@/hooks/useReferralCode'
import { toast } from 'sonner'

interface ReferralCodeInputProps {
  onCodeApplied?: (code: string) => void
  className?: string
  showBenefits?: boolean
  variant?: 'default' | 'compact' | 'prominent'
  initialCode?: string
}

export default function ReferralCodeInput({
  onCodeApplied,
  className = '',
  showBenefits = true,
  variant = 'default',
  initialCode
}: ReferralCodeInputProps) {
  const [code, setCode] = useState(initialCode || '')
  const [isValidating, setIsValidating] = useState(false)
  
  // initialCode가 변경되면 code 상태도 업데이트
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode)
    }
  }, [initialCode])
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    referrerName?: string
    code?: string
  } | null>(null)
  const [isApplied, setIsApplied] = useState(false)

  const { validateReferralCode, applyReferralCode } = useReferralCode()

  const handleValidate = async () => {
    if (!code.trim()) {
      toast.error('레퍼럴 코드를 입력해주세요.')
      return
    }

    setIsValidating(true)
    setValidationResult(null)

    try {
      const result = await validateReferralCode(code.trim())
      setValidationResult(result)
      toast.success('유효한 레퍼럴 코드입니다!')
    } catch (error: any) {
      setValidationResult({ isValid: false })
      toast.error(error.message)
    } finally {
      setIsValidating(false)
    }
  }

  const handleApply = async () => {
    if (!validationResult?.isValid) {
      toast.error('먼저 레퍼럴 코드를 확인해주세요.')
      return
    }

    try {
      await applyReferralCode(code.trim())
      setIsApplied(true)
      onCodeApplied?.(code.trim())
      toast.success('레퍼럴 코드가 적용되었습니다! 10,000원 할인이 적용됩니다.')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success('코드가 복사되었습니다!')
    } catch (error) {
      toast.error('코드 복사에 실패했습니다.')
    }
  }

  const handleReset = () => {
    setCode('')
    setValidationResult(null)
    setIsApplied(false)
    onCodeApplied?.('')
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200 ${className}`}>
        <div className="flex items-center gap-3">
          <Gift className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <Input
              type="text"
              placeholder="레퍼럴 코드 입력"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="font-mono text-sm"
              maxLength={10}
            />
          </div>
          <Button
            onClick={handleValidate}
            disabled={!code.trim() || isValidating}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            {isValidating ? '확인 중...' : '적용'}
          </Button>
        </div>
        {validationResult && (
          <div className={`mt-2 p-2 rounded-lg text-xs ${
            validationResult.isValid 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {validationResult.isValid 
              ? `${validationResult.referrerName}님의 추천 코드입니다!` 
              : '유효하지 않은 코드입니다.'
            }
          </div>
        )}
      </div>
    )
  }

  if (variant === 'prominent') {
    return (
      <Card className={`bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border-2 border-green-200 shadow-lg ${className}`}>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">친구 추천 혜택</h3>
            <p className="text-gray-600">
              레퍼럴 코드를 입력하고 <span className="font-bold text-green-600">10,000원 할인</span>을 받아보세요!
            </p>
          </div>

          {!isApplied ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="referral-code" className="text-sm font-medium">
                  레퍼럴 코드
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="referral-code"
                    type="text"
                    placeholder="예: ABC123"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="flex-1 font-mono text-lg text-center"
                    maxLength={10}
                  />
                  <Button
                    onClick={handleCopyCode}
                    variant="outline"
                    size="sm"
                    disabled={!code.trim()}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleValidate}
                  disabled={!code.trim() || isValidating}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isValidating ? '확인 중...' : '코드 확인'}
                </Button>
                {validationResult?.isValid && (
                  <Button
                    onClick={handleApply}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    코드 적용
                  </Button>
                )}
              </div>

              {validationResult && (
                <div className={`p-4 rounded-xl border-2 ${
                  validationResult.isValid 
                    ? 'bg-green-100 border-green-300' 
                    : 'bg-red-100 border-red-300'
                }`}>
                  <div className="flex items-center gap-3">
                    {validationResult.isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <span className={`font-medium ${
                        validationResult.isValid ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {validationResult.isValid 
                          ? `${validationResult.referrerName}님의 추천 코드입니다!` 
                          : '유효하지 않은 코드입니다.'
                        }
                      </span>
                      {validationResult.isValid && (
                        <p className="text-sm text-green-700 mt-1">
                          이 코드를 적용하면 10,000원 할인을 받을 수 있습니다.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl border-2 border-green-300">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-green-800 mb-2">레퍼럴 코드 적용 완료!</h4>
                <p className="text-green-700 mb-3">
                  {validationResult?.referrerName}님의 추천으로 10,000원 할인이 적용됩니다.
                </p>
                <Badge className="bg-green-600 text-white">
                  <Gift className="w-3 h-3 mr-1" />
                  10,000원 할인 적용
                </Badge>
              </div>
              <Button onClick={handleReset} variant="outline" size="sm">
                코드 변경
              </Button>
            </div>
          )}

          {showBenefits && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Gift className="w-4 h-4 text-green-600" />
                레퍼럴 혜택
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm p-2 bg-blue-50 rounded-lg">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-700">추천인: 10,000원 보상</span>
                </div>
                <div className="flex items-center gap-2 text-sm p-2 bg-green-50 rounded-lg">
                  <Gift className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700">추천받은 분: 10,000원 할인</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className={`border-2 border-dashed border-green-200 ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <Gift className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">레퍼럴 코드 적용</h3>
            <p className="text-sm text-gray-600">
              친구의 추천 코드를 입력하고 10,000원 할인을 받아보세요!
            </p>
          </div>

          {!isApplied ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="referral-code" className="text-sm font-medium">
                  레퍼럴 코드
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="referral-code"
                    type="text"
                    placeholder="예: ABC123"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="flex-1 font-mono"
                    maxLength={10}
                  />
                  <Button
                    onClick={handleCopyCode}
                    variant="outline"
                    size="sm"
                    disabled={!code.trim()}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleValidate}
                  disabled={!code.trim() || isValidating}
                  className="flex-1"
                >
                  {isValidating ? '확인 중...' : '코드 확인'}
                </Button>
                {validationResult?.isValid && (
                  <Button
                    onClick={handleApply}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    코드 적용
                  </Button>
                )}
              </div>

              {validationResult && (
                <div className={`p-3 rounded-lg border ${
                  validationResult.isValid 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {validationResult.isValid ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      validationResult.isValid ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {validationResult.isValid 
                        ? `${validationResult.referrerName}님의 추천 코드입니다!` 
                        : '유효하지 않은 코드입니다.'
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-green-800 mb-1">레퍼럴 코드 적용 완료!</h4>
                <p className="text-sm text-green-700">
                  {validationResult?.referrerName}님의 추천으로 10,000원 할인이 적용됩니다.
                </p>
              </div>
              <Button onClick={handleReset} variant="outline" size="sm">
                코드 변경
              </Button>
            </div>
          )}

          {showBenefits && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">레퍼럴 혜택</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">추천인: 10,000원 보상</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Gift className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">추천받은 분: 10,000원 할인</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
