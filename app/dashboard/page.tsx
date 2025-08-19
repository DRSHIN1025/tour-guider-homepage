'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useReferralCode } from '@/hooks/useReferralCode'
import Header from '@/components/Header'
import { 
  User, 
  LogOut, 
  FileText, 
  Calendar, 
  MapPin, 
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Gift,
  Share2,
  TrendingUp,
  Users,
  Star,
  Phone,
  Mail,
  Edit,
  Save,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import { getUserQuoteRequests, QuoteRequest } from '@/lib/firestore'

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardContent() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { userReferralCode, userStats, copyReferralCode } = useReferralCode()
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    phone: '',
    email: user?.email || ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    loadUserData()
  }, [user])

  const loadUserData = async () => {
    if (!user) return

    try {
      setLoading(true)
      const requests = await getUserQuoteRequests(user.uid)
      setQuoteRequests(requests)
    } catch (error) {
      console.error('사용자 데이터 로드 오류:', error)
      toast.error('데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
      toast.success('로그아웃되었습니다.')
    } catch (error) {
      console.error('로그아웃 오류:', error)
      toast.error('로그아웃에 실패했습니다.')
    }
  }

  const handleCopyReferralCode = async () => {
    try {
      await copyReferralCode()
      toast.success('레퍼럴 코드가 복사되었습니다!')
    } catch (error) {
      toast.error('코드 복사에 실패했습니다.')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">검토 중</Badge>
      case 'reviewing':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">검토 중</Badge>
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">승인됨</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">거절됨</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">알 수 없음</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'reviewing':
        return <Clock className="w-4 h-4" />
      case 'approved':
        return <CheckCircle className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                안녕하세요, {user.displayName || user.email?.split('@')[0]}님!
              </h1>
              <p className="text-gray-600">투어가이더 대시보드에 오신 것을 환영합니다.</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 견적 요청</p>
                  <p className="text-2xl font-bold text-gray-900">{quoteRequests.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">승인된 견적</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {quoteRequests.filter(q => q.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">레퍼럴 보상</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userStats?.totalRewards || 0}원
                  </p>
                </div>
                <Gift className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">추천한 친구</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userStats?.totalReferrals || 0}명
                  </p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 메인 컨텐츠 */}
        <Tabs defaultValue="quotes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quotes">견적 이력</TabsTrigger>
            <TabsTrigger value="referral">레퍼럴 관리</TabsTrigger>
            <TabsTrigger value="profile">프로필</TabsTrigger>
          </TabsList>

          {/* 견적 이력 탭 */}
          <TabsContent value="quotes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  견적 요청 이력
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">로딩 중...</p>
                  </div>
                ) : quoteRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">아직 견적 요청이 없습니다.</p>
                    <Button onClick={() => router.push('/quote')}>
                      첫 견적 요청하기
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quoteRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            {getStatusBadge(request.status)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">{request.destination}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{request.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{request.budget}</span>
                          </div>
                        </div>

                        {request.requirements && (
                          <div className="mt-3 p-3 bg-gray-50 rounded">
                            <p className="text-sm text-gray-700">{request.requirements}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 레퍼럴 관리 탭 */}
          <TabsContent value="referral" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  레퍼럴 관리
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userReferralCode ? (
                  <div className="space-y-6">
                    {/* 레퍼럴 코드 */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-4">내 레퍼럴 코드</h3>
                      <div className="flex items-center gap-3">
                        <div className="bg-white px-4 py-2 rounded border font-mono text-lg">
                          {userReferralCode.code}
                        </div>
                        <Button onClick={handleCopyReferralCode} size="sm">
                          <Share2 className="w-4 h-4 mr-2" />
                          복사
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        친구가 이 코드로 가입하면 10,000원 할인을 받을 수 있습니다!
                      </p>
                    </div>

                    {/* 레퍼럴 통계 */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg border">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {userStats?.totalReferrals || 0}
                        </div>
                        <div className="text-sm text-gray-600">추천한 친구</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {userStats?.totalRewards || 0}원
                        </div>
                        <div className="text-sm text-gray-600">총 보상</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {userStats?.pendingRewards || 0}원
                        </div>
                        <div className="text-sm text-gray-600">대기 중인 보상</div>
                      </div>
                    </div>

                    {/* 레퍼럴 링크 */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">레퍼럴 링크</h4>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={`${window.location.origin}/signup?ref=${userReferralCode.code}`}
                          readOnly
                          className="flex-1 px-3 py-2 border rounded text-sm bg-white"
                        />
                        <Button onClick={handleCopyReferralCode} size="sm">
                          복사
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">레퍼럴 코드가 아직 생성되지 않았습니다.</p>
                    <Button onClick={() => router.push('/referral')}>
                      레퍼럴 코드 생성하기
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 프로필 탭 */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  프로필 관리
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* 프로필 정보 */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">기본 정보</h3>
                      <Button
                        onClick={() => setEditingProfile(!editingProfile)}
                        variant="outline"
                        size="sm"
                      >
                        {editingProfile ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                        {editingProfile ? '취소' : '편집'}
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <User className="w-4 h-4 inline mr-2" />
                          이름
                        </label>
                        {editingProfile ? (
                          <input
                            type="text"
                            value={profileData.displayName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        ) : (
                          <p className="text-gray-900">{user.displayName || '미설정'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          이메일
                        </label>
                        <p className="text-gray-900">{user.email}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="w-4 h-4 inline mr-2" />
                          전화번호
                        </label>
                        {editingProfile ? (
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="010-1234-5678"
                          />
                        ) : (
                          <p className="text-gray-900">{profileData.phone || '미설정'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          가입일
                        </label>
                        <p className="text-gray-900">
                          {user.metadata?.creationTime ? 
                            new Date(user.metadata.creationTime).toLocaleDateString() : 
                            '알 수 없음'
                          }
                        </p>
                      </div>
                    </div>

                    {editingProfile && (
                      <div className="flex gap-2">
                        <Button onClick={() => setEditingProfile(false)}>
                          <Save className="w-4 h-4 mr-2" />
                          저장
                        </Button>
                        <Button variant="outline" onClick={() => setEditingProfile(false)}>
                          취소
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* 계정 관리 */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">계정 관리</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Edit className="w-4 h-4 mr-2" />
                        비밀번호 변경
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                        <X className="w-4 h-4 mr-2" />
                        계정 삭제
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
