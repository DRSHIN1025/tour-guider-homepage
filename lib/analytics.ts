// Google Analytics 설정
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'

// 페이지뷰 추적
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    })
  }
}

// 이벤트 추적
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// 맞춤 이벤트들
export const trackQuoteRequest = (destination: string, duration: string) => {
  event({
    action: 'quote_request',
    category: 'engagement',
    label: `${destination}_${duration}`,
  })
}

export const trackPhoneClick = () => {
  event({
    action: 'phone_click',
    category: 'contact',
    label: 'header_phone',
  })
}

export const trackKakaoClick = () => {
  event({
    action: 'kakao_click',
    category: 'contact',
    label: 'kakao_channel',
  })
}

export const trackReviewView = (reviewId: string) => {
  event({
    action: 'review_view',
    category: 'engagement',
    label: reviewId,
  })
}

export const trackDestinationSearch = (destination: string) => {
  event({
    action: 'destination_search',
    category: 'search',
    label: destination,
  })
}

// 전환 추적
export const trackConversion = (conversionType: 'quote_submitted' | 'phone_call' | 'booking_completed', value?: number) => {
  event({
    action: conversionType,
    category: 'conversion',
    value: value,
  })
}

// 사용자 행동 추적
export const trackScrollDepth = (percentage: number) => {
  event({
    action: 'scroll_depth',
    category: 'engagement',
    label: `${percentage}%`,
  })
}

export const trackTimeOnPage = (seconds: number) => {
  event({
    action: 'time_on_page',
    category: 'engagement',
    value: seconds,
  })
}

// GTM 데이터레이어 푸시
export const pushToDataLayer = (data: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data)
  }
}

// 타입 정의
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: Record<string, any>[]
  }
} 