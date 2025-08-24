import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

interface PushNotificationRequest {
  title: string;
  message: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  targetUsers?: {
    userEmails?: string[];
    userIds?: string[];
    allUsers?: boolean;
  };
  scheduleAt?: string; // ISO string for scheduled notifications
}

interface PushSubscription {
  id: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userEmail?: string;
  userId?: string;
  isActive: boolean;
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

    const body: PushNotificationRequest = await req.json();
    const { 
      title, 
      message, 
      tag, 
      data, 
      actions, 
      requireInteraction,
      targetUsers,
      scheduleAt 
    } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: '제목과 메시지는 필수입니다.' },
        { status: 400 }
      );
    }

    // 구독자 조회
    let subscriptionsQuery = db ? query(
      collection(db, 'pushSubscriptions'),
      where('isActive', '==', true)
    ) : null;

    if (!subscriptionsQuery) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    if (targetUsers) {
      if (targetUsers.userEmails && targetUsers.userEmails.length > 0 && subscriptionsQuery) {
        subscriptionsQuery = query(
          subscriptionsQuery,
          where('userEmail', 'in', targetUsers.userEmails)
        );
      } else if (targetUsers.userIds && targetUsers.userIds.length > 0 && subscriptionsQuery) {
        subscriptionsQuery = query(
          subscriptionsQuery,
          where('userId', 'in', targetUsers.userIds)
        );
      }
      // allUsers가 true이면 모든 활성 구독자에게 전송
    }

    const subscriptionsSnapshot = subscriptionsQuery ? await getDocs(subscriptionsQuery) : null;
    if (!subscriptionsSnapshot) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }
    const subscriptions = subscriptionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as PushSubscription[];

    if (subscriptions.length === 0) {
      return NextResponse.json(
        { error: '전송할 구독자가 없습니다.' },
        { status: 404 }
      );
    }

    // 알림 로그 저장
    const notificationLog = {
      title,
      message,
      tag,
      data,
      actions,
      requireInteraction,
      targetUsers,
      scheduleAt: scheduleAt ? new Date(scheduleAt) : null,
      sentAt: new Date(),
      targetCount: subscriptions.length,
      status: 'pending'
    };

    const logRef = db ? await addDoc(collection(db, 'pushNotificationLogs'), notificationLog) : null;
    if (!logRef) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    // 실제 푸시 알림 전송 (실제 구현에서는 web-push 라이브러리 사용)
    const sentResults = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          // 여기서 실제 web-push 라이브러리를 사용하여 푸시 알림 전송
          // const result = await webpush.sendNotification(
          //   subscription.endpoint,
          //   JSON.stringify({
          //     title,
          //     message,
          //     tag,
          //     data,
          //     actions,
          //     requireInteraction
          //   }),
          //     {
          //       vapidDetails: {
          //         subject: 'mailto:your-email@example.com',
          //         publicKey: process.env.VAPID_PUBLIC_KEY!,
          //         privateKey: process.env.VAPID_PRIVATE_KEY!,
          //       },
          //     }
          // );

          // 개발용: 성공으로 가정
          return {
            subscriptionId: subscription.id,
            userEmail: subscription.userEmail,
            userId: subscription.userId,
            status: 'success',
            message: '알림 전송 성공'
          };
        } catch (error) {
          console.error(`구독자 ${subscription.id}에게 알림 전송 실패:`, error);
          return {
            subscriptionId: subscription.id,
            userEmail: subscription.userEmail,
            userId: subscription.userId,
            status: 'failed',
            message: error instanceof Error ? error.message : '알 수 없는 오류'
          };
        }
      })
    );

    // 결과 분석
    const successfulSends = sentResults.filter(
      result => result.status === 'fulfilled' && result.value.status === 'success'
    ).length;
    
    const failedSends = sentResults.length - successfulSends;

    // 로그 업데이트
    if (db) {
      await addDoc(collection(db, 'pushNotificationResults'), {
        logId: logRef.id,
        results: sentResults.map(result => 
          result.status === 'fulfilled' ? result.value : { status: 'failed', message: 'Promise rejected' }
        ),
        successfulCount: successfulSends,
        failedCount: failedSends,
        completedAt: new Date()
      });
    }

    return NextResponse.json({
      success: true,
      message: `푸시 알림이 ${successfulSends}명에게 전송되었습니다.`,
      logId: logRef.id,
      totalTargets: subscriptions.length,
      successfulSends,
      failedSends,
      results: sentResults.map(result => 
        result.status === 'fulfilled' ? result.value : { status: 'failed', message: 'Promise rejected' }
      )
    });

  } catch (error) {
    console.error('푸시 알림 전송 오류:', error);
    return NextResponse.json(
      { error: '푸시 알림 전송에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 스케줄된 알림 조회
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
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let q = db ? query(
      collection(db, 'pushNotificationLogs'),
      // orderBy('sentAt', 'desc')
    ) : null;

    if (!q) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    if (status && q) {
      q = query(q, where('status', '==', status));
    }

    const snapshot = q ? await getDocs(q) : null;
    if (!snapshot) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }
    const logs = snapshot.docs.slice(0, limit).map(doc => ({
      id: doc.id,
      ...doc.data(),
      sentAt: doc.data().sentAt?.toDate?.() || doc.data().sentAt,
      scheduleAt: doc.data().scheduleAt?.toDate?.() || doc.data().scheduleAt,
    }));

    return NextResponse.json({
      success: true,
      logs,
      total: logs.length,
    });
  } catch (error) {
    console.error('푸시 알림 로그 조회 오류:', error);
    return NextResponse.json(
      { error: '로그 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}
