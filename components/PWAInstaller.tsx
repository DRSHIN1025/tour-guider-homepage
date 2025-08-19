'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Download, Smartphone } from 'lucide-react'

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // PWA 설치 가능 여부 확인
    const checkInstallable = () => {
      // 이미 설치되어 있는지 확인
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        return
      }

      // 설치 프롬프트 이벤트 리스너
      const handleBeforeInstallPrompt = (e: any) => {
        e.preventDefault()
        setDeferredPrompt(e)
        setShowInstallPrompt(true)
      }

      // 설치 완료 이벤트 리스너
      const handleAppInstalled = () => {
        setIsInstalled(true)
        setShowInstallPrompt(false)
        setDeferredPrompt(null)
      }

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.addEventListener('appinstalled', handleAppInstalled)

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.removeEventListener('appinstalled', handleAppInstalled)
      }
    }

    checkInstallable()
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('PWA 설치가 수락되었습니다.')
    } else {
      console.log('PWA 설치가 거부되었습니다.')
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
  }

  // 이미 설치되어 있거나 설치 프롬프트가 없으면 표시하지 않음
  if (isInstalled || !showInstallPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <Card className="shadow-lg border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">앱 설치하기</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            투어가이더를 홈 화면에 추가하여 더 빠르게 접근하세요!
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <p>• 홈 화면에서 바로 접근</p>
              <p>• 오프라인에서도 사용 가능</p>
              <p>• 푸시 알림으로 실시간 업데이트</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleInstallClick}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                설치하기
              </Button>
              <Button
                variant="outline"
                onClick={handleDismiss}
                className="flex-1"
              >
                나중에
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}













