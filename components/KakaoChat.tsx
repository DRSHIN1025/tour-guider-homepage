"use client"

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface KakaoChatProps {
  channelId?: string;
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function KakaoChat({ 
  channelId, 
  className, 
  children = "카카오톡으로 문의하기",
  variant = "default",
  size = "default"
}: KakaoChatProps) {
  const handleKakaoChat = () => {
    try {
      // 브라우저 환경 체크
      if (typeof window === 'undefined') {
        console.warn('브라우저 환경에서만 카카오톡 채팅을 사용할 수 있습니다.');
        return;
      }

      // 환경변수에서 채널 ID 가져오기
      const envChannelId = process.env.NEXT_PUBLIC_KAKAO_CHANNEL_ID;
      const channelIdToUse = channelId || envChannelId;
      
      if (channelIdToUse && channelIdToUse !== 'demo') {
        // 실제 카카오톡 채널 연결
        const kakaoUrl = `https://pf.kakao.com/_${channelIdToUse}`;
        window.open(kakaoUrl, '_blank');
      } else {
        // 데모 모드: 카카오 개발자 페이지로 연결
        const demoUrl = 'https://developers.kakao.com/docs/latest/ko/getting-started/sdk-js';
        window.open(demoUrl, '_blank');
      }
    } catch (error) {
      // 오류 발생 시 카카오 메인 페이지로 연결
      if (typeof window !== 'undefined') {
        window.open('https://www.kakao.com', '_blank');
      }
    }
  };

  return (
    <Button
      onClick={handleKakaoChat}
      className={className}
      variant={variant}
      size={size}
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      {children}
    </Button>
  );
} 