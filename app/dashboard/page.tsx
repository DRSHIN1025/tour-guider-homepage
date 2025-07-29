"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  FileText, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Clock,
  Settings,
  LogOut,
  Plus,
  Eye,
  MessageCircle
} from "lucide-react"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"
import Link from "next/link"

interface Quote {
  id: string
  destination: string
  duration: string
  people: string
  budget: string
  status: string
  createdAt: any
  specialRequests?: string
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchQuotes()
    }
  }, [user])

  const fetchQuotes = async () => {
    if (!user) return

    try {
      const q = query(
        collection(db, 'quotes'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const quotesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Quote[]
      
      setQuotes(quotesData)
    } catch (error) {
      console.error('견적 내역 조회 오류:', error)
      toast.error('견적 내역을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const result = await logout()
      if (result.success) {
        toast.success('로그아웃되었습니다.')
        window.location.href = '/'
      } else {
        toast.error('로그아웃 중 오류가 발생했습니다.')
      }
    } catch (error) {
      toast.error('로그아웃 중 오류가 발생했습니다.')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">검토 중</Badge>
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">견적 완료</Badge>
      case 'rejected':
        return <Badge variant="destructive">거절됨</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '날짜 없음'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
            <p className="text-gray-600 mb-6">
              마이페이지를 이용하려면 로그인해주세요.
            </p>
            <Link href="/">
              <Button className="w-full">
                홈으로 돌아가기
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                마이페이지
              </h1>
              <p className="text-gray-600">
                견적 내역과 프로필을 관리하세요
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link href="/quote">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  <Plus className="w-4 h-4 mr-2" />
                  새 견적 요청
                </Button>
              </Link>
              
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* 사이드바 */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <Avatar className="w-20 h-20 mx-auto mb-4">
                      <AvatarImage src={user.photoURL || undefined} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-600 text-2xl">
                        {user.displayName?.[0] || user.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h3 className="text-lg font-semibold text-gray-800">
                      {user.displayName || user.email?.split('@')[0] || '사용자'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {user.email}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-medium">총 견적 요청</span>
                      </div>
                      <Badge variant="secondary">{quotes.length}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium">검토 중</span>
                      </div>
                      <Badge variant="secondary">
                        {quotes.filter(q => q.status === 'pending').length}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium">견적 완료</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {quotes.filter(q => q.status === 'approved').length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="quotes" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="quotes">견적 내역</TabsTrigger>
                  <TabsTrigger value="profile">프로필</TabsTrigger>
                </TabsList>

                <TabsContent value="quotes" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>견적 요청 내역</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-24 bg-gray-200 rounded-lg"></div>
                            </div>
                          ))}
                        </div>
                      ) : quotes.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            아직 견적 요청이 없습니다
                          </h3>
                          <p className="text-gray-600 mb-6">
                            첫 번째 맞춤 여행 견적을 요청해보세요!
                          </p>
                          <Link href="/quote">
                            <Button>
                              <Plus className="w-4 h-4 mr-2" />
                              견적 요청하기
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {quotes.map((quote) => (
                            <Card key={quote.id} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-4 mb-3">
                                      <h3 className="text-lg font-semibold text-gray-800">
                                        {quote.destination}
                                      </h3>
                                      {getStatusBadge(quote.status)}
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                      <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{quote.destination}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{quote.duration}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Users className="w-4 h-4" />
                                        <span>{quote.people}</span>
                                      </div>
                                      {quote.budget && (
                                        <div className="flex items-center space-x-2">
                                          <DollarSign className="w-4 h-4" />
                                          <span>{quote.budget}</span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <p className="text-xs text-gray-500 mt-3">
                                      요청일: {formatDate(quote.createdAt)}
                                    </p>
                                  </div>
                                  
                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                      <Eye className="w-4 h-4 mr-1" />
                                      상세보기
                                    </Button>
                                    {quote.status === 'approved' && (
                                      <Button size="sm">
                                        <MessageCircle className="w-4 h-4 mr-1" />
                                        견적 확인
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="profile" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>프로필 정보</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-gray-700">이름</label>
                          <p className="mt-1 text-gray-900">
                            {user.displayName || '설정되지 않음'}
                          </p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700">이메일</label>
                          <p className="mt-1 text-gray-900">{user.email}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700">가입일</label>
                          <p className="mt-1 text-gray-900">
                            {user.metadata?.creationTime ? 
                              new Date(user.metadata.creationTime).toLocaleDateString('ko-KR') : 
                              '알 수 없음'
                            }
                          </p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700">로그인 방법</label>
                          <p className="mt-1 text-gray-900">
                            {user.providerData[0]?.providerId === 'google.com' ? 'Google' : '이메일'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <Button variant="outline">
                          <Settings className="w-4 h-4 mr-2" />
                          프로필 수정
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 