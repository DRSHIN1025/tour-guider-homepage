import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  try {
    // Firebase가 비활성화된 경우
    if (!db) {
      return NextResponse.json(
        { success: false, message: 'Database not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: '이메일이 필요합니다.' },
        { status: 400 }
      );
    }

    // 사용자 견적 요청 조회
    const quotesRef = db ? collection(db, 'quotes') : null;
    if (!quotesRef) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }
    const q = query(
      quotesRef,
      where('email', '==', email),
      orderBy('createdAt', 'desc')
    );

    const snapshot = q ? await getDocs(q) : null;
    if (!snapshot) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }
    const quotes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    }));

    return NextResponse.json({
      success: true,
      quotes,
      total: quotes.length,
    });

  } catch (error) {
    console.error('사용자 견적 조회 오류:', error);
    return NextResponse.json(
      { error: '견적 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
