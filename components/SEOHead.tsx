import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  locale?: string
  siteName?: string
}

export function SEOHead({
  title = "투어가이더 - 동남아 맞춤 여행의 새로운 시작",
  description = "동남아 현지 가이드와 함께하는 특별한 맞춤 여행. 베트남, 태국, 필리핀 등 동남아 전문 여행사. 현지 가이드 직접 매칭, 맞춤 일정 제안, 안전한 여행 보장.",
  keywords = [
    "동남아 여행", "맞춤 여행", "현지 가이드", "베트남 여행", "태국 여행", "필리핀 여행", 
    "여행 견적", "가족 여행", "효도 여행", "혼자 여행", "중년 여행", "안전한 여행",
    "투어가이더", "동남아 투어", "해외여행", "여행사", "여행 플래너"
  ],
  image = "/og-image.jpg",
  url = "https://tourguider.com",
  type = "website",
  publishedTime,
  modifiedTime,
  author = "투어가이더",
  locale = "ko_KR",
  siteName = "투어가이더"
}: SEOHeadProps) {
  const fullTitle = title.includes('투어가이더') ? title : `${title} | 투어가이더`
  const fullUrl = url.startsWith('http') ? url : `https://tourguider.com${url}`
  const fullImage = image.startsWith('http') ? image : `https://tourguider.com${image}`

  return (
    <Head>
      {/* 기본 메타 태그 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={title} />

      {/* 추가 메타 태그 */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="format-detection" content="address=no" />
      <meta name="format-detection" content="email=no" />
      
      {/* 파비콘 */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      
      {/* 추가 링크 */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#2D5C4D" />
      <meta name="msapplication-TileColor" content="#2D5C4D" />
    </Head>
  )
} 