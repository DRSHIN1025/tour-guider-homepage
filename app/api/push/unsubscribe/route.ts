import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

interface UnsubscribeRequest {
  endpoint: string;
  userEmail?: string;
  userId?: string;
}

export async function DELETE(req: NextRequest) {
  try {
    // Firebase가 비활성화된 경우
    if (!db) {
      return NextResponse.json(
        { success: false, message: 'Database not configured' },
        { status: 503 }
      );
    }

    const body: UnsubscribeRequest = await req.json();
    const { endpoint, userEmail, userId } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: '구독 엔드포인트가 필요합니다.' },
        { status: 400 }
      );
    }

    // 구독 찾기
    let q = db ? query(
      collection(db, 'pushSubscriptions'),
      where('endpoint', '==', endpoint)
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

    if (snapshot.empty) {
      return NextResponse.json(
        { error: '구독 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 구독 비활성화 또는 삭제
    const docRef = snapshot.docs[0].ref;
    
    // 선택 1: 구독 비활성화 (데이터 보존)
    if (db) {
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: new Date(),
        unsubscribedAt: new Date(),
      });
    }

    // 선택 2: 구독 완전 삭제 (데이터 영구 삭제)
    // await deleteDoc(docRef);

    return NextResponse.json({
      success: true,
      message: '푸시 알림 구독이 해제되었습니다.',
    });
  } catch (error) {
    console.error('푸시 알림 구독 해제 오류:', error);
    return NextResponse.json(
      { error: '구독 해제에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Firebase가 비활성화된 경우
    if (!db) {
      return NextResponse.json(
        { success: false, message: 'Database not configured' },
        { status: 503 }
      );
    }

    const body: UnsubscribeRequest = await req.json();
    const { endpoint, userEmail, userId } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: '구독 엔드포인트가 필요합니다.' },
        { status: 400 }
      );
    }

    // 구독 찾기
    let q = db ? query(
      collection(db, 'pushSubscriptions'),
      where('endpoint', '==', endpoint)
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

    if (snapshot.empty) {
      return NextResponse.json(
        { error: '구독 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 구독 재활성화
    const docRef = snapshot.docs[0].ref;
    if (db) {
      await updateDoc(docRef, {
        isActive: true,
        updatedAt: new Date(),
        reactivatedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: '푸시 알림 구독이 재활성화되었습니다.',
    });
  } catch (error) {
    console.error('푸시 알림 구독 재활성화 오류:', error);
    return NextResponse.json(
      { error: '구독 재활성화에 실패했습니다.' },
      { status: 500 }
    );
  }
}
