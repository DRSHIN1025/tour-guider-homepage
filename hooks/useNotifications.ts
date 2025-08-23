'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';

interface NotificationOptions {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface EmailNotificationOptions {
  type: 'payment_success' | 'payment_failed' | 'quote_submitted' | 'quote_approved' | 'quote_rejected' | 'refund_requested' | 'refund_processed' | 'admin_notification';
  title: string;
  message: string;
  userEmail: string;
  userName?: string;
  userId?: string;
  data?: any;
  priority?: 'low' | 'normal' | 'high';
  scheduleAt?: string;
}

export function useNotifications() {
  const success = useCallback((title: string, message: string, options?: Partial<NotificationOptions>) => {
    toast.success(title, {
      description: message,
      duration: options?.duration || 5000,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  }, []);

  const error = useCallback((title: string, message: string, options?: Partial<NotificationOptions>) => {
    toast.error(title, {
      description: message,
      duration: options?.duration || 8000,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  }, []);

  const warning = useCallback((title: string, message: string, options?: Partial<NotificationOptions>) => {
    toast.warning(title, {
      description: message,
      duration: options?.duration || 6000,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  }, []);

  const info = useCallback((title: string, message: string, options?: Partial<NotificationOptions>) => {
    toast.info(title, {
      description: message,
      duration: options?.duration || 4000,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  }, []);

  // 이메일 알림 전송
  const sendEmailNotification = useCallback(async (options: EmailNotificationOptions) => {
    try {
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '이메일 알림 전송에 실패했습니다.');
      }

      const result = await response.json();
      console.log('이메일 알림 전송 성공:', result);
      return result;
    } catch (error) {
      console.error('이메일 알림 전송 오류:', error);
      throw error;
    }
  }, []);

  // 결제 성공 알림 (푸시 + 이메일)
  const paymentSuccess = useCallback(async (
    userEmail: string, 
    userName?: string, 
    userId?: string, 
    amount?: string, 
    serviceName?: string
  ) => {
    const title = '결제 완료';
    const message = `결제가 성공적으로 완료되었습니다. (${amount || '확인 중'})`;
    
    // 푸시 알림 표시
    success(title, message);
    
    // 이메일 알림 전송
    try {
      await sendEmailNotification({
        type: 'payment_success',
        title: '🎉 결제가 완료되었습니다!',
        message: '투어가이더 상담 서비스 결제가 성공적으로 완료되었습니다.',
        userEmail,
        userName,
        userId,
        data: { amount, serviceName }
      });
    } catch (error) {
      console.error('이메일 알림 전송 실패:', error);
      // 이메일 실패는 사용자에게 표시하지 않음 (푸시 알림은 성공했으므로)
    }
  }, [success, sendEmailNotification]);

  // 견적 제출 알림 (푸시 + 이메일)
  const quoteSubmitted = useCallback(async (
    userEmail: string, 
    userName?: string, 
    userId?: string
  ) => {
    const title = '견적 요청 접수';
    const message = '견적 요청이 성공적으로 접수되었습니다.';
    
    // 푸시 알림 표시
    success(title, message);
    
    // 이메일 알림 전송
    try {
      await sendEmailNotification({
        type: 'quote_submitted',
        title: '📋 견적 요청이 접수되었습니다',
        message: '견적 요청이 성공적으로 접수되었습니다. 전문가가 검토한 후 빠른 시일 내에 연락드리겠습니다.',
        userEmail,
        userName,
        userId
      });
    } catch (error) {
      console.error('이메일 알림 전송 실패:', error);
    }
  }, [success, sendEmailNotification]);

  // 견적 승인 알림 (푸시 + 이메일)
  const quoteApproved = useCallback(async (
    userEmail: string, 
    userName?: string, 
    userId?: string
  ) => {
    const title = '견적 승인';
    const message = '축하합니다! 견적 요청이 승인되었습니다.';
    
    // 푸시 알림 표시
    success(title, message);
    
    // 이메일 알림 전송
    try {
      await sendEmailNotification({
        type: 'quote_approved',
        title: '✅ 견적 요청이 승인되었습니다!',
        message: '축하합니다! 견적 요청이 승인되었습니다. 결제를 완료하시면 상담 서비스를 이용하실 수 있습니다.',
        userEmail,
        userName,
        userId
      });
    } catch (error) {
      console.error('이메일 알림 전송 실패:', error);
    }
  }, [success, sendEmailNotification]);

  // 결제 실패 알림 (푸시 + 이메일)
  const paymentFailed = useCallback(async (
    userEmail: string, 
    userName?: string, 
    userId?: string, 
    reason?: string
  ) => {
    const title = '결제 실패';
    const message = `결제 처리에 실패했습니다. (${reason || '알 수 없는 오류'})`;
    
    // 푸시 알림 표시
    error(title, message);
    
    // 이메일 알림 전송
    try {
      await sendEmailNotification({
        type: 'payment_failed',
        title: '❌ 결제 처리에 실패했습니다',
        message: '결제 처리 중 오류가 발생했습니다. 다시 시도하거나 다른 결제 방법을 이용해주세요.',
        userEmail,
        userName,
        userId,
        data: { reason }
      });
    } catch (error) {
      console.error('이메일 알림 전송 실패:', error);
    }
  }, [error, sendEmailNotification]);

  // 환불 처리 완료 알림 (푸시 + 이메일)
  const refundProcessed = useCallback(async (
    userEmail: string, 
    userName?: string, 
    userId?: string, 
    amount?: string
  ) => {
    const title = '환불 완료';
    const message = `환불 처리가 완료되었습니다. (${amount || '확인 중'})`;
    
    // 푸시 알림 표시
    success(title, message);
    
    // 이메일 알림 전송
    try {
      await sendEmailNotification({
        type: 'refund_processed',
        title: '💰 환불 처리가 완료되었습니다',
        message: '환불 처리가 완료되었습니다. 환불금은 3-5일 내에 원결제 수단으로 반영됩니다.',
        userEmail,
        userName,
        userId,
        data: { amount }
      });
    } catch (error) {
      console.error('이메일 알림 전송 실패:', error);
    }
  }, [success, sendEmailNotification]);

  // 관리자 알림 (푸시 + 이메일)
  const adminNotification = useCallback(async (
    userEmail: string,
    title: string,
    message: string,
    userName?: string,
    userId?: string,
    priority: 'low' | 'normal' | 'high' = 'normal'
  ) => {
    // 푸시 알림 표시
    info(title, message);
    
    // 이메일 알림 전송
    try {
      await sendEmailNotification({
        type: 'admin_notification',
        title,
        message,
        userEmail,
        userName,
        userId,
        priority
      });
    } catch (error) {
      console.error('이메일 알림 전송 실패:', error);
    }
  }, [info, sendEmailNotification]);

  return {
    // 기본 알림 메서드
    success,
    error,
    warning,
    info,
    
    // 이메일 통합 알림 메서드
    sendEmailNotification,
    paymentSuccess,
    paymentFailed,
    quoteSubmitted,
    quoteApproved,
    refundProcessed,
    adminNotification,
  };
}
