import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export interface NotificationData {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  userId?: string;
  userEmail?: string;
  isRead: boolean;
  createdAt: Date;
  metadata?: {
    paymentId?: string;
    quoteId?: string;
    refundId?: string;
    [key: string]: any;
  };
}

// 알림 생성
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const notificationData: Omit<NotificationData, 'id' | 'createdAt'> = {
      ...body,
      createdAt: new Date(),
    };

    const docRef = db ? await addDoc(collection(db, 'notifications'), notificationData) : null;
    
    return NextResponse.json({
      success: true,
      id: docRef?.id || 'temp-notification-id',
      message: '알림이 생성되었습니다.',
    });
  } catch (error) {
    console.error('알림 생성 오류:', error);
    return NextResponse.json(
      { error: '알림 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 알림 조회
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');
    const isRead = searchParams.get('isRead');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!db) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured',
        notifications: []
      });
    }

    let q = query(
      collection(db, 'notifications'),
      orderBy('createdAt', 'desc')
    );

    if (userEmail) {
      q = query(q, where('userEmail', '==', userEmail));
    }

    if (isRead !== null) {
      q = query(q, where('isRead', '==', isRead === 'true'));
    }

    const snapshot = await getDocs(q);
    const notifications = snapshot.docs.slice(0, limit).map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
    }));

    return NextResponse.json({
      success: true,
      notifications,
      total: notifications.length,
    });
  } catch (error) {
    console.error('알림 조회 오류:', error);
    return NextResponse.json(
      { error: '알림 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 알림 읽음 처리
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isRead } = body;

    if (!id) {
      return NextResponse.json(
        { error: '알림 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    if (db) {
      await updateDoc(doc(db, 'notifications', id), {
        isRead: isRead !== undefined ? isRead : true,
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: '알림 상태가 업데이트되었습니다.',
    });
  } catch (error) {
    console.error('알림 업데이트 오류:', error);
    return NextResponse.json(
      { error: '알림 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 알림 삭제
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '알림 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    if (db) {
      await deleteDoc(doc(db, 'notifications', id));
    }

    return NextResponse.json({
      success: true,
      message: '알림이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('알림 삭제 오류:', error);
    return NextResponse.json(
      { error: '알림 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
