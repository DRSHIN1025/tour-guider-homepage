import Stripe from 'stripe'

// Stripe 인스턴스 생성
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

// 결제 상품 정보
export const PRODUCTS = {
  BASIC_CONSULTATION: {
    name: '기본 상담 서비스',
    description: '전문 가이드와의 1:1 맞춤 상담',
    price: 50000, // 50,000원
    currency: 'krw',
  },
  PREMIUM_CONSULTATION: {
    name: '프리미엄 상담 서비스',
    description: 'VIP 맞춤 여행 계획 및 상담',
    price: 100000, // 100,000원
    currency: 'krw',
  },
  FULL_PACKAGE: {
    name: '완전 패키지 서비스',
    description: '여행 계획부터 현지 가이드까지 모든 서비스',
    price: 200000, // 200,000원
    currency: 'krw',
  },
}

// 결제 세션 생성
export async function createCheckoutSession(
  productId: keyof typeof PRODUCTS,
  userId: string,
  quoteId?: string
) {
  const product = PRODUCTS[productId]
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
    metadata: {
      userId,
      productId,
      quoteId: quoteId || '',
    },
  })

  return session
}

// 결제 세션 조회
export async function getCheckoutSession(sessionId: string) {
  return await stripe.checkout.sessions.retrieve(sessionId)
}

// 환불 처리
export async function createRefund(paymentIntentId: string, amount?: number) {
  const refundData: any = {
    payment_intent: paymentIntentId,
  }
  
  if (amount) {
    refundData.amount = amount
  }
  
  return await stripe.refunds.create(refundData)
} 