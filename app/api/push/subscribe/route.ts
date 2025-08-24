import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

interface PushSubscriptionRequest {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userEmail?: string;
  userId?: string;
}

export async function POST(req: NextRequest) {
  try {
    // Firebase가 비활성화된 경우
    if (!db) {
      return NextResponse.json(
        { success: false, message: 'Database not configured' },
        { status: 503 }
      );
    }

    const body: PushSubscriptionRequest = await req.json();
    const { endpoint, keys, userEmail, userId } = body;

    if (!endpoint || !keys.p256dh || !keys.auth) {
      return NextResponse.json(
        { error: '필수 구독 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 기존 구독 확인
    const existingQuery = db ? query(
      collection(db, 'pushSubscriptions'),
      where('endpoint', '==', endpoint)
    ) : null;
    
    if (!existingQuery) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }
    
    const existingDocs = await getDocs(existingQuery);
    
    if (!existingDocs.empty) {
      // 기존 구독 업데이트
      const docRef = existingDocs.docs[0].ref;
      if (db) {
        await updateDoc(docRef, {
          keys,
          userEmail,
          userId,
          updatedAt: new Date(),
        });
      }

      return NextResponse.json({
        success: true,
        message: '구독 정보가 업데이트되었습니다.',
        id: docRef.id,
      });
    } else {
      // 새 구독 생성
      const docRef = db ? await addDoc(collection(db, 'pushSubscriptions'), {
        endpoint,
        keys,
        userEmail,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      }) : null;

      if (!docRef) {
        return NextResponse.json(
          { error: 'Database not configured' },
          { status: 503 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '푸시 알림 구독이 완료되었습니다.',
        id: docRef.id,
      });
    }
  } catch (error) {
    console.error('푸시 알림 구독 처리 오류:', error);
    return NextResponse.json(
      { error: '구독 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
}

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
    const userEmail = searchParams.get('userEmail');
    const userId = searchParams.get('userId');

    let q = db ? query(
      collection(db, 'pushSubscriptions'),
      where('isActive', '==', true)
    ) : null;

    if (!q) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    if (userEmail && q) {
      q = query(q, where('userEmail', '==', userEmail));
    }

    if (userId && q) {
      q = query(q, where('userId', '==', userId));
    }

    const snapshot = q ? await getDocs(q) : null;
    if (!snapshot) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }
    const subscriptions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    }));

    return NextResponse.json({
      success: true,
      subscriptions,
      total: subscriptions.length,
    });
  } catch (error) {
    console.error('푸시 알림 구독 조회 오류:', error);
    return NextResponse.json(
      { error: '구독 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}
