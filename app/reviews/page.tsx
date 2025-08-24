"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  Heart, 
  MessageCircle, 
  Plus,
  Loader2,
  Quote
} from "lucide-react"
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"

interface Review {
  id: string
  userName: string
  userEmail: string
  destination: string
  travelDate: string
  people: string
  rating: number
  title: string
  content: string
  highlight: string
  createdAt: any
}

export default function ReviewsPage() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    destination: '',
    travelDate: '',
    people: '',
    rating: 5,
    title: '',
    content: '',
    highlight: ''
  })

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      let reviewsData: Review[] = []
      
      if (db) {
        const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)
        reviewsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Review[]
      } else {
        // Firebase가 없을 때 임시 데이터 또는 빈 배열
        reviewsData = []
      }
      
      setReviews(reviewsData)
    } catch (error) {
      console.error('리뷰 조회 오류:', error)
      toast.error('리뷰를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('로그인이 필요합니다.')
      return
    }

    if (!formData.destination || !formData.title || !formData.content) {
      toast.error('필수 항목을 모두 입력해주세요.')
      return
    }

    setSubmitting(true)

    try {
      const reviewData = {
        ...formData,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || '익명',
        userEmail: user.email,
        createdAt: db ? serverTimestamp() : new Date().toISOString()
      }

      if (db) {
        await addDoc(collection(db, 'reviews'), reviewData)
        toast.success('리뷰가 성공적으로 등록되었습니다!')
      } else {
        // Firebase가 없을 때 로컬 저장소에 임시 저장
        const tempReviews = JSON.parse(localStorage.getItem('tempReviews') || '[]')
        const newReview = { ...reviewData, id: `temp_${Date.now()}`, createdAt: new Date().toISOString() }
        tempReviews.push(newReview)
        localStorage.setItem('tempReviews', JSON.stringify(tempReviews))
        toast.success('리뷰가 임시 저장되었습니다!')
      }
      setIsDialogOpen(false)
      setFormData({
        destination: '',
        travelDate: '',
        people: '',
        rating: 5,
        title: '',
        content: '',
        highlight: ''
      })
      fetchReviews() // 리뷰 목록 새로고침
    } catch (error) {
      console.error('리뷰 등록 오류:', error)
      toast.error('리뷰 등록 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '날짜 없음'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                실제 고객들의
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                생생한 여행 이야기
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light mb-8">
              5,000여 명의 고객이 경험한 특별한 여행의 순간들을 만나보세요
            </p>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg">
                  <Plus className="w-5 h-5 mr-2" />
                  나의 여행 후기 작성하기
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center">
                    여행 후기 작성
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">여행지 *</label>
                      <Input
                        placeholder="베트남 다낭, 태국 방콕..."
                        value={formData.destination}
                        onChange={(e) => handleInputChange('destination', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">여행 기간</label>
                      <Input
                        placeholder="2024년 3월, 4박5일..."
                        value={formData.travelDate}
                        onChange={(e) => handleInputChange('travelDate', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">인원</label>
                      <Input
                        placeholder="성인 2명, 아동 1명..."
                        value={formData.people}
                        onChange={(e) => handleInputChange('people', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">만족도 *</label>
                      <div className="flex items-center space-x-2">
                        {renderStars(formData.rating)}
                        <span className="text-sm text-gray-600 ml-2">
                          {formData.rating}/5
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleInputChange('rating', star)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= formData.rating 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">제목 *</label>
                    <Input
                      placeholder="신혼여행으로 완벽했어요!"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">여행 후기 *</label>
                    <Textarea
                      placeholder="여행 중 가장 인상 깊었던 순간이나 추천하고 싶은 장소, 가이드님의 도움 등 자유롭게 작성해주세요..."
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      rows={6}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">여행 스타일</label>
                    <Select value={formData.highlight} onValueChange={(value) => handleInputChange('highlight', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="여행 스타일을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="로맨틱 여행">로맨틱 여행</SelectItem>
                        <SelectItem value="효도 여행">효도 여행</SelectItem>
                        <SelectItem value="가족 여행">가족 여행</SelectItem>
                        <SelectItem value="혼자 여행">혼자 여행</SelectItem>
                        <SelectItem value="친구 여행">친구 여행</SelectItem>
                        <SelectItem value="휴양 여행">휴양 여행</SelectItem>
                        <SelectItem value="관광 여행">관광 여행</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        등록 중...
                      </>
                    ) : (
                      '리뷰 등록하기'
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* 리뷰 목록 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // 로딩 스켈레톤
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                  </CardContent>
                </Card>
              ))
            ) : reviews.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Quote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  아직 등록된 리뷰가 없습니다
                </h3>
                <p className="text-gray-600">
                  첫 번째 여행 후기를 작성해보세요!
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-emerald-100 text-emerald-600">
                            {review.userName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-800">
                            {review.userName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {review.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {review.content}
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{review.destination}</span>
                      </div>
                      {review.travelDate && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{review.travelDate}</span>
                        </div>
                      )}
                      {review.people && (
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{review.people}</span>
                        </div>
                      )}
                      {review.highlight && (
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4" />
                          <span>{review.highlight}</span>
                        </div>
                      )}
                    </div>

                    {review.highlight && (
                      <Badge className="bg-emerald-100 text-emerald-700">
                        #{review.highlight}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* 통계 섹션 */}
          {reviews.length > 0 && (
            <div className="mt-16">
              <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="text-3xl font-bold mb-2">
                        {reviews.length}
                      </div>
                      <p className="text-emerald-100">총 리뷰 수</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold mb-2">
                        {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
                      </div>
                      <p className="text-emerald-100">평균 평점</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold mb-2">
                        {new Set(reviews.map(r => r.destination)).size}
                      </div>
                      <p className="text-emerald-100">여행지 수</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 