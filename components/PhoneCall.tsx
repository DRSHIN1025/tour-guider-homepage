"use client"

import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"

interface PhoneCallProps {
  phoneNumber: string
  className?: string
  children?: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function PhoneCall({ 
  phoneNumber, 
  className, 
  children,
  variant = "default",
  size = "default"
}: PhoneCallProps) {
  const handlePhoneCall = () => {
    try {
      // 브라우저 환경 체크
      if (typeof window === 'undefined') {
        console.warn('브라우저 환경에서만 전화 연결을 사용할 수 있습니다.');
        return;
      }

      // 전화번호에서 하이픈 제거
      const cleanNumber = phoneNumber.replace(/-/g, '');
      const phoneUrl = `tel:${cleanNumber}`;
      
      // 전화 연결 시도
      window.open(phoneUrl, '_self');
    } catch (error) {
      // 오류 발생 시 수동 전화 안내
      if (typeof window !== 'undefined') {
        window.open(`tel:${phoneNumber.replace(/-/g, '')}`, '_self');
      }
    }
  };

  return (
    <Button
      onClick={handlePhoneCall}
      className={className}
      variant={variant}
      size={size}
    >
      <Phone className="w-4 h-4 mr-2" />
      {children || phoneNumber}
    </Button>
  );
}
