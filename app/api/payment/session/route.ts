import { NextRequest, NextResponse } from 'next/server'
import { getCheckoutSession } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: '세션 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 테스트 세션인 경우
    if (sessionId.startsWith('test_session_')) {
      return NextResponse.json({
        session: {
          id: sessionId,
          amount_total: 50000,
          currency: 'krw',
          payment_status: 'paid',
          created: Math.floor(Date.now() / 1000),
          payment_method_types: ['card']
        }
      })
    }

    // 환경 변수가 없으면 테스트 데이터 반환
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        session: {
          id: sessionId,
          amount_total: 50000,
          currency: 'krw',
          payment_status: 'paid',
          created: Math.floor(Date.now() / 1000),
          payment_method_types: ['card']
        }
      })
    }

    const session = await getCheckoutSession(sessionId)

    return NextResponse.json({ session })
  } catch (error) {
    console.error('세션 조회 오류:', error)
    return NextResponse.json(
      { error: '세션 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 