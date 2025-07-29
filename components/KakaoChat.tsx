"use client"

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface KakaoChatProps {
  channelId?: string
  className?: string
}

export function KakaoChat({ channelId, className }: KakaoChatProps) {
  const handleKakaoChat = () => {
    console.log('카카오톡 버튼 클릭됨');
    
    // 기본 카카오톡 채팅 URL로 이동 (개발 중에는 기본 URL 사용)
    const defaultChatUrl = 'https://pf.kakao.com/_your_channel_id/chat'
    
    // 환경 변수가 있으면 사용, 없으면 기본 URL 사용
    const channelIdToUse = channelId || process.env.NEXT_PUBLIC_KAKAO_CHANNEL_ID
    
    console.log('채널 ID:', channelIdToUse);
    console.log('환경 변수 확인:', process.env.NEXT_PUBLIC_KAKAO_CHANNEL_ID);
    
    if (channelIdToUse && channelIdToUse !== 'your_channel_id') {
      // 실제 채널 ID가 있으면 Kakao SDK 사용
      if (typeof window !== 'undefined' && window.Kakao) {
        try {
          console.log('Kakao SDK 사용 시도');
          window.Kakao.Channel.chat({
            channelPublicId: channelIdToUse,
          })
        } catch (error) {
          console.log('Kakao SDK 오류, 기본 URL로 이동:', error)
          window.open(defaultChatUrl, '_blank')
        }
      } else {
        // Kakao SDK가 로드되지 않은 경우 기본 URL로 이동
        console.log('Kakao SDK 없음, 기본 URL로 이동')
        window.open(defaultChatUrl, '_blank')
      }
    } else {
      // 환경 변수가 없거나 기본값인 경우 기본 URL로 이동
      console.log('환경 변수 없음, 기본 URL로 이동')
      window.open(defaultChatUrl, '_blank')
    }
  }

  useEffect(() => {
    // Kakao SDK 로드 (환경 변수가 있을 때만)
    if (typeof window !== 'undefined' && !window.Kakao && process.env.NEXT_PUBLIC_KAKAO_APP_KEY) {
      const script = document.createElement('script')
      script.src = 'https://developers.kakao.com/sdk/js/kakao.js'
      script.async = true
      script.onload = () => {
        if (window.Kakao) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY)
        }
      }
      document.head.appendChild(script)
    }
  }, [])

  return (
    <Button
      onClick={handleKakaoChat}
      className={`w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-2xl transition-colors ${className || ''}`}
    >
      <MessageCircle className="w-5 h-5 mr-2" />
      카카오톡으로 문의하기
    </Button>
  )
}

// 전역 타입 선언
declare global {
  interface Window {
    Kakao: any
  }
} 