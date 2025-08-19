import Head from 'next/head'
import { siteConfig } from '@/app/config/site'

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
  title = `${siteConfig.name}`,
  description = siteConfig.description,
  keywords = [
    "여행", "맞춤 여행", "비즈니스 여행", "브랜드", "견적", "상담",
    siteConfig.name
  ],
  image = siteConfig.ogImage || siteConfig.logo,
  url = siteConfig.url,
  type = "website",
  publishedTime,
  modifiedTime,
  author = siteConfig.name,
  locale = "ko_KR",
  siteName = siteConfig.name
}: SEOHeadProps) {
  const fullTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`
  const fullUrl = url.startsWith('http') ? url : `${siteConfig.url}${url}`
  const fullImage = image.startsWith('http') ? image : `${siteConfig.url}${image}`

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
      <meta name="theme-color" content="#059669" />
      <meta name="msapplication-TileColor" content="#059669" />
    </Head>
  )
} 