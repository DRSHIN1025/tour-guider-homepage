import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: '이메일이 필요합니다.' },
        { status: 400 }
      );
    }

    // 사용자 견적 요청 조회
    const quotesRef = collection(db, 'quotes');
    const q = query(
      quotesRef,
      where('email', '==', email),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
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
