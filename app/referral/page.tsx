'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocalAuth } from "@/hooks/useLocalAuth";
import { toast } from "sonner";
import { 
  getUserReferralStats, 
  getUserReferrals,
  ReferralStats,
  ReferralRelationship 
} from "@/lib/referral";
import {
  MapPin,
  Users,
  Star,
  Gift,
  Share2,
  TrendingUp,
  Award,
  Globe,
  Heart,
  CheckCircle,
  ArrowRight,
  Copy,
  Phone,
  Mail,
  UserPlus,
  DollarSign,
  LinkIcon,
  QrCode,
  Download,
  Facebook,
  Twitter,
  Instagram,
  Calendar,
  Eye
} from "lucide-react";
import Link from "next/link";
import { designSystem, commonClasses } from "@/lib/design-system";

export default function ReferralPage() {
  const { isAuthenticated, user } = useLocalAuth();
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    successfulReferrals: 0,
    pendingReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    level: 'bronze'
  });
  const [referrals, setReferrals] = useState<ReferralRelationship[]>([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [loading, setLoading] = useState(false);

  // 사용자별 고유 레퍼럴 코드 생성
  useEffect(() => {
    if (isAuthenticated && user) {
      // 실제로는 사용자 정보에서 레퍼럴 코드를 가져와야 함
      const userReferralCode = (user as any).referralCode || generateReferralCode(user.id || user.email || 'user');
      setReferralCode(userReferralCode);
      const baseUrl = window.location.origin;
      setReferralLink(`${baseUrl}/signup?ref=${userReferralCode}`);
      
      // 레퍼럴 통계 및 관계 데이터 로드
      loadReferralData(user.id || user.email || 'user');
    }
  }, [isAuthenticated, user]);

  // 레퍼럴 코드 생성 함수 (임시)
  const generateReferralCode = (userId: string): string => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 6);
    return `${userId.substring(0, 3)}${timestamp}${randomStr}`.toUpperCase();
  };

  // 레퍼럴 데이터 로드
  const loadReferralData = async (userId: string) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // 실제 Firebase 연동 시
      // const userStats = await getUserReferralStats(userId);
      // const userReferrals = await getUserReferrals(userId);
      
      // 데모용 데이터
      const demoStats: ReferralStats = {
        totalReferrals: 3,
        successfulReferrals: 2,
        pendingReferrals: 1,
        totalEarnings: 15000,
        pendingEarnings: 5000,
        level: 'silver'
      };
      
      const demoReferrals: ReferralRelationship[] = [
        {
          id: '1',
          referrerId: userId,
          referrerName: user?.name || '나',
          referrerEmail: user?.email || '',
          referredUserId: 'user1',
          referredUserName: '김철수',
          referredUserEmail: 'kim@example.com',
          status: 'completed',
          referralCode: referralCode,
          createdAt: new Date('2024-01-15') as any,
          updatedAt: new Date('2024-01-20') as any,
          completedAt: new Date('2024-01-20') as any,
          earnings: 10000
        },
        {
          id: '2',
          referrerId: userId,
          referrerName: user?.name || '나',
          referrerEmail: user?.email || '',
          referredUserId: 'user2',
          referredUserName: '이영희',
          referredUserEmail: 'lee@example.com',
          status: 'completed',
          referralCode: referralCode,
          createdAt: new Date('2024-01-10') as any,
          updatedAt: new Date('2024-01-15') as any,
          completedAt: new Date('2024-01-15') as any,
          earnings: 5000
        },
        {
          id: '3',
          referrerId: userId,
          referrerName: user?.name || '나',
          referrerEmail: user?.email || '',
          referredUserId: 'user3',
          referredUserName: '박민수',
          referredUserEmail: 'park@example.com',
          status: 'pending',
          referralCode: referralCode,
          createdAt: new Date('2024-01-25') as any,
          updatedAt: new Date('2024-01-25') as any
        }
      ];
      
      setStats(demoStats);
      setReferrals(demoReferrals);
    } catch (error) {
      console.error('레퍼럴 데이터 로드 오류:', error);
      toast.error('레퍼럴 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 레퍼럴 코드 복사
  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      toast.success('레퍼럴 코드가 클립보드에 복사되었습니다!');
    } catch (err) {
      toast.error('코드 복사에 실패했습니다.');
    }
  };

  // 레퍼럴 링크 복사
  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('레퍼럴 링크가 클립보드에 복사되었습니다!');
    } catch (err) {
      toast.error('링크 복사에 실패했습니다.');
    }
  };

  // 소셜 미디어 공유
  const shareToSocial = (platform: string) => {
    const text = `K-BIZ TRAVEL과 함께 특별한 여행을 시작하세요! 내 추천 코드로 가입하면 특별한 혜택을 받을 수 있어요! 🎁✈️`;
    const url = referralLink;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'kakao':
        // 카카오톡 공유 (카카오 SDK 필요)
        if (window.Kakao) {
          window.Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
              title: 'K-BIZ TRAVEL 레퍼럴 초대',
              description: text,
              imageUrl: `${window.location.origin}/og-image.jpg`,
              link: {
                mobileWebUrl: url,
                webUrl: url,
              },
            },
            buttons: [
              {
                title: '가입하기',
                link: {
                  mobileWebUrl: url,
                  webUrl: url,
                },
              },
            ],
          });
          return;
        }
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  // QR 코드 다운로드 (실제로는 QR 코드 생성 라이브러리 사용)
  const downloadQRCode = () => {
    // QR 코드 생성 및 다운로드 로직
    toast.info('QR 코드 다운로드 기능은 준비 중입니다.');
  };

  // 레벨별 색상 및 아이콘
  const getLevelInfo = (level: string) => {
    switch (level) {
      case 'bronze':
        return { color: 'text-orange-600', bgColor: 'bg-orange-100', icon: Star };
      case 'silver':
        return { color: 'text-gray-600', bgColor: 'bg-gray-100', icon: Award };
      case 'gold':
        return { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: TrendingUp };
      default:
        return { color: 'text-orange-600', bgColor: 'bg-orange-100', icon: Star };
    }
  };

  const levelInfo = getLevelInfo(stats.level);
  const LevelIcon = levelInfo.icon;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className={commonClasses.container}>
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  K-BIZ TRAVEL
                </div>
                <div className="text-sm text-gray-500">동남아 특화 맞춤여행</div>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">회사소개</Link>
              <Link href="/quote" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">견적 요청</Link>
              <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">여행 상품</Link>
              <Link href="/referral" className="text-blue-600 hover:text-blue-700 transition-colors font-medium border-b-2 border-blue-600">레퍼럴 시스템</Link>
            </nav>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 font-medium">
                    대시보드
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 font-medium">
                    로그인
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className={commonClasses.container + " relative z-10"}>
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 px-6 py-3 text-sm font-medium backdrop-blur-sm">
              🎁 레퍼럴 시스템
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              함께 성장하는<br />
              <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                상생 플랫폼
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
              친구와 함께 여행하고, 함께 보상을 받으세요!<br />
              K-BIZ TRAVEL 레퍼럴 시스템으로 특별한 혜택을 누려보세요
            </p>
          </div>
        </div>
      </section>

      {/* My Referral Section - 로그인한 사용자만 */}
      {isAuthenticated && (
        <section className="py-16 bg-white">
          <div className={commonClasses.container}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">내 레퍼럴 정보</h2>
              <p className="text-lg text-gray-600">친구를 초대하고 보상을 받아보세요!</p>
            </div>

            {/* 레벨 및 통계 정보 */}
            <div className="grid md:grid-cols-4 gap-6 mb-8 max-w-4xl mx-auto">
              <Card className="text-center p-6">
                <div className={`w-16 h-16 ${levelInfo.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <LevelIcon className={`w-8 h-8 ${levelInfo.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{stats.level.toUpperCase()} 레벨</h3>
                <p className="text-sm text-gray-600">현재 등급</p>
              </Card>

              <Card className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">{stats.totalReferrals}</h3>
                <p className="text-sm text-gray-600">총 추천 수</p>
              </Card>

              <Card className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">{stats.successfulReferrals}</h3>
                <p className="text-sm text-gray-600">성공한 추천</p>
              </Card>

              <Card className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-purple-600 mb-2">{stats.totalEarnings.toLocaleString()}원</h3>
                <p className="text-sm text-gray-600">총 수익</p>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* 레퍼럴 코드 */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-purple-600" />
                    <span>내 레퍼럴 코드</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Input 
                      value={referralCode} 
                      readOnly 
                      className="font-mono text-lg font-bold text-center"
                    />
                    <Button 
                      onClick={copyReferralCode}
                      variant="outline" 
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      복사
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    📋 <strong>레퍼럴 코드:</strong> 이 코드를 친구에게 알려주세요 (가입 시 입력)
                  </p>
                </CardContent>
              </Card>

              {/* 레퍼럴 링크 */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <LinkIcon className="w-5 h-5 text-blue-600" />
                    <span>레퍼럴 링크</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Input 
                      value={referralLink} 
                      readOnly 
                      className="text-sm"
                    />
                    <Button 
                      onClick={copyReferralLink}
                      variant="outline" 
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      복사
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    🔗 <strong>레퍼럴 링크:</strong> 이 링크를 공유하면 자동으로 추천인 연결됩니다
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => shareToSocial('kakao')}
                      size="sm"
                      className="bg-yellow-400 hover:bg-yellow-500 text-black"
                    >
                      카카오톡
                    </Button>
                    <Button 
                      onClick={() => shareToSocial('facebook')}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      페이스북
                    </Button>
                    <Button 
                      onClick={() => shareToSocial('twitter')}
                      size="sm"
                      className="bg-sky-500 hover:bg-sky-600"
                    >
                      트위터
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* QR 코드 및 추가 공유 옵션 */}
            <div className="text-center mt-8">
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => setShowQRCode(!showQRCode)}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR 코드 보기</span>
                </Button>
                <Button 
                  onClick={downloadQRCode}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>QR 코드 다운로드</span>
                </Button>
              </div>
              
              {showQRCode && (
                <div className="mt-6 p-6 bg-gray-50 rounded-2xl inline-block">
                  <div className="w-32 h-32 bg-white p-4 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <QrCode className="w-16 h-16 mx-auto mb-2" />
                      <p className="text-xs">QR 코드</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">실제 QR 코드는 준비 중입니다</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Referral List - 로그인한 사용자만 */}
                  {isAuthenticated && referrals.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className={commonClasses.container}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">내 추천 현황</h2>
              <p className="text-lg text-gray-600">추천한 친구들의 현황을 확인하세요</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <Card key={referral.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-lg">
                            {referral.referredUserName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{referral.referredUserName}</h3>
                          <p className="text-sm text-gray-600">{referral.referredUserEmail}</p>
                          <p className="text-xs text-gray-500">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {referral.createdAt?.toDate?.()?.toLocaleDateString() || '날짜 정보 없음'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="mb-2">
                          {referral.status === 'completed' ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              완료
                            </Badge>
                          ) : referral.status === 'pending' ? (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Eye className="w-3 h-3 mr-1" />
                              대기중
                            </Badge>
                          ) : (
                            <Badge variant="outline">{referral.status}</Badge>
                          )}
                        </div>
                        
                        {referral.status === 'completed' && referral.earnings && (
                          <div className="text-lg font-bold text-green-600">
                            +{referral.earnings.toLocaleString()}원
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className={commonClasses.container}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">어떻게 작동하나요?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              간단한 3단계로 레퍼럴 보상을 받을 수 있습니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Share2 className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. 링크 공유</h3>
              <p className="text-gray-600 leading-relaxed">
                내 레퍼럴 링크를 친구에게 공유하세요.<br />
                카카오톡, 페이스북, 트위터 등으로 쉽게 공유할 수 있어요
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <UserPlus className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. 친구 가입</h3>
              <p className="text-gray-600 leading-relaxed">
                친구가 레퍼럴 링크로 가입하면<br />
                자동으로 추천인이 연결됩니다
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Gift className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. 보상 받기</h3>
              <p className="text-gray-600 leading-relaxed">
                친구가 여행을 예약하면<br />
                추천인에게 특별한 보상이 지급됩니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Code Input Section */}
      <section className="py-16 bg-gray-50">
        <div className={commonClasses.container}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">추천인 코드가 있나요?</h2>
            <p className="text-lg text-gray-600 mb-8">
              친구로부터 추천받으셨다면, 가입 시 추천인 코드를 입력하세요
            </p>
            
            <Card className="p-8">
              <CardContent className="space-y-6">
                <div className="text-left">
                  <Label htmlFor="referralCode" className="text-sm font-medium text-gray-700 mb-2 block">
                    추천인 코드
                  </Label>
                  <Input
                    id="referralCode"
                    placeholder="추천인 코드를 입력하세요 (예: ABC123)"
                    className="text-center text-lg font-mono"
                  />
                </div>
                
                <div className="text-left">
                  <Label htmlFor="referralNote" className="text-sm font-medium text-gray-700 mb-2 block">
                    추천인 메모 (선택사항)
                  </Label>
                  <Textarea
                    id="referralNote"
                    placeholder="추천인에 대한 메모나 인사말을 남겨주세요"
                    rows={3}
                  />
                </div>
                
                <div className="pt-4">
                  <Link href="/signup">
                    <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                      <UserPlus className="w-5 h-5 mr-2" />
                      회원가입하고 추천인과 연결하기
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Rewards Structure */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-green-50">
        <div className={commonClasses.container}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">레퍼럴 보상 구조</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              친구를 초대할수록 더 많은 혜택을 받을 수 있습니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">브론즈 레벨</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">1-5명</div>
              <p className="text-gray-600 mb-6">친구 초대</p>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">여행 상담료 10% 할인</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">레퍼럴 보상 5,000원</span>
                </div>
              </div>
            </Card>

            <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-purple-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-purple-600 text-white px-4 py-2">인기</Badge>
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">실버 레벨</h3>
              <div className="text-4xl font-bold text-purple-600 mb-2">6-15명</div>
              <p className="text-gray-600 mb-6">친구 초대</p>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">여행 상담료 20% 할인</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">레퍼럴 보상 10,000원</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">우선 상담 서비스</span>
                </div>
              </div>
            </Card>

            <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">골드 레벨</h3>
              <div className="text-4xl font-bold text-yellow-600 mb-2">16명+</div>
              <p className="text-gray-600 mb-6">친구 초대</p>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">여행 상담료 30% 할인</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">레퍼럴 보상 15,000원</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">VIP 전용 서비스</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">연간 여행 크레딧</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className={commonClasses.container + " relative z-10"}>
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              지금 바로 레퍼럴을 시작하세요!
            </h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed mb-8">
              친구와 함께 여행하고, 함께 보상을 받는 특별한 경험을 만들어보세요
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 text-lg font-bold">
                    <TrendingUp className="w-6 h-6 mr-2" />
                    레퍼럴 현황 보기
                  </Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 text-lg font-bold">
                    <UserPlus className="w-6 h-6 mr-2" />
                    무료 회원가입
                  </Button>
                </Link>
              )}
              
              <Link href="/quote">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-bold">
                  <MapPin className="w-6 h-6 mr-2" />
                  여행 견적 요청
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-14">
        <div className={commonClasses.container}>
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                    K-BIZ TRAVEL
                  </div>
                  <p className="text-sm text-gray-400">동남아 특화 맞춤여행</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                현지 전문가와 함께하는<br />
                특별한 맞춤 여행의 새로운 기준
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-lg text-purple-400">레퍼럴 시스템</h4>
              <div className="space-y-3 text-gray-300">
                <Link href="/referral" className="block hover:text-purple-400 transition-colors">레퍼럴 현황</Link>
                <Link href="/referral" className="block hover:text-purple-400 transition-colors">보상 구조</Link>
                <Link href="/referral" className="block hover:text-purple-400 transition-colors">공유하기</Link>
                <Link href="/referral" className="block hover:text-purple-400 transition-colors">자주 묻는 질문</Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-lg text-green-400">고객지원</h4>
              <div className="space-y-3 text-gray-300">
                <Link href="#" className="block hover:text-green-400 transition-colors">고객센터</Link>
                <Link href="#" className="block hover:text-green-400 transition-colors">이용약관</Link>
                <Link href="#" className="block hover:text-green-400 transition-colors">개인정보 처리방침</Link>
                <Link href="#" className="block hover:text-green-400 transition-colors">레퍼럴 정책</Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-lg text-blue-400">연락처</h4>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="font-bold text-white">010-5940-0104</p>
                    <p className="text-sm">평일 9:00-18:00</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="font-bold text-white">help@kbiztravel.com</p>
                    <p className="text-sm">24시간 이메일 상담</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 K-BIZ TRAVEL CORP. All rights reserved.
              <span className="mx-2">|</span>
              사업자등록번호: 123-45-67890
              <span className="mx-2">|</span>
              통신판매업신고: 제2024-서울강남-1234호
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


