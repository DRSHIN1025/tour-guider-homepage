import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "투어가이더 - 맞춤 여행의 새로운 시작",
  description: "동남아 현지 가이드와 함께하는 특별한 맞춤 여행",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
