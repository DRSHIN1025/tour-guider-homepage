// 한국 결제 시스템 통합 라이브러리

export interface PaymentRequest {
  orderId: string
  amount: number
  orderName: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  successUrl: string
  failUrl: string
  paymentMethod: 'toss' | 'kakao' | 'naver' | 'card'
}

export interface PaymentResponse {
  success: boolean
  paymentKey?: string
  orderId: string
  amount: number
  status: 'READY' | 'IN_PROGRESS' | 'WAITING_FOR_DEPOSIT' | 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'ABORTED' | 'EXPIRED'
  approvedAt?: string
  message?: string
  error?: string
}

// Toss Payments 연동 (개발용 더미)
export const createTossPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  console.log('Toss 결제 요청:', paymentData)
  
  // 개발용 더미 응답
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        paymentKey: `toss_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        status: 'READY',
        message: 'Toss 결제가 준비되었습니다 (개발용 더미)'
      })
    }, 1000)
  })
}

// 카카오페이 연동 (개발용 더미)
export const createKakaoPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  console.log('카카오페이 결제 요청:', paymentData)
  
  // 개발용 더미 응답
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        paymentKey: `kakao_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        status: 'READY',
        message: '카카오페이 결제가 준비되었습니다 (개발용 더미)'
      })
    }, 1000)
  })
}

// 네이버페이 연동 (개발용 더미)
export const createNaverPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  console.log('네이버페이 결제 요청:', paymentData)
  
  // 개발용 더미 응답
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        paymentKey: `naver_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        status: 'READY',
        message: '네이버페이 결제가 준비되었습니다 (개발용 더미)'
      })
    }, 1000)
  })
}

// 결제 상태 확인
export const checkPaymentStatus = async (paymentKey: string): Promise<PaymentResponse> => {
  console.log('결제 상태 확인:', paymentKey)
  
  // 개발용 더미 응답
  return new Promise((resolve) => {
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2 // 80% 성공률
      
      resolve({
        success: isSuccess,
        paymentKey,
        orderId: `order_${Date.now()}`,
        amount: 100000,
        status: isSuccess ? 'DONE' : 'ABORTED',
        approvedAt: isSuccess ? new Date().toISOString() : undefined,
        message: isSuccess ? '결제가 완료되었습니다' : '결제가 실패했습니다',
        error: isSuccess ? undefined : '결제 처리 중 오류가 발생했습니다'
      })
    }, 2000)
  })
}

// 결제 취소
export const cancelPayment = async (paymentKey: string, reason: string): Promise<PaymentResponse> => {
  console.log('결제 취소 요청:', { paymentKey, reason })
  
  // 개발용 더미 응답
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        paymentKey,
        orderId: `order_${Date.now()}`,
        amount: 100000,
        status: 'CANCELED',
        message: `결제가 취소되었습니다. 사유: ${reason}`
      })
    }, 1000)
  })
}

// 결제 방법별 수수료 계산
export const calculatePaymentFee = (amount: number, method: PaymentRequest['paymentMethod']): number => {
  const feeRates = {
    toss: 0.029,    // 2.9%
    kakao: 0.035,   // 3.5%
    naver: 0.032,   // 3.2%
    card: 0.025     // 2.5%
  }
  
  return Math.floor(amount * feeRates[method])
}

// 결제 가능 금액 범위 확인
export const validatePaymentAmount = (amount: number): { valid: boolean; message?: string } => {
  const MIN_AMOUNT = 1000      // 최소 1,000원
  const MAX_AMOUNT = 10000000  // 최대 1,000만원
  
  if (amount < MIN_AMOUNT) {
    return { valid: false, message: `최소 결제 금액은 ${MIN_AMOUNT.toLocaleString()}원입니다.` }
  }
  
  if (amount > MAX_AMOUNT) {
    return { valid: false, message: `최대 결제 금액은 ${MAX_AMOUNT.toLocaleString()}원입니다.` }
  }
  
  return { valid: true }
}

// 주문 ID 생성
export const generateOrderId = (prefix: string = 'ORDER'): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  return `${prefix}_${timestamp}_${random}`.toUpperCase()
}
