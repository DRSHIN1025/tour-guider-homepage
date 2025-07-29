"use client"

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface KakaoChatProps {
  channelId?: string
  className?: string
}

export function KakaoChat({ channelId, className }: KakaoChatProps) {
  useEffect(() => {
    // Kakao SDK 로드
    if (typeof window !== 'undefined' && !window.Kakao) {
      const script = document.createElement('script')
      script.src = 'https://developers.kakao.com/sdk/js/kakao.js'
      script.async = true
      script.onload = () => {
        if (window.Kakao) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY || 'test_key')
        }
      }
      document.head.appendChild(script)
    }
  }, [])

  const handleKakaoChat = () => {
    // 기본 카카오톡 채팅 URL로 이동 (개발 중에는 기본 URL 사용)
    const defaultChatUrl = 'https://pf.kakao.com/_your_channel_id/chat'
    const channelIdToUse = channelId || process.env.NEXT_PUBLIC_KAKAO_CHANNEL_ID
    
    if (typeof window !== 'undefined' && window.Kakao && channelIdToUse) {
      try {
        window.Kakao.Channel.chat({
          channelPublicId: channelIdToUse,
        })
      } catch (error) {
        console.log('Kakao SDK 오류, 기본 URL로 이동:', error)
        window.open(defaultChatUrl, '_blank')
      }
    } else {
      // Kakao SDK가 로드되지 않은 경우 기본 URL로 이동
      window.open(defaultChatUrl, '_blank')
    }
  }

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