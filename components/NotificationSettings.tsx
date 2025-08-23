'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Settings, 
  Save,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationPreferences {
  pushNotifications: boolean;
  emailNotifications: boolean;
  paymentNotifications: boolean;
  quoteNotifications: boolean;
  refundNotifications: boolean;
  adminNotifications: boolean;
  marketingNotifications: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

// localStorage 안전하게 사용하는 헬퍼 함수
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
};

export function NotificationSettings() {
  const { user } = useLocalAuth();
  const { success, error: showError } = useNotifications();
  
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    pushNotifications: true,
    emailNotifications: true,
    paymentNotifications: true,
    quoteNotifications: true,
    refundNotifications: true,
    adminNotifications: true,
    marketingNotifications: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserPreferences();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    try {
      // 로컬 스토리지에서 사용자 설정 로드
      const saved = safeLocalStorage.getItem(`notificationPreferences_${user?.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences(parsed);
      }
    } catch (error) {
      console.error('설정 로드 실패:', error);
    }
  };

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleQuietHoursChange = (key: keyof NotificationPreferences['quietHours'], value: any) => {
    setPreferences(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const savePreferences = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // 로컬 스토리지에 저장
      safeLocalStorage.setItem(`notificationPreferences_${user.id}`, JSON.stringify(preferences));
      
      // TODO: 서버에 설정 저장
      // await updateUserPreferences(user.id, preferences);
      
      setHasChanges(false);
      success('설정 저장', '알림 설정이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('설정 저장 실패:', error);
      showError('설정 저장 실패', '알림 설정 저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    const defaults: NotificationPreferences = {
      pushNotifications: true,
      emailNotifications: true,
      paymentNotifications: true,
      quoteNotifications: true,
      refundNotifications: true,
      adminNotifications: true,
      marketingNotifications: false,
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      }
    };
    
    setPreferences(defaults);
    setHasChanges(true);
  };

  const getNotificationStatus = () => {
    const totalEnabled = [
      preferences.pushNotifications,
      preferences.emailNotifications,
      preferences.paymentNotifications,
      preferences.quoteNotifications,
      preferences.refundNotifications,
      preferences.adminNotifications
    ].filter(Boolean).length;
    
    if (totalEnabled === 0) return { status: 'disabled', text: '모든 알림 비활성화', color: 'bg-red-100 text-red-800' };
    if (totalEnabled <= 3) return { status: 'minimal', text: '최소 알림', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'full', text: '전체 알림', color: 'bg-green-100 text-green-800' };
  };

  const notificationStatus = getNotificationStatus();

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">로그인이 필요합니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 상태 요약 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            알림 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={notificationStatus.color}>
                {notificationStatus.text}
              </Badge>
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  변경사항 있음
                </Badge>
              )}
              <Button
                onClick={savePreferences}
                disabled={!hasChanges || isLoading}
                size="sm"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isLoading ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 기본 알림 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            기본 알림 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 알림 채널 */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">알림 채널</h4>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label htmlFor="pushNotifications" className="font-medium">
                      푸시 알림
                    </Label>
                    <p className="text-sm text-gray-600">브라우저 푸시 알림</p>
                  </div>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={preferences.pushNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('pushNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <Label htmlFor="emailNotifications" className="font-medium">
                      이메일 알림
                    </Label>
                    <p className="text-sm text-gray-600">중요한 알림을 이메일로 전송</p>
                  </div>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* 알림 유형 */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">알림 유형</h4>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <div>
                    <Label htmlFor="paymentNotifications" className="font-medium">
                      결제 알림
                    </Label>
                    <p className="text-sm text-gray-600">결제 성공, 실패, 환불 등</p>
                  </div>
                </div>
                <Switch
                  id="paymentNotifications"
                  checked={preferences.paymentNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('paymentNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label htmlFor="quoteNotifications" className="font-medium">
                      견적 알림
                    </Label>
                    <p className="text-sm text-gray-600">견적 제출, 승인, 거절 등</p>
                  </div>
                </div>
                <Switch
                  id="quoteNotifications"
                  checked={preferences.quoteNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('quoteNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <div>
                    <Label htmlFor="refundNotifications" className="font-medium">
                      환불 알림
                    </Label>
                    <p className="text-sm text-gray-600">환불 요청, 처리 완료 등</p>
                  </div>
                </div>
                <Switch
                  id="refundNotifications"
                  checked={preferences.refundNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('refundNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-purple-600" />
                  <div>
                    <Label htmlFor="adminNotifications" className="font-medium">
                      관리자 알림
                    </Label>
                    <p className="text-sm text-gray-600">시스템 공지, 업데이트 등</p>
                  </div>
                </div>
                <Switch
                  id="adminNotifications"
                  checked={preferences.adminNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('adminNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <Label htmlFor="marketingNotifications" className="font-medium">
                      마케팅 알림
                    </Label>
                    <p className="text-sm text-gray-600">프로모션, 할인 정보 등</p>
                  </div>
                </div>
                <Switch
                  id="marketingNotifications"
                  checked={preferences.marketingNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('marketingNotifications', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* 조용한 시간 설정 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">조용한 시간</h4>
                <p className="text-sm text-gray-600">지정된 시간에는 알림을 보내지 않습니다</p>
              </div>
              <Switch
                checked={preferences.quietHours.enabled}
                onCheckedChange={(checked) => handleQuietHoursChange('enabled', checked)}
              />
            </div>
            
            {preferences.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quietStart" className="text-sm font-medium">
                    시작 시간
                  </Label>
                  <input
                    id="quietStart"
                    type="time"
                    value={preferences.quietHours.start}
                    onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="quietEnd" className="text-sm font-medium">
                    종료 시간
                  </Label>
                  <input
                    id="quietEnd"
                    type="time"
                    value={preferences.quietHours.end}
                    onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 액션 버튼 */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={resetToDefaults}
          disabled={isLoading}
        >
          기본값으로 복원
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadUserPreferences}
            disabled={isLoading}
          >
            변경사항 취소
          </Button>
          
          <Button
            onClick={savePreferences}
            disabled={!hasChanges || isLoading}
          >
            {isLoading ? '저장 중...' : '설정 저장'}
          </Button>
        </div>
      </div>
    </div>
  );
}
