'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

interface NotificationToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  className?: string;
}

const notificationIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const notificationColors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

export function NotificationToast({ 
  notification, 
  onDismiss, 
  className 
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss(notification.id);
    }, 300);
  };

  if (!isVisible) return null;

  const IconComponent = notificationIcons[notification.type];

  return (
    <div
      className={cn(
        'relative flex items-start p-4 border rounded-lg shadow-lg transition-all duration-300 ease-in-out transform',
        notificationColors[notification.type],
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0',
        className
      )}
    >
      <div className="flex-shrink-0 mr-3">
        <IconComponent className={cn('w-5 h-5', iconColors[notification.type])} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium mb-1">{notification.title}</h4>
        <p className="text-sm opacity-90">{notification.message}</p>
        <p className="text-xs opacity-70 mt-2">
          {notification.timestamp.toLocaleTimeString()}
        </p>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDismiss}
        className="ml-2 p-1 h-auto opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
