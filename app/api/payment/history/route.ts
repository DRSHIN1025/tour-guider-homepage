import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const lastDocId = searchParams.get('lastDocId');

    if (!email) {
      return NextResponse.json(
        { error: '이메일이 필요합니다.' },
        { status: 400 }
      );
    }

    // 쿼리 구성
    let q = query(
      collection(db, 'payments'),
      where('customerEmail', '==', email),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    // 상태 필터 추가
    if (status && status !== 'all') {
      q = query(q, where('status', '==', status));
    }

    // 페이지네이션 처리
    if (page > 1 && lastDocId) {
      const lastDoc = await getDocs(query(collection(db, 'payments'), where('__name__', '==', lastDocId)));
      if (!lastDoc.empty) {
        q = query(q, startAfter(lastDoc.docs[0]));
      }
    }

    const snapshot = await getDocs(q);
    const payments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
      paidAt: doc.data().paidAt?.toDate?.() || doc.data().paidAt,
      refundedAt: doc.data().refundedAt?.toDate?.() || doc.data().refundedAt,
    }));

    // 다음 페이지 존재 여부 확인
    const hasNextPage = payments.length === pageSize;

    return NextResponse.json({
      success: true,
      payments,
      pagination: {
        currentPage: page,
        pageSize,
        hasNextPage,
        total: payments.length,
        lastDocId: hasNextPage ? payments[payments.length - 1].id : null,
      },
    });

  } catch (error) {
    console.error('결제 내역 조회 오류:', error);
    return NextResponse.json(
      { error: '결제 내역 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 결제 통계 조회
export async function POST(req: NextRequest) {
  try {
    const { email, period } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: '이메일이 필요합니다.' },
        { status: 400 }
      );
    }

    // 기간별 필터링
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1); // 기본값: 1개월
    }

    // 결제 통계 쿼리
    const paymentsQuery = query(
      collection(db, 'payments'),
      where('customerEmail', '==', email),
      where('createdAt', '>=', startDate),
      where('status', 'in', ['succeeded', 'completed'])
    );

    const refundsQuery = query(
      collection(db, 'refunds'),
      where('customerEmail', '==', email),
      where('createdAt', '>=', startDate)
    );

    const [paymentsSnapshot, refundsSnapshot] = await Promise.all([
      getDocs(paymentsQuery),
      getDocs(refundsQuery)
    ]);

    // 통계 계산
    const totalPayments = paymentsSnapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
    const totalRefunds = refundsSnapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
    const netAmount = totalPayments - totalRefunds;
    const paymentCount = paymentsSnapshot.docs.length;
    const refundCount = refundsSnapshot.docs.length;

    // 상태별 결제 건수
    const statusCounts = {
      succeeded: 0,
      completed: 0,
      failed: 0,
      refunded: 0,
      partially_refunded: 0,
    };

    paymentsSnapshot.docs.forEach(doc => {
      const status = doc.data().status as keyof typeof statusCounts;
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      }
    });

    return NextResponse.json({
      success: true,
      statistics: {
        period,
        totalPayments,
        totalRefunds,
        netAmount,
        paymentCount,
        refundCount,
        statusCounts,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
      },
    });

  } catch (error) {
    console.error('결제 통계 조회 오류:', error);
    return NextResponse.json(
      { error: '결제 통계 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
