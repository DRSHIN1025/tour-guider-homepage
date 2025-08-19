'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Users,
  Gift,
  TrendingUp,
  Phone
} from 'lucide-react'
import { subscribeToQuoteRequests, updateQuoteStatus, QuoteRequest } from '@/lib/firestore'
import { 
  getAllReferralCodes, 
  getAllReferralStats, 
  approveReward, 
  deactivateReferralCode,
  ReferralCode,
  ReferralUsage,
  ReferralReward
} from '@/lib/referral'
import Header from '@/components/Header'
import { toast } from 'sonner'

export default function AdminPage() {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([])
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null)
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([])
  const [referralUsages, setReferralUsages] = useState<ReferralUsage[]>([])
  const [referralRewards, setReferralRewards] = useState<ReferralReward[]>([])
  const [referralStats, setReferralStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // 견적 요청 데이터 로드
  useEffect(() => {
    const unsubscribe = subscribeToQuoteRequests((requests) => {
      setQuoteRequests(requests)
    })

    return () => unsubscribe()
  }, [])

  // 레퍼럴 데이터 로드
  useEffect(() => {
    loadReferralData()
  }, [])

  const loadReferralData = async () => {
    setLoading(true)
    try {
      const [codes, stats] = await Promise.all([
        getAllReferralCodes(),
        getAllReferralStats()
      ])
      setReferralCodes(codes)
      setReferralStats(stats)
      setReferralRewards(stats.rewards || [])
    } catch (error) {
      console.error('레퍼럴 데이터 로드 오류:', error)
      toast.error('레퍼럴 데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 견적 상태 변경
  const handleStatusChange = async (quoteId: string, newStatus: 'pending' | 'reviewing' | 'approved' | 'rejected') => {
    try {
      await updateQuoteStatus(quoteId, newStatus)
      
      // 견적이 승인되면 사용자에게 이메일 및 카카오톡 알림 발송
      if (newStatus === 'approved') {
        const quote = quoteRequests.find(q => q.id === quoteId)
        if (quote) {
          try {
            // 이메일 알림 발송
            const emailResponse = await fetch('/api/email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type: 'quote_complete',
                quoteData: {
                  destination: quote.destination,
                  duration: quote.duration,
                  people: quote.people
                },
                userEmail: quote.userEmail,
                userName: quote.userName
              })
            })

            if (emailResponse.ok) {
              console.log('이메일 알림 발송 성공')
            } else {
              console.error('이메일 알림 발송 실패')
            }

            // 카카오톡 알림 발송
            const kakaoResponse = await fetch('/api/kakao/notify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type: 'quote_complete_user',
                data: {
                  userName: quote.userName,
                  destination: quote.destination,
                  duration: quote.duration,
                  people: quote.people,
                  message: '견적이 완료되었습니다! 상세한 여행 일정과 가격을 확인해보세요.'
                }
              })
            })

            if (kakaoResponse.ok) {
              console.log('카카오톡 알림 발송 성공')
              toast.success('상태가 업데이트되었습니다. 견적 완료 알림이 발송되었습니다.')
            } else {
              console.error('카카오톡 알림 발송 실패')
              toast.success('상태가 업데이트되었습니다. (카카오톡 알림 발송 실패)')
            }
          } catch (notificationError) {
            console.error('알림 발송 오류:', notificationError)
            toast.success('상태가 업데이트되었습니다. (알림 발송 실패)')
          }
        }
      } else {
        toast.success('상태가 업데이트되었습니다.')
      }
    } catch (error) {
      console.error('상태 업데이트 오류:', error)
      toast.error('상태 업데이트에 실패했습니다.')
    }
  }

  // 파일 다운로드
  const handleDownloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      toast.success('파일이 다운로드되었습니다.')
    } catch (error) {
      console.error('파일 다운로드 오류:', error)
      toast.error('파일 다운로드에 실패했습니다.')
    }
  }

  // 보상 승인
  const handleApproveReward = async (rewardId: string) => {
    try {
      await approveReward(rewardId)
      toast.success('보상이 승인되었습니다.')
      loadReferralData() // 데이터 새로고침
    } catch (error) {
      console.error('보상 승인 오류:', error)
      toast.error('보상 승인에 실패했습니다.')
    }
  }

  // 레퍼럴 코드 비활성화
  const handleDeactivateCode = async (codeId: string) => {
    try {
      await deactivateReferralCode(codeId)
      toast.success('레퍼럴 코드가 비활성화되었습니다.')
      loadReferralData() // 데이터 새로고침
    } catch (error) {
      console.error('코드 비활성화 오류:', error)
      toast.error('코드 비활성화에 실패했습니다.')
    }
  }

  const handlePayReward = async (rewardId: string) => {
    try {
      // 실제 결제 시스템과 연동 필요
      await approveReward(rewardId)
      toast.success('보상이 지급되었습니다.')
      loadReferralData()
    } catch (error) {
      console.error('보상 지급 오류:', error)
      toast.error('보상 지급에 실패했습니다.')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: '대기중', color: 'bg-yellow-100 text-yellow-800' },
      reviewing: { label: '검토중', color: 'bg-blue-100 text-blue-800' },
      approved: { label: '승인됨', color: 'bg-green-100 text-green-800' },
      rejected: { label: '거절됨', color: 'bg-red-100 text-red-800' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={config.color}>{config.label}</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 대시보드</h1>
            <p className="text-gray-600">견적 요청 관리 및 레퍼럴 시스템 모니터링</p>
          </div>

          <Tabs defaultValue="quotes" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quotes">견적 요청 관리</TabsTrigger>
              <TabsTrigger value="referral">레퍼럴 시스템</TabsTrigger>
            </TabsList>

            {/* 견적 요청 관리 탭 */}
            <TabsContent value="quotes" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      견적 요청 목록 ({quoteRequests.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {quoteRequests.map((quote) => (
                        <div
                          key={quote.id}
                          className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setSelectedQuote(quote)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {quote.userName} - {quote.destination}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {quote.duration} • {quote.people}명
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(quote.createdAt).toLocaleDateString('ko-KR')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(quote.status)}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedQuote(quote)
                                }}
                              >
                                상세보기
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 레퍼럴 시스템 탭 */}
            <TabsContent value="referral" className="space-y-6">
              {/* 전체 통계 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">총 레퍼럴 코드</p>
                        <p className="text-2xl font-bold">{referralStats?.totalCodes || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">총 사용 횟수</p>
                        <p className="text-2xl font-bold">{referralStats?.totalUsages || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-600">총 보상</p>
                        <p className="text-2xl font-bold">{referralStats?.totalRewards || 0}원</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">승인된 보상</p>
                        <p className="text-2xl font-bold">{referralStats?.approvedRewards || 0}원</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 레퍼럴 코드 목록 */}
              <Card>
                <CardHeader>
                  <CardTitle>레퍼럴 코드 관리</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {referralCodes.map((code) => (
                      <div key={code.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{code.code}</h3>
                            <p className="text-sm text-gray-600">
                              {code.userName} ({code.userEmail})
                            </p>
                            <p className="text-sm text-gray-500">
                              사용 횟수: {code.usageCount} • 생성일: {new Date(code.createdAt).toLocaleDateString('ko-KR')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={code.isActive ? "default" : "secondary"}>
                              {code.isActive ? '활성' : '비활성'}
                            </Badge>
                            {code.isActive && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeactivateCode(code.id)}
                              >
                                비활성화
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 보상 관리 */}
              <Card>
                <CardHeader>
                  <CardTitle>보상 관리</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {referralRewards.map((reward) => (
                      <div key={reward.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{reward.userName}</h3>
                            <p className="text-sm text-gray-600">
                              {reward.description}
                            </p>
                            <p className="text-sm text-gray-500">
                              금액: {reward.amount.toLocaleString()}원 • 
                              생성일: {new Date(reward.createdAt).toLocaleDateString('ko-KR')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={reward.status === 'approved' ? "default" : "secondary"}>
                              {reward.status === 'approved' ? '승인됨' : '대기중'}
                            </Badge>
                            {reward.status !== 'approved' && (
                              <Button
                                size="sm"
                                onClick={() => handleApproveReward(reward.id)}
                              >
                                승인
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* 견적 상세 모달 */}
          {selectedQuote && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">견적 요청 상세</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedQuote(null)}
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600">고객명</p>
                      <p>{selectedQuote.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">이메일</p>
                      <p>{selectedQuote.userEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">여행지</p>
                      <p>{selectedQuote.destination}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">여행 기간</p>
                      <p>{selectedQuote.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">참가 인원</p>
                      <p>{selectedQuote.people}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">예산</p>
                      <p>{selectedQuote.budget}</p>
                    </div>
                    {selectedQuote.startDate && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">출발 희망일</p>
                        <p>{selectedQuote.startDate}</p>
                      </div>
                    )}
                    {selectedQuote.requirements && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">추가 요청사항</p>
                        <p className="whitespace-pre-wrap">{selectedQuote.requirements}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-600">연락 방법</p>
                      <p>{selectedQuote.contactMethod === 'email' ? '이메일' : '카카오톡'}</p>
                    </div>
                    {selectedQuote.contactPhone && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">연락처</p>
                        <p className="flex items-center gap-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {selectedQuote.contactPhone}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-600">첨부 파일</p>
                      <div className="space-y-2">
                        {selectedQuote.attachments.map((file, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadFile(file.url, file.name)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              {file.name}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">상태</p>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusBadge(selectedQuote.status)}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(selectedQuote.id!, 'approved')}
                            disabled={selectedQuote.status === 'approved'}
                          >
                            승인
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(selectedQuote.id!, 'rejected')}
                            disabled={selectedQuote.status === 'rejected'}
                          >
                            거절
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 