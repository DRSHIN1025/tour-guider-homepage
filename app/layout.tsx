import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Suspense, lazy } from 'react'

// 지연 로딩 컴포넌트
const PWAInstaller = lazy(() => import('@/components/PWAInstaller'))
const NotificationContainer = lazy(() => import('@/components/NotificationContainer'))

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'K-BIZ TRAVEL - 동남아 특화 맞춤여행',
  description: '동남아시아 여행 전문 여행사. 맞춤형 여행 계획, 현지 가이드, 특별한 경험을 제공합니다.',
  keywords: '동남아, 여행, 맞춤여행, 가이드, 태국, 베트남, 캄보디아, 라오스, 미얀마, 말레이시아, 싱가포르, 인도네시아, 필리핀',
  authors: [{ name: 'K-BIZ TRAVEL' }],
  creator: 'K-BIZ TRAVEL',
  publisher: 'K-BIZ TRAVEL',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tourguider.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'K-BIZ TRAVEL - 동남아 특화 맞춤여행',
    description: '동남아시아 여행 전문 여행사. 맞춤형 여행 계획, 현지 가이드, 특별한 경험을 제공합니다.',
    url: 'https://tourguider.com',
    siteName: 'K-BIZ TRAVEL',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'K-BIZ TRAVEL - 동남아 특화 맞춤여행',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'K-BIZ TRAVEL - 동남아 특화 맞춤여행',
    description: '동남아시아 여행 전문 여행사. 맞춤형 여행 계획, 현지 가이드, 특별한 경험을 제공합니다.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="K-BIZ TRAVEL" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://googleapis.com" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="//googleapis.com" />
      </head>
      <body className={inter.className}>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "K-BIZ TRAVEL",
              "description": "동남아시아 여행 전문 여행사. 맞춤형 여행 계획, 현지 가이드, 특별한 경험을 제공합니다.",
              "url": "https://tourguider.com",
              "telephone": "+82-10-5940-0104",
              "email": "info@tourguider.com",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "KR",
                "addressRegion": "Seoul",
                "addressLocality": "Seoul"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 37.5665,
                "longitude": 126.9780
              },
              "openingHours": "Mo-Fr 09:00-18:00",
              "priceRange": "$$",
              "currenciesAccepted": "KRW, USD",
              "paymentAccepted": "Credit Card, Bank Transfer",
              "areaServed": [
                {
                  "@type": "Country",
                  "name": "Thailand"
                },
                {
                  "@type": "Country",
                  "name": "Vietnam"
                },
                {
                  "@type": "Country",
                  "name": "Cambodia"
                },
                {
                  "@type": "Country",
                  "name": "Laos"
                },
                {
                  "@type": "Country",
                  "name": "Myanmar"
                },
                {
                  "@type": "Country",
                  "name": "Malaysia"
                },
                {
                  "@type": "Country",
                  "name": "Singapore"
                },
                {
                  "@type": "Country",
                  "name": "Indonesia"
                },
                {
                  "@type": "Country",
                  "name": "Philippines"
                }
              ],
              "serviceType": "Travel Agency",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "동남아 여행 상품",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "맞춤형 여행 계획",
                      "description": "개인 맞춤형 여행 계획 수립 서비스"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "현지 가이드",
                      "description": "현지 전문 가이드 서비스"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "여행 상담",
                      "description": "전문 여행 상담 서비스"
                    }
                  }
                ]
              }
            })
          }}
        />
        
        {children}
        
        {/* PWA Installer */}
        <Suspense fallback={null}>
          <PWAInstaller />
        </Suspense>
        
        {/* Notification Container */}
        <Suspense fallback={null}>
          <NotificationContainer position="top-right" maxNotifications={5} />
        </Suspense>
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
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
      </body>
    </html>
  )
}
