import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { doc, updateDoc, addDoc, collection, getDoc } from 'firebase/firestore';

// 환경 변수 체크
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn('STRIPE_SECRET_KEY가 설정되지 않았습니다. Stripe 환불 기능이 비활성화됩니다.');
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2025-06-30.basil',
}) : null;

export async function POST(req: NextRequest) {
  try {
    // Firebase가 비활성화된 경우
    if (!db) {
      return NextResponse.json(
        { success: false, message: 'Database not configured' },
        { status: 503 }
      );
    }

    // Stripe가 비활성화된 경우
    if (!stripe) {
      console.warn('Stripe 환불 기능이 비활성화되었습니다. 환경 변수를 확인하세요.');
      return NextResponse.json(
        { error: 'Stripe 환불 기능이 비활성화되었습니다.' },
        { status: 503 }
      );
    }

    const { paymentId, amount, reason, refundType } = await req.json();

    if (!paymentId || !amount || !reason) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 결제 정보 조회
    const paymentDoc = db ? await getDoc(doc(db, 'payments', paymentId)) : null;
    if (!paymentDoc) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }
    if (!paymentDoc.exists()) {
      return NextResponse.json(
        { error: '결제 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const paymentData = paymentDoc.data();
    
    // 이미 환불된 결제인지 확인
    if (paymentData.status === 'refunded') {
      return NextResponse.json(
        { error: '이미 환불된 결제입니다.' },
        { status: 400 }
      );
    }

    // 환불 금액 검증
    if (amount > paymentData.amount) {
      return NextResponse.json(
        { error: '환불 금액이 결제 금액을 초과할 수 없습니다.' },
        { status: 400 }
      );
    }

    // Stripe 환불 처리
    let refund;
    if (paymentData.stripePaymentIntentId && stripe) {
      // Payment Intent를 통한 환불
      refund = await stripe.refunds.create({
        payment_intent: paymentData.stripePaymentIntentId,
        amount: amount,
        reason: refundType === 'fraudulent' ? 'fraudulent' : 'requested_by_customer',
        metadata: {
          refundReason: reason,
          originalPaymentId: paymentId,
        },
      });
    } else if (paymentData.stripeSessionId && stripe) {
      // Checkout Session을 통한 환불
      const session = await stripe.checkout.sessions.retrieve(paymentData.stripeSessionId);
      if (session.payment_intent) {
        refund = await stripe.refunds.create({
          payment_intent: session.payment_intent as string,
          amount: amount,
          reason: refundType === 'fraudulent' ? 'fraudulent' : 'requested_by_customer',
          metadata: {
            refundReason: reason,
            originalPaymentId: paymentId,
          },
        });
      }
    }

    if (!refund) {
      return NextResponse.json(
        { error: '환불 처리에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 환불 내역을 Firestore에 저장
    const refundData = {
      id: refund.id,
      paymentId: paymentId,
      amount: amount,
      currency: paymentData.currency,
      reason: reason,
      refundType: refundType || 'requested_by_customer',
      stripeRefundId: refund.id,
      status: refund.status,
      createdAt: new Date(),
      customerEmail: paymentData.customerEmail,
      originalAmount: paymentData.amount,
    };

    if (db) {
      await addDoc(collection(db, 'refunds'), refundData);
    }

    // 결제 상태 업데이트
    if (db) {
      await updateDoc(doc(db, 'payments', paymentId), {
        status: 'refunded',
        refundedAt: new Date(),
        updatedAt: new Date(),
        refundAmount: amount,
        refundReason: reason,
        refundId: refund.id,
      });
    }

    // 견적 상태 업데이트 (metadata에 quoteId가 있는 경우)
    if (paymentData.metadata?.quoteId && db) {
      const quoteRef = doc(db, 'quotes', paymentData.metadata.quoteId);
      await updateDoc(quoteRef, {
        paymentStatus: 'refunded',
        refundedAt: new Date(),
        status: 'cancelled'
      });
    }

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      message: '환불이 성공적으로 처리되었습니다.',
    });

  } catch (error) {
    console.error('환불 처리 오류:', error);
    return NextResponse.json(
      { error: '환불 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 부분 환불 처리
export async function PATCH(req: NextRequest) {
  try {
    // Firebase가 비활성화된 경우
    if (!db) {
      return NextResponse.json(
        { success: false, message: 'Database not configured' },
        { status: 503 }
      );
    }

    const { paymentId, amount, reason } = await req.json();

    if (!paymentId || !amount || !reason) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 결제 정보 조회
    const paymentDoc = db ? await getDoc(doc(db, 'payments', paymentId)) : null;
    if (!paymentDoc) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }
    if (!paymentDoc.exists()) {
      return NextResponse.json(
        { error: '결제 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const paymentData = paymentDoc.data();
    
    // 이미 환불된 결제인지 확인
    if (paymentData.status === 'refunded') {
      return NextResponse.json(
        { error: '이미 환불된 결제입니다.' },
        { status: 400 }
      );
    }

    // 부분 환불 금액 검증
    if (amount >= paymentData.amount) {
      return NextResponse.json(
        { error: '부분 환불은 전체 금액보다 작아야 합니다.' },
        { status: 400 }
      );
    }

    // Stripe 부분 환불 처리
    let refund;
    if (paymentData.stripePaymentIntentId && stripe) {
      refund = await stripe.refunds.create({
        payment_intent: paymentData.stripePaymentIntentId,
        amount: amount,
        reason: 'requested_by_customer',
        metadata: {
          refundReason: reason,
          originalPaymentId: paymentId,
          refundType: 'partial',
        },
      });
    }

    if (!refund) {
      return NextResponse.json(
        { error: '부분 환불 처리에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 환불 내역을 Firestore에 저장
    const refundData = {
      id: refund.id,
      paymentId: paymentId,
      amount: amount,
      currency: paymentData.currency,
      reason: reason,
      refundType: 'partial',
      stripeRefundId: refund.id,
      status: refund.status,
      createdAt: new Date(),
      customerEmail: paymentData.customerEmail,
      originalAmount: paymentData.amount,
    };

    if (db) {
      await addDoc(collection(db, 'refunds'), refundData);
    }

    // 결제 상태를 부분 환불로 업데이트
    if (db) {
      await updateDoc(doc(db, 'payments', paymentId), {
        status: 'partially_refunded',
        updatedAt: new Date(),
        refundAmount: (paymentData.refundAmount || 0) + amount,
        refundReason: reason,
        lastRefundId: refund.id,
      });
    }

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      message: '부분 환불이 성공적으로 처리되었습니다.',
    });

  } catch (error) {
    console.error('부분 환불 처리 오류:', error);
    return NextResponse.json(
      { error: '부분 환불 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
