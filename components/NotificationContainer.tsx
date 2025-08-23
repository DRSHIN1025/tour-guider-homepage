'use client';

import { useState, useCallback, useEffect } from 'react';
import { NotificationToast, Notification } from './NotificationToast';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NotificationContainerProps {
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxNotifications?: number;
}

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
};

export default function NotificationContainer({ 
  className,
  position = 'top-right',
  maxNotifications = 5
}: NotificationContainerProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      return updated.slice(0, maxNotifications);
    });
  }, [maxNotifications]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  // 전역 함수로 노출 (다른 컴포넌트에서 사용할 수 있도록)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).showNotification = addNotification;
    }
  }, [addNotification]);

  const hasNotifications = notifications.length > 0;
  const visibleNotifications = isExpanded ? notifications : notifications.slice(0, 2);

  return (
    <div className={cn('fixed z-50', positionClasses[position], className)}>
      {/* 알림 개수 표시 및 토글 버튼 */}
      {hasNotifications && (
        <div className="mb-3 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleExpanded}
            className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white shadow-sm"
          >
            <Bell className="w-4 h-4 mr-2" />
            알림 {notifications.length}개
            {!isExpanded && notifications.length > 2 && (
              <span className="ml-1 text-xs text-gray-500">
                (+{notifications.length - 2})
              </span>
            )}
          </Button>
          
          {isExpanded && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="ml-2 p-2 h-auto bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {/* 알림 스택 */}
      <div className="space-y-3">
        {visibleNotifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onDismiss={removeNotification}
            className="w-80"
          />
        ))}
      </div>

      {/* 더 보기 버튼 */}
      {!isExpanded && notifications.length > 2 && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleExpanded}
          className="mt-3 w-full bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white text-sm"
        >
          더 보기 ({notifications.length - 2}개)
        </Button>
      )}
    </div>
  );
}
