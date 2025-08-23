'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  BellOff, 
  Settings, 
  TestTube, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { cn } from '@/lib/utils';

interface PushNotificationSettingsProps {
  className?: string;
  showTestButtons?: boolean;
}

export function PushNotificationSettings({ 
  className,
  showTestButtons = true 
}: PushNotificationSettingsProps) {
  const {
    isSupported,
    isSubscribed,
    isLoading,
    canSubscribe,
    canUnsubscribe,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    testLocalNotification,
    requestPermission
  } = usePushNotifications();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubscribe = async () => {
    const permissionGranted = await requestPermission();
    if (permissionGranted) {
      await subscribeToPushNotifications();
    }
  };

  const handleUnsubscribe = async () => {
    await unsubscribeFromPushNotifications();
  };

  const handleTestNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
    const testData = {
      success: {
        title: '테스트 성공 알림',
        message: '푸시 알림이 정상적으로 작동합니다!',
        tag: 'test-success',
        data: { type: 'success' }
      },
      error: {
        title: '테스트 오류 알림',
        message: '이것은 오류 상황을 시뮬레이션한 알림입니다.',
        tag: 'test-error',
        data: { type: 'error' }
      },
      warning: {
        title: '테스트 경고 알림',
        message: '중요한 정보가 업데이트되었습니다.',
        tag: 'test-warning',
        data: { type: 'warning' }
      },
      info: {
        title: '테스트 정보 알림',
        message: '새로운 기능이 추가되었습니다.',
        tag: 'test-info',
        data: { type: 'info' }
      }
    };

    testLocalNotification(testData[type]);
  };

  const handleTestPaymentNotification = () => {
    testLocalNotification({
      title: '결제 완료',
      message: '베트남 하노이 여행 결제가 완료되었습니다. (₩1,200,000)',
      tag: 'payment-success',
      data: { 
        paymentId: 'test-payment-123',
        amount: 1200000,
        destination: '베트남 하노이'
      },
      actions: [
        {
          action: 'view_payment',
          title: '결제 내역 보기'
        },
        {
          action: 'contact_support',
          title: '고객 지원'
        }
      ],
      requireInteraction: true
    });
  };

  const handleTestQuoteNotification = () => {
    testLocalNotification({
      title: '견적 상태 변경',
      message: '태국 방콕 여행 견적이 검토 완료 상태로 변경되었습니다.',
      tag: 'quote-updated',
      data: { 
        quoteId: 'test-quote-456',
        status: '검토 완료',
        destination: '태국 방콕'
      },
      actions: [
        {
          action: 'view_quote',
          title: '견적 보기'
        }
      ]
    });
  };

  if (!isSupported) {
    return (
      <Card className={cn('border-orange-200 bg-orange-50', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="w-5 h-5" />
            푸시 알림을 지원하지 않습니다
          </CardTitle>
          <CardDescription className="text-orange-700">
            현재 브라우저는 푸시 알림을 지원하지 않습니다. 
            Chrome, Firefox, Safari 등의 최신 브라우저를 사용해주세요.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          푸시 알림 설정
        </CardTitle>
        <CardDescription>
          중요한 알림을 놓치지 않도록 푸시 알림을 설정하세요.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 현재 상태 */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {isSubscribed ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <div>
              <p className="font-medium">
                {isSubscribed ? '푸시 알림 활성화됨' : '푸시 알림 비활성화됨'}
              </p>
              <p className="text-sm text-gray-600">
                {isSubscribed 
                  ? '중요한 알림을 실시간으로 받을 수 있습니다.' 
                  : '알림을 받으려면 구독을 활성화하세요.'}
              </p>
            </div>
          </div>
          
          <Badge variant={isSubscribed ? 'default' : 'secondary'}>
            {isSubscribed ? '활성' : '비활성'}
          </Badge>
        </div>

        {/* 구독/해제 버튼 */}
        <div className="flex gap-3">
          {canSubscribe && (
            <Button 
              onClick={handleSubscribe} 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  처리 중...
                </div>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  푸시 알림 구독
                </>
              )}
            </Button>
          )}
          
          {canUnsubscribe && (
            <Button 
              variant="outline" 
              onClick={handleUnsubscribe}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  처리 중...
                </div>
              ) : (
                <>
                  <BellOff className="w-4 h-4 mr-2" />
                  구독 해제
                </>
              )}
            </Button>
          )}
        </div>

        {/* 고급 설정 토글 */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            고급 설정
          </Button>
        </div>

        {/* 고급 설정 */}
        {showAdvanced && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">알림 유형별 설정</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="payment-notifications" className="text-sm">
                  결제 관련 알림
                </Label>
                <Switch id="payment-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="quote-notifications" className="text-sm">
                  견적 관련 알림
                </Label>
                <Switch id="quote-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="promotion-notifications" className="text-sm">
                  프로모션 알림
                </Label>
                <Switch id="promotion-notifications" />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="news-notifications" className="text-sm">
                  뉴스 및 업데이트
                </Label>
                <Switch id="news-notifications" />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm">알림 시간 설정</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="quiet-hours" className="text-sm">
                  방해 금지 시간 (22:00 ~ 08:00)
                </Label>
                <Switch id="quiet-hours" />
              </div>
            </div>
          </div>
        )}

        {/* 테스트 버튼들 */}
        {showTestButtons && (
          <>
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TestTube className="w-4 h-4 text-blue-600" />
                <h4 className="font-medium text-sm">테스트 알림</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestNotification('success')}
                  className="text-green-700 border-green-200 hover:bg-green-50"
                >
                  성공 알림
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestNotification('error')}
                  className="text-red-700 border-red-200 hover:bg-red-50"
                >
                  오류 알림
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestNotification('warning')}
                  className="text-yellow-700 border-yellow-200 hover:bg-yellow-50"
                >
                  경고 알림
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestNotification('info')}
                  className="text-blue-700 border-blue-200 hover:bg-blue-50"
                >
                  정보 알림
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestPaymentNotification}
                  className="text-purple-700 border-purple-200 hover:bg-purple-50"
                >
                  결제 알림 테스트
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestQuoteNotification}
                  className="text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                >
                  견적 알림 테스트
                </Button>
              </div>
            </div>
          </>
        )}

        {/* 정보 */}
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">푸시 알림이란?</p>
            <p className="text-xs leading-relaxed">
              브라우저가 닫혀있거나 다른 탭에 있을 때도 중요한 알림을 받을 수 있습니다. 
              결제 완료, 견적 상태 변경, 특별한 프로모션 등의 알림을 실시간으로 받아보세요.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
