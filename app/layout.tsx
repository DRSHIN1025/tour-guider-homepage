import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@/components/Analytics"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "투어가이더 - 동남아 맞춤 여행의 새로운 시작",
    template: "%s | 투어가이더"
  },
  description: "동남아 현지 가이드와 함께하는 특별한 맞춤 여행. 베트남, 태국, 필리핀 등 동남아 전문 여행사. 현지 가이드 직접 매칭, 맞춤 일정 제안, 안전한 여행 보장.",
  keywords: [
    "동남아 여행", "맞춤 여행", "현지 가이드", "베트남 여행", "태국 여행", "필리핀 여행", 
    "여행 견적", "가족 여행", "효도 여행", "혼자 여행", "중년 여행", "안전한 여행",
    "투어가이더", "동남아 투어", "해외여행", "여행사", "여행 플래너"
  ],
  authors: [{ name: "투어가이더" }],
  creator: "투어가이더",
  publisher: "투어가이더",
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
    title: "투어가이더 - 동남아 맞춤 여행의 새로운 시작",
    description: "동남아 현지 가이드와 함께하는 특별한 맞춤 여행. 현지 가이드 직접 매칭, 맞춤 일정 제안, 안전한 여행 보장.",
    url: 'https://tourguider.com',
    siteName: '투어가이더',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '투어가이더 - 동남아 맞춤 여행',
      }
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "투어가이더 - 동남아 맞춤 여행의 새로운 시작",
    description: "동남아 현지 가이드와 함께하는 특별한 맞춤 여행",
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
    other: {
      'naver-site-verification': 'your-naver-verification-code',
    },
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
        {/* 구조화된 데이터 - LocalBusiness */}
        <Script
          id="structured-data-local-business"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "투어가이더",
              "description": "동남아 현지 가이드와 함께하는 특별한 맞춤 여행",
              "url": "https://tourguider.com",
              "logo": "https://tourguider.com/logo.png",
              "image": "https://tourguider.com/og-image.jpg",
              "telephone": "1588-0000",
              "email": "help@tourguider.com",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "KR",
                "addressLocality": "서울",
                "addressRegion": "서울특별시"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "37.5665",
                "longitude": "126.9780"
              },
              "openingHours": "Mo-Fr 09:00-18:00",
              "priceRange": "$$",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "1000",
                "bestRating": "5",
                "worstRating": "1"
              },
              "areaServed": [
                {
                  "@type": "Country",
                  "name": "베트남"
                },
                {
                  "@type": "Country", 
                  "name": "태국"
                },
                {
                  "@type": "Country",
                  "name": "필리핀"
                }
              ],
              "serviceType": "맞춤 여행 서비스",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "동남아 여행 패키지",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "TouristTrip",
                      "name": "베트남 맞춤 여행",
                      "description": "현지 가이드와 함께하는 베트남 맞춤 여행"
                    }
                  },
                  {
                    "@type": "Offer", 
                    "itemOffered": {
                      "@type": "TouristTrip",
                      "name": "태국 맞춤 여행",
                      "description": "현지 가이드와 함께하는 태국 맞춤 여행"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "TouristTrip", 
                      "name": "필리핀 맞춤 여행",
                      "description": "현지 가이드와 함께하는 필리핀 맞춤 여행"
                    }
                  }
                ]
              }
            })
          }}
        />

        {/* 구조화된 데이터 - WebSite */}
        <Script
          id="structured-data-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "투어가이더",
              "url": "https://tourguider.com",
              "description": "동남아 현지 가이드와 함께하는 특별한 맞춤 여행",
              "publisher": {
                "@type": "Organization",
                "name": "투어가이더"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://tourguider.com/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        {/* Google Tag Manager */}
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXXX');
            `
          }}
        />

        {/* 카카오 SDK */}
        <Script 
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js" 
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4" 
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        
        {/* 네이버 SDK */}
        <Script 
          src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js" 
          strategy="beforeInteractive"
        />
        
        {/* 구글 SDK */}
        <Script 
          src="https://accounts.google.com/gsi/client" 
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
