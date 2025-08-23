import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { doc, updateDoc, setDoc, collection, addDoc } from 'firebase/firestore';

// 환경 변수 체크
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  console.warn('STRIPE_SECRET_KEY가 설정되지 않았습니다. Stripe 기능이 비활성화됩니다.');
}

if (!webhookSecret) {
  console.warn('STRIPE_WEBHOOK_SECRET이 설정되지 않았습니다.');
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2025-06-30.basil',
}) : null;

export async function POST(req: NextRequest) {
  try {
    // Stripe가 비활성화된 경우
    if (!stripe || !webhookSecret) {
      console.warn('Stripe 웹훅이 비활성화되었습니다. 환경 변수를 확인하세요.');
      return NextResponse.json(
        { error: 'Stripe 기능이 비활성화되었습니다.' },
        { status: 503 }
      );
    }

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Stripe 서명이 없습니다.' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('웹훅 서명 검증 실패:', err);
      return NextResponse.json(
        { error: '웹훅 서명 검증 실패' },
        { status: 400 }
      );
    }

    // 이벤트 타입별 처리
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`처리되지 않은 이벤트 타입: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('웹훅 처리 오류:', error);
    return NextResponse.json(
      { error: '웹훅 처리 실패' },
      { status: 500 }
    );
  }
}

// 체크아웃 세션 완료 처리
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const { customer_email, amount_total, metadata, payment_status } = session;
    
    if (!customer_email || !amount_total) {
      console.error('필수 정보 누락:', session);
      return;
    }

    // 결제 내역을 Firestore에 저장
    const paymentData = {
      id: session.id,
      customerEmail: customer_email,
      amount: amount_total,
      currency: session.currency || 'krw',
      status: payment_status,
      paymentMethod: session.payment_method_types?.[0] || 'unknown',
      metadata: metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
      stripeSessionId: session.id,
      stripeCustomerId: session.customer as string || null,
      stripePaymentIntentId: session.payment_intent as string || null,
    };

    // 결제 내역 저장
    await setDoc(doc(db, 'payments', session.id), paymentData);

    // 견적 상태 업데이트 (metadata에 quoteId가 있는 경우)
    if (metadata?.quoteId) {
      const quoteRef = doc(db, 'quotes', metadata.quoteId);
      await updateDoc(quoteRef, {
        paymentStatus: 'paid',
        paymentId: session.id,
        paidAt: new Date(),
        status: 'completed'
      });
    }

    console.log('결제 완료 처리됨:', session.id);
  } catch (error) {
    console.error('체크아웃 세션 완료 처리 오류:', error);
  }
}

// 결제 의도 성공 처리
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    const paymentRef = doc(db, 'payments', paymentIntent.metadata?.sessionId || paymentIntent.id);
    await updateDoc(paymentRef, {
      status: 'succeeded',
      updatedAt: new Date(),
      stripePaymentIntentId: paymentIntent.id,
      paymentMethod: paymentIntent.payment_method_types?.[0] || 'unknown',
    });

    console.log('결제 의도 성공 처리됨:', paymentIntent.id);
  } catch (error) {
    console.error('결제 의도 성공 처리 오류:', error);
  }
}

// 결제 의도 실패 처리
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const paymentRef = doc(db, 'payments', paymentIntent.metadata?.sessionId || paymentIntent.id);
    await updateDoc(paymentRef, {
      status: 'failed',
      updatedAt: new Date(),
      failureReason: paymentIntent.last_payment_error?.message || '알 수 없는 오류',
    });

    console.log('결제 의도 실패 처리됨:', paymentIntent.id);
  } catch (error) {
    console.error('결제 의도 실패 처리 오류:', error);
  }
}

// 환불 처리
async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    const paymentRef = doc(db, 'payments', charge.metadata?.sessionId || charge.payment_intent as string);
    await updateDoc(paymentRef, {
      status: 'refunded',
      refundedAt: new Date(),
      updatedAt: new Date(),
      refundAmount: charge.amount_refunded,
      refundReason: charge.metadata?.refundReason || '고객 요청',
    });

    // 환불 내역 저장
    const refundData = {
      id: charge.id,
      paymentId: charge.metadata?.sessionId || charge.payment_intent,
      amount: charge.amount_refunded,
      currency: charge.currency,
      reason: charge.metadata?.refundReason || '고객 요청',
      createdAt: new Date(),
      stripeRefundId: charge.id,
    };

    await addDoc(collection(db, 'refunds'), refundData);

    console.log('환불 처리됨:', charge.id);
  } catch (error) {
    console.error('환불 처리 오류:', error);
  }
}

// 인보이스 결제 성공 처리 (구독 기반 결제)
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    // 구독 기반 결제는 별도 처리 로직 필요
    console.log('인보이스 결제 성공 처리됨 (구독):', invoice.id);
  } catch (error) {
    console.error('인보이스 결제 성공 처리 오류:', error);
  }
}

// 인보이스 결제 실패 처리 (구독 기반 결제)
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    // 구독 기반 결제는 별도 처리 로직 필요
    console.log('인보이스 결제 실패 처리됨 (구독):', invoice.id);
  } catch (error) {
    console.error('인보이스 결제 실패 처리 오류:', error);
  }
}
