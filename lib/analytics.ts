// Google Analytics 설정
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'

// 페이지뷰 추적 (임시 비활성화)
export const pageview = (url: string) => {
  // 임시로 비활성화
  return
  /*
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    })
  }
  */
}

// 이벤트 추적 (임시 비활성화)
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
  // 임시로 비활성화
  return
  /*
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
  */
}

// 맞춤 이벤트들 (임시 비활성화)
export const trackQuoteRequest = (destination: string, duration: string) => {
  return
}

export const trackPhoneClick = () => {
  return
}

export const trackKakaoClick = () => {
  return
}

export const trackReviewView = (reviewId: string) => {
  return
}

export const trackDestinationSearch = (destination: string) => {
  return
}

// 전환 추적 (임시 비활성화)
export const trackConversion = (conversionType: 'quote_submitted' | 'phone_call' | 'booking_completed', value?: number) => {
  return
}

// 사용자 행동 추적 (임시 비활성화)
export const trackScrollDepth = (percentage: number) => {
  return
}

export const trackTimeOnPage = (seconds: number) => {
  return
}

// GTM 데이터레이어 푸시 (임시 비활성화)
export const pushToDataLayer = (data: Record<string, any>) => {
  return
}

// 타입 정의
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: Record<string, any>[]
  }
} 