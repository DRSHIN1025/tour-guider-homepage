'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Gift, Users } from "lucide-react";
import { UserSocialLogin } from "@/components/UserSocialLogin";
import Link from "next/link";
import { toast } from "sonner";

interface ReferralInfo {
  code: string;
  referrerName?: string;
  referrerEmail?: string;
}

function UserSignupContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });
  const [error, setError] = useState('');
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);
  const [referralValid, setReferralValid] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 레퍼럴 코드 자동 감지
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode }));
      validateReferralCode(refCode);
      toast.success(`추천인 코드가 감지되었습니다: ${refCode}`);
    }
  }, [searchParams]);

  // 레퍼럴 코드 유효성 검증
  const validateReferralCode = async (code: string) => {
    if (!code.trim()) {
      setReferralValid(false);
      setReferralInfo(null);
      return;
    }

    try {
      // 실제로는 Firebase에서 추천인 정보를 조회해야 함
      // 여기서는 데모용으로 가상의 추천인 정보를 생성
      const mockReferrer = {
        code: code,
        referrerName: `추천인${code.substring(0, 3)}`,
        referrerEmail: `referrer_${code}@example.com`
      };

      setReferralInfo(mockReferrer);
      setReferralValid(true);
      
      // Firebase 연동 시 실제 코드:
      // const referrerDoc = await getDoc(doc(db, 'users', code));
      // if (referrerDoc.exists()) {
      //   setReferralInfo({
      //     code: code,
      //     referrerName: referrerDoc.data().name,
      //     referrerEmail: referrerDoc.data().email
      //   });
      //   setReferralValid(true);
      // } else {
      //   setReferralValid(false);
      //   setReferralInfo(null);
      // }
    } catch (error) {
      console.error('레퍼럴 코드 검증 오류:', error);
      setReferralValid(false);
      setReferralInfo(null);
    }
  };

  // 레퍼럴 코드 입력 시 검증
  const handleReferralCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setFormData(prev => ({ ...prev, referralCode: code }));
    
    if (code.trim()) {
      validateReferralCode(code);
    } else {
      setReferralValid(false);
      setReferralInfo(null);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.name && formData.email && formData.password) {
      const userData = {
        id: 'user-' + Date.now(),
        name: formData.name,
        nickname: formData.name,
        email: formData.email,
        loginType: 'email',
        referralCode: formData.referralCode || null,
        referrerId: referralInfo?.code || null,
        referrerName: referralInfo?.referrerName || null,
        referrerEmail: referralInfo?.referrerEmail || null,
        createdAt: new Date().toISOString()
      };

      // 레퍼럴 정보가 있으면 저장
      if (referralInfo && referralValid) {
        // Firebase에 레퍼럴 관계 저장
        // addDoc(collection(db, 'referrals'), {
        //   referrerId: referralInfo.code,
        //   referredUserId: userData.id,
        //   referredUserName: userData.name,
        //   referredUserEmail: userData.email,
        //   status: 'pending',
        //   createdAt: serverTimestamp()
        // });
        
        toast.success(`${referralInfo.referrerName}님의 추천으로 가입되었습니다!`);
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('userAuth', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      alert('회원가입이 완료되었습니다! 환영합니다.');
      router.push('/');
    } else {
      setError('모든 필드를 입력해주세요.');
    }
  };

  const handleSocialSuccess = (user: any) => {
    // 소셜 로그인 시에도 레퍼럴 정보 처리
    if (referralInfo && referralValid) {
      const userDataWithReferral = {
        ...user,
        referralCode: formData.referralCode,
        referrerId: referralInfo.code,
        referrerName: referralInfo.referrerName,
        referrerEmail: referralInfo.referrerEmail
      };
      
      // Firebase에 레퍼럴 관계 저장
      // addDoc(collection(db, 'referrals'), {
      //   referrerId: referralInfo.code,
      //   referredUserId: user.uid,
      //   referredUserName: user.displayName || user.email?.split('@')[0],
      //   referredUserEmail: user.email,
      //   status: 'pending',
      //   createdAt: serverTimestamp()
      // });
      
      toast.success(`${referralInfo.referrerName}님의 추천으로 가입되었습니다!`);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('userAuth', 'true');
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    alert('회원가입이 완료되었습니다! 환영합니다.');
    router.push('/');
  };

  const handleSocialError = (error: any) => {
    setError('소셜 회원가입에 실패했습니다. 다시 시도해주세요.');
    console.error('소셜 회원가입 오류:', error);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F5EF" }}>
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-natural-beige">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#2D5C4D" }}
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold" style={{ color: "#3A3A3A" }}>
                투어가이더
              </span>
              <p className="text-xs text-gray-500">tourguider.com</p>
            </div>
          </Link>
        </div>
      </header>

      {/* 회원가입 폼 */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold" style={{ color: "#3A3A3A" }}>
              투어가이더 회원가입
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              간편하게 가입하고 맞춤 여행을 시작하세요
            </p>
            
            {/* 레퍼럴 정보 표시 */}
            {referralInfo && referralValid && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">추천인 코드 감지됨</span>
                </div>
                <div className="mt-2 text-xs text-green-600">
                  <p><strong>추천인:</strong> {referralInfo.referrerName}</p>
                  <p><strong>코드:</strong> {referralInfo.code}</p>
                </div>
                <Badge className="mt-2 bg-green-100 text-green-800 text-xs">
                  <Gift className="w-3 h-3 mr-1" />
                  추천인 혜택 적용
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 소셜 회원가입 버튼들 */}
            <div className="space-y-3">
              <UserSocialLogin 
                onSuccess={handleSocialSuccess}
                onError={handleSocialError}
              />
            </div>

            <Separator className="my-4">
              <span className="px-2 text-sm text-gray-500 bg-white">또는</span>
            </Separator>

            {/* 이메일 회원가입 폼 */}
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  이름 *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="이름을 입력하세요"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  이메일 *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="이메일을 입력하세요"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  비밀번호 *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="비밀번호를 입력하세요"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  비밀번호 확인 *
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="비밀번호를 다시 입력하세요"
                  className="mt-1"
                  required
                />
              </div>

              {/* 레퍼럴 코드 입력 필드 */}
              <div>
                <Label htmlFor="referralCode" className="text-sm font-medium text-gray-700">
                  추천인 코드 (선택사항)
                </Label>
                <Input
                  id="referralCode"
                  type="text"
                  value={formData.referralCode}
                  onChange={handleReferralCodeChange}
                  placeholder="추천인 코드를 입력하세요"
                  className="mt-1"
                />
                {formData.referralCode && !referralValid && (
                  <p className="mt-1 text-xs text-red-600">
                    유효하지 않은 추천인 코드입니다.
                  </p>
                )}
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full"
                style={{ backgroundColor: "#2D5C4D" }}
              >
                회원가입
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                이미 계정이 있으신가요?{' '}
                <Link href="/login" className="text-blue-600 hover:underline">
                  로그인하기
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function UserSignup() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">회원가입 페이지를 로딩하는 중...</p>
        </div>
      </div>
    }>
      <UserSignupContent />
    </Suspense>
  );
} 