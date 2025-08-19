'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Copy, 
  Share2, 
  Users, 
  Gift, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  ExternalLink,
  RefreshCw
} from 'lucide-react'
import { useReferralCode } from '@/hooks/useReferralCode'
import { useAuth } from '@/hooks/useAuth'
import Header from '@/components/Header'
import ReferralShare from '@/components/ReferralShare'
import { toast } from 'sonner'

export default function ReferralPage() {
  const { user } = useAuth()
  const {
    userReferralCode,
    userStats,
    loading,
    generateUserReferralCode,
    copyReferralCode,
    generateReferralLink,
    copyReferralLink,
    loadUserStats
  } = useReferralCode()

  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (user) {
      loadUserStats()
    }
  }, [user, loadUserStats])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">로그인이 필요합니다</h2>
              <p className="text-gray-600 mb-4">
                레퍼럴 시스템을 이용하려면 먼저 로그인해주세요.
              </p>
              <Button asChild>
                <a href="/login">로그인하기</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const handleGenerateCode = async () => {
    try {
      await generateUserReferralCode()
      toast.success('레퍼럴 코드가 생성되었습니다!')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleCopyCode = async () => {
    try {
      await copyReferralCode()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleCopyLink = async () => {
    try {
      await copyReferralLink()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleRefresh = async () => {
    try {
      await loadUserStats()
      toast.success('데이터가 새로고침되었습니다!')
    } catch (error: any) {
      toast.error('새로고침에 실패했습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">레퍼럴 시스템</h1>
                <p className="text-gray-600">친구를 추천하고 보상을 받아보세요!</p>
              </div>
              <Button onClick={handleRefresh} disabled={loading} variant="outline">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                새로고침
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">개요</TabsTrigger>
              <TabsTrigger value="share">공유하기</TabsTrigger>
              <TabsTrigger value="history">사용 기록</TabsTrigger>
              <TabsTrigger value="rewards">보상 내역</TabsTrigger>
            </TabsList>

            {/* 개요 탭 */}
            <TabsContent value="overview" className="space-y-6">
              {/* 통계 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">총 추천</p>
                        <p className="text-2xl font-bold">{userStats?.totalReferrals || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">성공한 추천</p>
                        <p className="text-2xl font-bold">{userStats?.successfulReferrals || 0}</p>
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
                        <p className="text-2xl font-bold">{userStats?.totalEarned?.toLocaleString() || 0}원</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="text-sm text-gray-600">지급된 보상</p>
                        <p className="text-2xl font-bold">{userStats?.totalPaid?.toLocaleString() || 0}원</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 레퍼럴 코드 섹션 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    내 레퍼럴 코드
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userReferralCode ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="bg-gray-50 p-4 rounded-lg border">
                            <p className="text-sm text-gray-600 mb-1">레퍼럴 코드</p>
                            <p className="text-2xl font-mono font-bold text-green-600">
                              {userReferralCode.code}
                            </p>
                          </div>
                        </div>
                        <Button onClick={handleCopyCode} variant="outline">
                          <Copy className="w-4 h-4 mr-2" />
                          복사
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="bg-gray-50 p-4 rounded-lg border">
                            <p className="text-sm text-gray-600 mb-1">레퍼럴 링크</p>
                            <p className="text-sm font-mono text-blue-600 break-all">
                              {generateReferralLink()}
                            </p>
                          </div>
                        </div>
                        <Button onClick={handleCopyLink} variant="outline">
                          <Copy className="w-4 h-4 mr-2" />
                          복사
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{userReferralCode.usageCount}</p>
                          <p className="text-sm text-gray-600">사용 횟수</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{userReferralCode.maxUsage}</p>
                          <p className="text-sm text-gray-600">최대 사용 가능</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">{userReferralCode.rewardAmount.toLocaleString()}원</p>
                          <p className="text-sm text-gray-600">추천 보상</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">레퍼럴 코드가 없습니다</h3>
                      <p className="text-gray-600 mb-4">
                        레퍼럴 코드를 생성하여 친구들을 추천하고 보상을 받아보세요!
                      </p>
                      <Button onClick={handleGenerateCode} disabled={loading}>
                        {loading ? '생성 중...' : '레퍼럴 코드 생성'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 혜택 안내 */}
              <Card>
                <CardHeader>
                  <CardTitle>레퍼럴 혜택</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-green-600">추천인 혜택</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          친구가 가입하면 10,000원 보상
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          최대 50명까지 추천 가능
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          보상은 관리자 승인 후 지급
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-600">추천받은 사용자 혜택</h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          첫 결제 시 10,000원 할인
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          특별 서비스 혜택 제공
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          우선 고객 지원
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 공유하기 탭 */}
            <TabsContent value="share" className="space-y-6">
              {userReferralCode ? (
                <ReferralShare
                  referralCode={userReferralCode.code}
                  referralLink={generateReferralLink() || ''}
                  userName={user.displayName || user.email || '사용자'}
                />
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">레퍼럴 코드가 필요합니다</h3>
                    <p className="text-gray-600 mb-4">
                      공유 기능을 이용하려면 먼저 레퍼럴 코드를 생성해주세요.
                    </p>
                    <Button onClick={handleGenerateCode} disabled={loading}>
                      {loading ? '생성 중...' : '레퍼럴 코드 생성'}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* 사용 기록 탭 */}
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>추천 사용 기록</CardTitle>
                </CardHeader>
                <CardContent>
                  {userStats?.usages && userStats.usages.length > 0 ? (
                    <div className="space-y-4">
                      {userStats.usages.map((usage: any) => (
                        <div key={usage.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{usage.referredUserName}</h3>
                              <p className="text-sm text-gray-600">{usage.referredUserEmail}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(usage.usedAt).toLocaleDateString('ko-KR')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={
                                  usage.status === 'paid' ? 'default' : 
                                  usage.status === 'approved' ? 'secondary' : 'outline'
                                }
                              >
                                {usage.status === 'paid' ? '지급완료' : 
                                 usage.status === 'approved' ? '승인됨' : '대기중'}
                              </Badge>
                              <span className="text-sm font-medium">
                                {usage.rewardAmount.toLocaleString()}원
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">아직 추천 기록이 없습니다.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 보상 내역 탭 */}
            <TabsContent value="rewards" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>보상 내역</CardTitle>
                </CardHeader>
                <CardContent>
                  {userStats?.rewards && userStats.rewards.length > 0 ? (
                    <div className="space-y-4">
                      {userStats.rewards.map((reward: any) => (
                        <div key={reward.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{reward.description}</h3>
                              <p className="text-sm text-gray-600">{reward.source}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(reward.createdAt).toLocaleDateString('ko-KR')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={
                                  reward.status === 'paid' ? 'default' : 
                                  reward.status === 'approved' ? 'secondary' : 'outline'
                                }
                              >
                                {reward.status === 'paid' ? '지급완료' : 
                                 reward.status === 'approved' ? '승인됨' : '대기중'}
                              </Badge>
                              <span className="text-lg font-bold text-green-600">
                                {reward.amount.toLocaleString()}원
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">아직 보상 내역이 없습니다.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
