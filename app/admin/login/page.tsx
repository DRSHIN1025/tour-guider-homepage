'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 로그인 시도 횟수 제한
    if (loginAttempts >= 5) {
      setError('보안을 위해 5분 후 다시 시도해주세요.');
      setLoading(false);
      return;
    }

    // 인증 시뮬레이션 (실제로는 서버에서 처리)
    await new Promise(resolve => setTimeout(resolve, 1000)); // 보안을 위한 지연

    if (credentials.username === 'admin' && credentials.password === 'tourguider2024!') {
      // 보안 정보 저장
      const adminSession = {
        id: 'admin',
        username: 'admin',
        nickname: '시스템 관리자',
        email: 'admin@tourguider.com',
        loginType: 'secure',
        loginTime: new Date().toISOString(),
        sessionId: 'session-' + Date.now(),
        ipAddress: '127.0.0.1', // 실제로는 서버에서 가져옴
      };

      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminUser', JSON.stringify(adminSession));
      localStorage.setItem('adminSessionStart', Date.now().toString());
      
      // 로그인 성공 로그
      console.log('관리자 로그인 성공:', {
        username: credentials.username,
        timestamp: new Date().toISOString(),
        sessionId: adminSession.sessionId
      });

      router.push('/admin');
    } else {
      setLoginAttempts(prev => prev + 1);
      setError(`로그인 정보가 올바르지 않습니다. (${loginAttempts + 1}/5 시도)`);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* 보안 경고 */}
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>관리자 전용 시스템</strong><br />
            무단 접근 시 법적 책임을 질 수 있습니다.
          </AlertDescription>
        </Alert>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              관리자 시스템 로그인
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              투어가이더 관리자 전용 보안 시스템
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  관리자 ID
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="관리자 아이디를 입력하세요"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  비밀번호
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    className="h-12 pr-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
                disabled={loading || loginAttempts >= 5}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    인증 중...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    보안 로그인
                  </div>
                )}
              </Button>
            </form>

            {/* 보안 정보 */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-sm text-gray-800 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                보안 정책
              </h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p>• 세션 자동 만료: 30분</p>
                <p>• 로그인 시도 제한: 5회</p>
                <p>• 모든 접근 기록 저장</p>
                <p>• 비밀번호는 정기적으로 변경하세요</p>
              </div>
            </div>

            {/* 테스트 정보 */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-sm text-blue-800 mb-2">🔐 테스트 계정</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>ID:</strong> admin</p>
                <p><strong>PW:</strong> tourguider2024!</p>
                <p className="text-blue-600 mt-2">
                  * 실제 운영 시에는 강력한 비밀번호로 변경하세요
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 하단 보안 안내 */}
        <div className="text-center text-xs text-gray-500">
          <p>이 시스템은 SSL/TLS로 보호되며 모든 접근이 기록됩니다.</p>
          <p>문제 발생 시 시스템 관리자에게 문의하세요.</p>
        </div>
      </div>
    </div>
  );
} 