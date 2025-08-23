'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNotifications } from './useNotifications';
import { useLocalAuth } from './useLocalAuth';

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface PushNotificationOptions {
  title: string;
  message: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
}

// 브라우저 환경 체크 헬퍼 함수
const isBrowser = typeof window !== 'undefined';
const isServiceWorkerSupported = isBrowser && 'serviceWorker' in navigator;
const isPushManagerSupported = isBrowser && 'PushManager' in window;

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: showError } = useNotifications();
  
  // useLocalAuth에서 user 정보 가져오기
  const { user } = useLocalAuth();

  // 브라우저 지원 여부 확인
  useEffect(() => {
    if (!isBrowser) return;
    
    const checkSupport = () => {
      const supported = isServiceWorkerSupported && isPushManagerSupported;
      setIsSupported(supported);
      
      if (supported) {
        checkSubscriptionStatus();
      }
    };

    checkSupport();
  }, []);

  // 구독 상태 확인
  const checkSubscriptionStatus = useCallback(async () => {
    if (!isBrowser || !isServiceWorkerSupported) return;
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      
      setIsSubscribed(!!existingSubscription);
      setSubscription(existingSubscription);
    } catch (err) {
      console.error('구독 상태 확인 실패:', err);
    }
  }, []);

  // 서비스 워커 등록
  const registerServiceWorker = useCallback(async () => {
    if (!isBrowser || !isServiceWorkerSupported) {
      throw new Error('서비스 워커를 지원하지 않습니다.');
    }
    
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('서비스 워커 등록 성공:', registration);
      return registration;
    } catch (err) {
      console.error('서비스 워커 등록 실패:', err);
      throw err;
    }
  }, []);

  // 푸시 알림 구독
  const subscribeToPushNotifications = useCallback(async () => {
    if (!isSupported) {
      showError('푸시 알림', '브라우저가 푸시 알림을 지원하지 않습니다.');
      return false;
    }

    setIsLoading(true);
    
    try {
      // 서비스 워커 등록
      const registration = await registerServiceWorker();
      
      // 기존 구독 확인
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        setIsSubscribed(true);
        setSubscription(existingSubscription);
        success('푸시 알림', '이미 구독되어 있습니다.');
        return true;
      }

      // VAPID 공개키 (실제 운영에서는 환경변수에서 가져와야 함)
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 
        'BEl62iUYgUivxIkv69yViEuiBIa1HI2lKdDpDpB4lta5H5u_tLguR54qKkPqcAlZXq3_dbV2NGqxX0Pcn1GXrs';
      
      // 구독 생성
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });

      // 구독 정보를 서버에 저장 (실제 구현에서는 API 호출)
      await saveSubscriptionToServer(newSubscription);

      setIsSubscribed(true);
      setSubscription(newSubscription);
      success('푸시 알림', '푸시 알림 구독이 완료되었습니다.');
      
      return true;
    } catch (err) {
      console.error('푸시 알림 구독 실패:', err);
      showError('푸시 알림', '구독에 실패했습니다. 권한을 확인해주세요.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, showError, success]);

  // 푸시 알림 구독 해제
  const unsubscribeFromPushNotifications = useCallback(async () => {
    if (!subscription) {
      showError('푸시 알림', '구독 정보를 찾을 수 없습니다.');
      return false;
    }

    setIsLoading(true);
    
    try {
      // 구독 해제
      await subscription.unsubscribe();
      
      // 서버에서 구독 정보 삭제 (실제 구현에서는 API 호출)
      await deleteSubscriptionFromServer(subscription);

      setIsSubscribed(false);
      setSubscription(null);
      success('푸시 알림', '푸시 알림 구독이 해제되었습니다.');
      
      return true;
    } catch (err) {
      console.error('푸시 알림 구독 해제 실패:', err);
      showError('푸시 알림', '구독 해제에 실패했습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [subscription, showError, success]);

  // 로컬 푸시 알림 테스트 (개발용)
  const testLocalNotification = useCallback(async (options: PushNotificationOptions) => {
    if (!isSupported) {
      showError('푸시 알림', '브라우저가 푸시 알림을 지원하지 않습니다.');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      await registration.showNotification(options.title, {
        body: options.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: options.tag || 'test',
        data: options.data || {},
        requireInteraction: options.requireInteraction || false,
        silent: false
      });

      success('푸시 알림', '테스트 알림이 전송되었습니다.');
    } catch (err) {
      console.error('로컬 알림 테스트 실패:', err);
      showError('푸시 알림', '테스트 알림 전송에 실패했습니다.');
    }
  }, [isSupported, showError, success]);

  // 권한 요청
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      showError('푸시 알림', '브라우저가 푸시 알림을 지원하지 않습니다.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        success('푸시 알림', '알림 권한이 허용되었습니다.');
        return true;
      } else if (permission === 'denied') {
        showError('푸시 알림', '알림 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.');
        return false;
      } else {
        showError('푸시 알림', '알림 권한이 필요합니다.');
        return false;
      }
    } catch (err) {
      console.error('권한 요청 실패:', err);
      showError('푸시 알림', '권한 요청에 실패했습니다.');
      return false;
    }
  }, [isSupported, showError, success]);

  // 구독 정보를 서버에 저장 (실제 구현에서는 API 호출)
  const saveSubscriptionToServer = async (subscription: PushSubscription) => {
    try {
      // 실제 API 호출 수행
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: btoa(String.fromCharCode.apply(null, 
              Array.from(new Uint8Array(subscription.getKey('p256dh') || new ArrayBuffer(0))))),
            auth: btoa(String.fromCharCode.apply(null, 
              Array.from(new Uint8Array(subscription.getKey('auth') || new ArrayBuffer(0)))))
          },
          userEmail: user?.email,
          userId: user?.id
        })
      });

      if (!response.ok) {
        throw new Error('서버에 구독 정보 저장에 실패했습니다.');
      }

      const result = await response.json();
      console.log('구독 정보가 서버에 저장되었습니다:', result);
      
      // 로컬 스토리지에도 백업 저장
      const subscriptionData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode.apply(null, 
            Array.from(new Uint8Array(subscription.getKey('p256dh') || new ArrayBuffer(0))))),
          auth: btoa(String.fromCharCode.apply(null, 
            Array.from(new Uint8Array(subscription.getKey('auth') || new ArrayBuffer(0)))))
        }
      };
      
      localStorage.setItem('pushSubscription', JSON.stringify(subscriptionData));
    } catch (err) {
      console.error('구독 정보 저장 실패:', err);
      throw err;
    }
  };

  // 서버에서 구독 정보 삭제 (실제 구현에서는 API 호출)
  const deleteSubscriptionFromServer = async (subscription: PushSubscription) => {
    try {
      // 실제 API 호출 수행
      const response = await fetch('/api/push/unsubscribe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          endpoint: subscription.endpoint,
          userEmail: user?.email,
          userId: user?.id
        })
      });

      if (!response.ok) {
        throw new Error('서버에서 구독 정보 삭제에 실패했습니다.');
      }

      const result = await response.json();
      console.log('구독 정보가 서버에서 삭제되었습니다:', result);
      
      // 로컬 스토리지에서도 삭제
      localStorage.removeItem('pushSubscription');
    } catch (err) {
      console.error('구독 정보 삭제 실패:', err);
      throw err;
    }
  };

  return {
    // 상태
    isSupported,
    isSubscribed,
    subscription,
    isLoading,
    
    // 메서드
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    testLocalNotification,
    requestPermission,
    checkSubscriptionStatus,
    
    // 유틸리티
    canSubscribe: isSupported && !isSubscribed,
    canUnsubscribe: isSupported && isSubscribed,
  };
}
