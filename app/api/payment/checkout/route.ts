import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { productId, userId, quoteId } = await request.json()

    if (!productId || !userId) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 환경 변수가 없으면 테스트 모드로 진행
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log('Stripe 환경 변수가 없어 테스트 모드로 진행합니다.')
      return NextResponse.json({ 
        sessionId: 'test_session_' + Date.now(),
        url: '/payment/success?session_id=test_session_' + Date.now()
      })
    }

    const session = await createCheckoutSession(productId, userId, quoteId)

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('결제 세션 생성 오류:', error)
    return NextResponse.json(
      { error: '결제 세션 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 