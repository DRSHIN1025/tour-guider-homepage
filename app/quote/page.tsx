'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Header from '@/components/Header'
// ReferralCodeInput 제거됨
import { 
  Upload, 
  FileText, 
  Users, 
  MapPin, 
  Calendar, 
  DollarSign,
  Phone,
  MessageCircle,
  CheckCircle,
  User,
  LogOut,
  Gift,
  ArrowRight,
  ArrowLeft,
  Clock,
  Star
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { saveQuoteRequest } from '@/lib/firestore'
import { uploadFile } from '@/lib/storage'

// 견적요청 데이터 타입
interface QuoteFormData {
  destination: string
  duration: string
  people: string
  budget: string
  startDate: string
  requirements: string
  contactMethod: string
  contactPhone: string
  files: File[]
}

// 파일 업로드 컴포넌트 - 개선된 버전
function FileUpload({ files, onFilesChange }: { files: File[], onFilesChange: (files: File[]) => void }) {
  
  // 파일 선택 핸들러 - 개선된 버전
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('파일 선택 이벤트 발생!')
    console.log('이벤트 타겟:', e.target)
    console.log('선택된 파일들:', e.target.files)
    
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files)
      console.log('파일 배열 변환 완료:', selectedFiles.map(f => ({ name: f.name, size: f.size })))
      
      // 파일 크기 검증
      const validFiles = selectedFiles.filter(file => {
        if (file.size > 10 * 1024 * 1024) {
          console.log(`파일 크기 초과: ${file.name} (${file.size} bytes)`)
          alert(`${file.name} 파일이 10MB를 초과합니다.`)
          return false
        }
        return true
      })
      
      console.log('유효한 파일들:', validFiles.map(f => f.name))
      
      // 파일 개수 제한
      if (files.length + validFiles.length > 5) {
        console.log(`파일 개수 초과: 현재 ${files.length}개, 추가하려는 파일 ${validFiles.length}개`)
        alert('최대 5개까지 파일을 첨부할 수 있습니다.')
        return
      }
      
      // 파일 추가
      const updatedFiles = [...files, ...validFiles]
      console.log('업데이트된 파일 목록:', updatedFiles.map(f => f.name))
      onFilesChange(updatedFiles)
      
      if (validFiles.length > 0) {
        alert(`${validFiles.length}개 파일이 추가되었습니다!`)
      }
    } else {
      console.log('선택된 파일이 없습니다.')
    }
    
    // 입력 값 초기화
    e.target.value = ''
  }

  // 버튼 클릭 핸들러 추가
  const handleButtonClick = () => {
    console.log('파일 선택 버튼이 클릭되었습니다!')
    const input = document.getElementById('file-upload-input') as HTMLInputElement
    if (input) {
      console.log('파일 입력 요소를 찾았습니다:', input)
      input.click()
    } else {
      console.error('파일 입력 요소를 찾을 수 없습니다!')
    }
  }

  // 파일 삭제
  const removeFile = (index: number) => {
    console.log('파일 삭제:', index)
    const updatedFiles = files.filter((_, i) => i !== index)
    onFilesChange(updatedFiles)
    alert('파일이 삭제되었습니다.')
  }

  // 모든 파일 삭제
  const removeAllFiles = () => {
    console.log('모든 파일 삭제')
    onFilesChange([])
    alert('모든 파일이 삭제되었습니다.')
  }

  // 파일 아이콘 가져오기
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf': return '📄'
      case 'doc': case 'docx': return '📝'
      case 'xls': case 'xlsx': return '📊'
      case 'hwp': return '📋'
      case 'jpg': case 'jpeg': case 'png': case 'gif': return '🖼️'
      default: return '📎'
    }
  }

  return (
    <div className="space-y-6">
      {/* 파일 업로드 영역 - 드래그 앤 드롭 제거 */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
        <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          파일을 선택하세요
        </h3>
        <p className="text-gray-600 mb-4">
          여행 일정표, 참고자료를 첨부해주세요
        </p>
        <p className="text-sm text-gray-500 mb-6">
          DOC, EXCEL, HWP, PDF, 이미지 파일 지원 (최대 10MB, 최대 5개)
        </p>
        
        {/* 파일 입력 - 개선된 버튼 방식 */}
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={handleButtonClick}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-base font-semibold flex items-center space-x-2 transition-all duration-200 hover:scale-105"
          >
            <Upload className="w-5 h-5" />
            <span>파일 선택</span>
          </Button>
          <input
            type="file"
            multiple
            accept=".doc,.docx,.xls,.xlsx,.hwp,.pdf,.jpg,.jpeg,.png,.gif"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload-input"
            style={{ display: 'none' }}
          />
        </div>
        
        {/* 디버그용 추가 버튼 */}
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={handleButtonClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            🔧 디버그: 파일 선택
          </button>
        </div>
      </div>

      {/* 현재 상태 표시 */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="font-semibold text-green-900 mb-2">📊 현재 상태</h4>
        <p className="text-green-700">
          선택된 파일: <strong>{files.length}</strong>개 / 5개
        </p>
        {files.length > 0 && (
          <p className="text-sm text-green-600 mt-1">
            총 크기: <strong>{(files.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(2)}MB</strong>
          </p>
        )}
      </div>

      {/* 첨부된 파일 목록 */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">
              📁 첨부된 파일 ({files.length}/5)
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeAllFiles}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              모두 삭제
            </Button>
          </div>
          
          <div className="space-y-3">
            {files.map((file, index) => (
              <div 
                key={`${file.name}-${index}`} 
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{getFileIcon(file.name)}</span>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 truncate max-w-xs">
                      {file.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)}MB
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  삭제
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 디버그 정보 */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-bold text-blue-900 mb-2">🔍 디버그 정보</h4>
        <p className="text-sm text-blue-700">
          파일 개수: <strong>{files.length}</strong>개
        </p>
        <p className="text-xs text-blue-600 mt-1">
          파일 입력 요소 ID: <strong>file-upload-input</strong>
        </p>
        <p className="text-xs text-blue-600 mt-1">
          브라우저: <strong>{typeof window !== 'undefined' ? navigator.userAgent.split(' ')[0] : 'Unknown'}</strong>
        </p>
        {files.length > 0 ? (
          files.map((file, index) => (
            <p key={index} className="text-xs text-blue-600 mt-1">
              {index + 1}. {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
            </p>
          ))
        ) : (
          <p className="text-xs text-blue-600">선택된 파일이 없습니다. 위의 버튼을 클릭해보세요!</p>
        )}
      </div>

      {/* 사용 안내 */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="font-bold text-yellow-900 mb-2">💡 사용 안내</h4>
        <ol className="text-sm text-yellow-800 space-y-1">
          <li>1. 위의 "파일 선택" 버튼을 클릭하세요</li>
          <li>2. 파일 선택 창이 열리면 원하는 파일들을 선택하세요</li>
          <li>3. 선택된 파일들이 아래 목록에 표시됩니다</li>
          <li>4. 만약 버튼이 작동하지 않으면 "디버그: 파일 선택" 버튼을 시도해보세요</li>
        </ol>
      </div>
    </div>
  )
}

// 메인 견적요청 컴포넌트 - 단일 페이지 버전
function QuoteRequestForm() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<QuoteFormData>({
    destination: searchParams.get('destination') || '',
    duration: searchParams.get('duration') || '',
    people: searchParams.get('people') || '',
    budget: '',
    startDate: '',
    requirements: '',
    contactMethod: 'email',
    contactPhone: '',
    files: []
  })

  // URL 파라미터에서 초기값 설정
  useEffect(() => {
    const destination = searchParams.get('destination') || ''
    const duration = searchParams.get('duration') || ''
    const people = searchParams.get('people') || ''

    setFormData(prev => ({
      ...prev,
      destination,
      duration,
      people
    }))
  }, [searchParams])

  const updateFormData = (field: keyof QuoteFormData, value: string | File[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLogout = async () => {
    try {
      await logout()
      console.log('로그아웃 완료')
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      toast.error('로그인이 필요합니다.')
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      console.log('견적요청 데이터 전송 시작:', formData)
      
      // 1. 파일 업로드 처리
      const attachments = []
      if (formData.files.length > 0) {
        toast.info('파일을 업로드하고 있습니다...')
        
        for (const file of formData.files) {
          try {
            const filePath = `quotes/${user.uid}/${Date.now()}_${file.name}`
            const downloadURL = await uploadFile(file, filePath)
            
            attachments.push({
              name: file.name,
              url: downloadURL, // uploadFile은 직접 URL 문자열을 반환
              size: file.size
            })
          } catch (uploadError) {
            console.error('파일 업로드 오류:', uploadError)
            toast.error(`파일 업로드 실패: ${file.name}`)
          }
        }
      }

      // 2. Firestore에 견적요청 데이터 저장
      const quoteRequestData = {
        userId: user.uid,
        userName: user.displayName || user.email || '익명',
        userEmail: user.email || '',
        destination: formData.destination,
        duration: formData.duration,
        people: formData.people,
        budget: formData.budget,
        startDate: formData.startDate,
        requirements: formData.requirements,
        contactMethod: formData.contactMethod as 'email' | 'kakao',
        contactPhone: formData.contactPhone,
        attachments
      }

      console.log('Firestore에 저장할 데이터:', quoteRequestData)
      
      const savedQuote = await saveQuoteRequest(quoteRequestData)
      console.log('견적요청이 성공적으로 저장됨:', savedQuote)
      
      // 3. 이메일 및 카카오톡 알림 발송
      try {
        toast.info('알림을 발송하고 있습니다...')
        
        // 이메일 알림 발송
        const emailResponse = await fetch('/api/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'quote_request',
            quoteData: quoteRequestData,
            userEmail: user.email,
            userName: user.displayName || user.email?.split('@')[0] || '고객'
          })
        })

        if (emailResponse.ok) {
          console.log('이메일 알림 발송 성공')
        } else {
          console.error('이메일 알림 발송 실패')
        }

        // 카카오톡 알림 발송 (관리자에게)
        const kakaoResponse = await fetch('/api/kakao/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'quote_request_admin',
            data: {
              userName: user.displayName || user.email?.split('@')[0] || '고객',
              destination: formData.destination,
              duration: formData.duration,
              people: formData.people,
              budget: formData.budget,
              startDate: formData.startDate,
              requirements: formData.requirements,
              contactMethod: formData.contactMethod,
              contactPhone: formData.contactPhone,
              attachments: attachments.length > 0 ? `${attachments.length}개 파일 첨부` : '파일 없음'
            }
          })
        })
        if (kakaoResponse.ok) {
          console.log('카카오톡 관리자 알림 발송 성공')
        } else {
          console.error('카카오톡 관리자 알림 발송 실패')
        }

        // 카카오톡 알림 발송 (사용자에게)
        const userKakaoResponse = await fetch('/api/kakao/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'quote_request_user',
            data: {
              userName: user.displayName || user.email?.split('@')[0] || '고객',
              destination: formData.destination,
              duration: formData.duration,
              people: formData.people,
              message: '견적 요청이 성공적으로 접수되었습니다. 24시간 내에 현지 가이드가 연락드리겠습니다.'
            }
          })
        })
        if (userKakaoResponse.ok) {
          console.log('카카오톡 사용자 알림 발송 성공')
        } else {
          console.error('카카오톡 사용자 알림 발송 실패')
        }

      } catch (notificationError) {
        console.error('알림 발송 오류:', notificationError)
      }

      toast.success('견적 요청이 성공적으로 전송되었습니다!')
      router.push('/dashboard')
      
    } catch (error) {
      console.error('견적요청 전송 오류:', error)
      toast.error('견적 요청 전송 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = () => {
    return formData.destination && 
           formData.duration && 
           formData.people && 
           formData.budget && 
           formData.startDate
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h2>
                <p className="text-gray-600 mb-6">
                  견적 요청을 하려면 먼저 로그인해주세요.
                </p>
                <Button onClick={() => router.push('/login')} className="w-full">
                  로그인하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              맞춤 견적 요청
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              여행 정보를 입력해주시면 현지 가이드들이 직접 맞춤 견적을 제안해드립니다.
            </p>
          </div>
          
          {/* 견적요청 폼 - 단일 페이지 */}
          <div className="bg-white rounded-2xl p-8 max-w-4xl mx-auto shadow-lg border border-gray-100">
            
            {/* 기본 정보 (2열 레이아웃) */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-green-600" />
                  여행지 *
                </Label>
                <Input
                  type="text"
                  placeholder="예: 베트남 하노이, 태국 방콕..."
                  value={formData.destination}
                  onChange={(e) => updateFormData('destination', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  여행 기간 *
                </Label>
                <Input
                  type="text"
                  placeholder="예: 3박4일, 5박6일..."
                  value={formData.duration}
                  onChange={(e) => updateFormData('duration', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-purple-600" />
                  인원 *
                </Label>
                <Input
                  type="text"
                  placeholder="예: 성인 2명, 아동 1명..."
                  value={formData.people}
                  onChange={(e) => updateFormData('people', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-yellow-600" />
                  예산 (1인 기준) *
                </Label>
                <Input
                  type="text"
                  placeholder="예: 100만원, 150만원..."
                  value={formData.budget}
                  onChange={(e) => updateFormData('budget', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* 출발일 및 특별 요청사항 */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">출발 희망일 *</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateFormData('startDate', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">특별 요청사항</Label>
                <Textarea
                  placeholder="선호하는 숙박시설, 음식, 활동 등을 자유롭게 작성해주세요..."
                  rows={4}
                  value={formData.requirements}
                  onChange={(e) => updateFormData('requirements', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            
            {/* 연락 방법 */}
            <div className="space-y-2 mb-8">
              <Label className="text-sm font-medium text-gray-700">연락 방법</Label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="email"
                    checked={formData.contactMethod === 'email'}
                    onChange={(e) => updateFormData('contactMethod', e.target.value)}
                    className="text-green-600"
                  />
                  <span>이메일</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="kakao"
                    checked={formData.contactMethod === 'kakao'}
                    onChange={(e) => updateFormData('contactMethod', e.target.value)}
                    className="text-green-600"
                  />
                  <span>카카오톡</span>
                </label>
              </div>
            </div>
            
            {/* 연락처 */}
            <div className="space-y-2 mb-8">
              <Label className="text-sm font-medium text-gray-700 flex items-center">
                <Phone className="w-4 h-4 mr-2 text-green-600" />
                연락처 (선택)
              </Label>
              <Input
                type="tel"
                placeholder="010-1234-5678"
                value={formData.contactPhone}
                onChange={(e) => updateFormData('contactPhone', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500">
                카카오톡이나 이메일이 없는 경우 연락처를 남겨주세요
              </p>
            </div>
            

            
            {/* 파일 첨부 */}
            <div className="mb-8">
              <FileUpload 
                files={formData.files}
                onFilesChange={(files) => updateFormData('files', files)}
              />
            </div>
            
            {/* 제출 버튼 */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-4 text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">신득렬님으로 견적요청이 전송됩니다.</span>
              </div>
              
              <Button 
                onClick={handleSubmit}
                disabled={!isFormValid() || loading}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-lg flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>전송 중...</span>
                  </>
                ) : (
                  <>
                    <span>견적요청 전송하기</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function QuotePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">페이지를 로딩하는 중...</p>
        </div>
      </div>
    }>
      <QuoteRequestForm />
    </Suspense>
  )
}
