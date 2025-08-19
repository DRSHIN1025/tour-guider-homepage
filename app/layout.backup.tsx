import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import DevGuard from '@/components/dev/DevGuard';
import './globals.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'K-BIZ TRAVEL - 현지 전문가와 함께하는 맞춤 여행',
  description: '동남아 현지 가이드들이 직접 맞춤 여행 일정을 제안해드립니다. 여러 견적을 비교하고 가장 마음에 드는 여행을 선택하세요.',
  keywords: '맞춤여행, 동남아여행, 현지가이드, 여행상담, 태국여행, 베트남여행, 필리핀여행',
  openGraph: {
    title: 'K-BIZ TRAVEL - 현지 전문가와 함께하는 맞춤 여행',
    description: '동남아 현지 가이드들이 직접 맞춤 여행 일정을 제안해드립니다.',
    type: 'website',
    locale: 'ko_KR',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#16a34a" />
      </head>
      <body className={`${inter.className} bg-white text-gray-900 antialiased`} suppressHydrationWarning>
        <DevGuard label="LAYOUT" />
        {children}
        {/* Service Worker 등록 - 프로덕션 환경에서만 */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        console.log('SW registered: ', registration);
                      })
                      .catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                      });
                  });
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  )
}