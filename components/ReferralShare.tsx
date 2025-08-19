'use client'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Share2, 
  Copy, 
  QrCode, 
  Download, 
  Facebook, 
  Twitter, 
  MessageCircle,
  Link as LinkIcon,
  Smartphone,
  Mail,
  MessageSquare,
  Instagram,
  Youtube,
  ExternalLink,
  Sparkles,
  Gift,
  Users
} from 'lucide-react'
import { toast } from 'sonner'

interface ReferralShareProps {
  referralCode: string
  referralLink: string
  userName: string
  className?: string
}

export default function ReferralShare({ 
  referralCode, 
  referralLink, 
  userName,
  className = '' 
}: ReferralShareProps) {
  const [showQR, setShowQR] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [activeTab, setActiveTab] = useState('social')
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)

  const generateQRCode = async () => {
    if (!qrCanvasRef.current) return

    try {
      // QR 코드 라이브러리 동적 import
      const QRCode = (await import('qrcode')).default
      
      const canvas = qrCanvasRef.current
      await QRCode.toCanvas(canvas, referralLink, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      setQrCodeUrl(canvas.toDataURL())
      setShowQR(true)
    } catch (error) {
      console.error('QR 코드 생성 오류:', error)
      toast.error('QR 코드 생성에 실패했습니다.')
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement('a')
    link.download = `referral-qr-${referralCode}.png`
    link.href = qrCodeUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('QR 코드가 다운로드되었습니다!')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      toast.success('레퍼럴 링크가 복사되었습니다!')
    } catch (error) {
      toast.error('링크 복사에 실패했습니다.')
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode)
      toast.success('레퍼럴 코드가 복사되었습니다!')
    } catch (error) {
      toast.error('코드 복사에 실패했습니다.')
    }
  }

  const shareToSocial = (platform: string) => {
    const text = `${userName}님의 추천으로 투어가이더에 가입하고 10,000원 할인 혜택을 받아보세요! 동남아 현지 가이드와 함께하는 특별한 여행을 경험해보세요.`
    const encodedText = encodeURIComponent(text)
    const encodedUrl = encodeURIComponent(referralLink)

    let shareUrl = ''
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        break
      case 'instagram':
        // Instagram은 직접 링크 공유가 제한적이므로 복사
        copyLink()
        return
      case 'youtube':
        shareUrl = `https://www.youtube.com/redirect?q=${encodedUrl}`
        break
      default:
        return
    }

    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const shareViaNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userName}님의 여행 서비스 추천`,
          text: `${userName}님의 추천으로 여행 서비스를 이용해보세요! 10,000원 할인 혜택을 받을 수 있습니다.`,
          url: referralLink
        })
        toast.success('공유되었습니다!')
      } catch (error) {
        console.log('공유가 취소되었습니다.')
      }
    } else {
      // 네이티브 공유가 지원되지 않는 경우 링크 복사
      await copyLink()
    }
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`${userName}님의 투어가이더 추천`)
    const body = encodeURIComponent(`안녕하세요!

${userName}님의 추천으로 투어가이더에 가입하고 특별한 혜택을 받아보세요!

🎁 특별 혜택: 10,000원 할인
🌏 동남아 현지 가이드와 함께하는 맞춤 여행
💎 무료 견적 및 상담
🚀 간편한 가입으로 즉시 혜택 적용

레퍼럴 코드: ${referralCode}
가입 링크: ${referralLink}

링크를 클릭하시면 자동으로 레퍼럴 코드가 적용되어 가입할 수 있습니다!

지금 바로 시작하세요!`)

    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
  }

  const shareViaSMS = () => {
    const text = encodeURIComponent(`${userName}님의 추천으로 여행 서비스를 이용해보세요! 10,000원 할인 혜택을 받을 수 있습니다. 레퍼럴 코드: ${referralCode} 링크: ${referralLink}`)
    window.open(`sms:?body=${text}`, '_blank')
  }

  return (
    <Card className={`bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border-2 border-green-200 shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          레퍼럴 코드 공유
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 레퍼럴 코드 표시 */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-green-200 shadow-sm">
          <div className="text-center">
            <Badge variant="secondary" className="mb-3 bg-green-100 text-green-800 border-green-200">
              <Gift className="w-3 h-3 mr-1" />
              추천 코드
            </Badge>
            <p className="text-3xl font-mono font-bold text-green-600 mb-3 tracking-wider">
              {referralCode}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              이 코드를 친구에게 공유하고 보상을 받아보세요!
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={copyCode} variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                코드 복사
              </Button>
              <Button onClick={copyLink} variant="outline" size="sm">
                <LinkIcon className="w-4 h-4 mr-2" />
                링크 복사
              </Button>
            </div>
          </div>
        </div>

        {/* 공유 옵션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="social">소셜미디어</TabsTrigger>
            <TabsTrigger value="direct">직접 공유</TabsTrigger>
            <TabsTrigger value="qr">QR 코드</TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="space-y-4">
            <h4 className="font-medium text-gray-900">소셜 미디어 공유</h4>
            
            {/* 네이티브 공유 */}
            <Button 
              onClick={shareViaNative} 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Share2 className="w-4 h-4 mr-2" />
              공유하기
            </Button>

            {/* 소셜 플랫폼 */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => shareToSocial('facebook')} 
                variant="outline" 
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              <Button 
                onClick={() => shareToSocial('twitter')} 
                variant="outline" 
                className="bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button 
                onClick={() => shareToSocial('instagram')} 
                variant="outline" 
                className="bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100"
              >
                <Instagram className="w-4 h-4 mr-2" />
                Instagram
              </Button>
              <Button 
                onClick={() => shareToSocial('youtube')} 
                variant="outline" 
                className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              >
                <Youtube className="w-4 h-4 mr-2" />
                YouTube
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="direct" className="space-y-4">
            <h4 className="font-medium text-gray-900">직접 공유</h4>
            
            <div className="grid grid-cols-1 gap-3">
              <Button 
                onClick={shareViaEmail} 
                variant="outline" 
                className="justify-start"
              >
                <Mail className="w-4 h-4 mr-3" />
                이메일로 공유
              </Button>
              <Button 
                onClick={shareViaSMS} 
                variant="outline" 
                className="justify-start"
              >
                <MessageSquare className="w-4 h-4 mr-3" />
                SMS로 공유
              </Button>
              <Button 
                onClick={copyLink} 
                variant="outline" 
                className="justify-start"
              >
                <LinkIcon className="w-4 h-4 mr-3" />
                링크 복사
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="qr" className="space-y-4">
            <h4 className="font-medium text-gray-900">QR 코드</h4>
            
            <Button 
              onClick={generateQRCode} 
              variant="outline" 
              className="w-full"
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR 코드 생성
            </Button>
            
            {showQR && qrCodeUrl && (
              <div className="text-center space-y-3">
                <canvas 
                  ref={qrCanvasRef} 
                  className="mx-auto border rounded-lg"
                  style={{ display: 'none' }}
                />
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className="mx-auto border rounded-lg shadow-sm"
                />
                <Button 
                  onClick={downloadQRCode} 
                  variant="outline" 
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  QR 코드 다운로드
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* 공유 팁 */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            공유 팁
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 친구에게 직접 메시지로 링크를 보내보세요</li>
            <li>• 소셜 미디어에 QR 코드를 공유해보세요</li>
            <li>• 카카오톡이나 텔레그램으로 링크를 전달해보세요</li>
            <li>• 친구가 링크를 통해 가입하면 자동으로 보상이 지급됩니다</li>
          </ul>
        </div>

        {/* 혜택 안내 */}
        <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
            <Gift className="w-4 h-4" />
            레퍼럴 혜택
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-green-800">추천인: 10,000원 보상</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-green-600" />
              <span className="text-green-800">추천받은 분: 10,000원 할인</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
