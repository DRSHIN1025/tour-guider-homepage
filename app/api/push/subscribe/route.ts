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
    const body: PushSubscriptionRequest = await req.json();
    const { endpoint, keys, userEmail, userId } = body;

    if (!endpoint || !keys.p256dh || !keys.auth) {
      return NextResponse.json(
        { error: '필수 구독 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 기존 구독 확인
    const existingQuery = query(
      collection(db, 'pushSubscriptions'),
      where('endpoint', '==', endpoint)
    );
    
    const existingDocs = await getDocs(existingQuery);
    
    if (!existingDocs.empty) {
      // 기존 구독 업데이트
      const docRef = existingDocs.docs[0].ref;
      await updateDoc(docRef, {
        keys,
        userEmail,
        userId,
        updatedAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        message: '구독 정보가 업데이트되었습니다.',
        id: docRef.id,
      });
    } else {
      // 새 구독 생성
      const docRef = await addDoc(collection(db, 'pushSubscriptions'), {
        endpoint,
        keys,
        userEmail,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      });

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
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');
    const userId = searchParams.get('userId');

    let q = query(
      collection(db, 'pushSubscriptions'),
      where('isActive', '==', true)
    );

    if (userEmail) {
      q = query(q, where('userEmail', '==', userEmail));
    }

    if (userId) {
      q = query(q, where('userId', '==', userId));
    }

    const snapshot = await getDocs(q);
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
