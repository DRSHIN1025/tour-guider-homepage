import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { sendEmail } from '@/lib/email';

interface EmailNotificationRequest {
  type: 'payment_success' | 'payment_failed' | 'quote_submitted' | 'quote_approved' | 'quote_rejected' | 'refund_requested' | 'refund_processed' | 'admin_notification';
  title: string;
  message: string;
  userEmail: string;
  userName?: string;
  userId?: string;
  data?: any;
  priority?: 'low' | 'normal' | 'high';
  scheduleAt?: string;
}

interface EmailNotificationLog {
  id: string;
  type: string;
  title: string;
  message: string;
  userEmail: string;
  userName?: string;
  userId?: string;
  data?: any;
  priority: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: Date;
  scheduleAt?: Date;
  errorMessage?: string;
  retryCount: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: EmailNotificationRequest = await req.json();
    const { 
      type, 
      title, 
      message, 
      userEmail, 
      userName, 
      userId, 
      data, 
      priority = 'normal',
      scheduleAt 
    } = body;

    if (!type || !title || !message || !userEmail) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 이메일 알림 로그 저장
    const notificationLog: Omit<EmailNotificationLog, 'id'> = {
      type,
      title,
      message,
      userEmail,
      userName,
      userId,
      data,
      priority,
      status: 'pending',
      retryCount: 0,
      scheduleAt: scheduleAt ? new Date(scheduleAt) : undefined
    };

    const logRef = db ? await addDoc(collection(db, 'emailNotificationLogs'), notificationLog) : null;

    // 즉시 전송이 아닌 경우 (스케줄된 알림)
    if (scheduleAt && new Date(scheduleAt) > new Date()) {
      return NextResponse.json({
        success: true,
        message: '이메일 알림이 스케줄되었습니다.',
        logId: logRef?.id || 'temp-log-id',
        scheduledFor: scheduleAt
      });
    }

    // 즉시 이메일 전송
    try {
      const emailTemplate = getEmailTemplate(type, {
        title,
        message,
        userName: userName || '고객님',
        data
      });

      await sendEmail({
        to: userEmail,
        subject: title,
        html: emailTemplate
      });

      // 로그 업데이트
      if (db) {
        await addDoc(collection(db, 'emailNotificationResults'), {
          logId: logRef?.id || 'temp-log-id',
          status: 'sent',
          sentAt: new Date(),
          emailProvider: 'sendgrid', // 또는 사용 중인 이메일 서비스
          messageId: `email_${Date.now()}` // 실제 메시지 ID로 교체
        });
      }

      return NextResponse.json({
        success: true,
        message: '이메일 알림이 성공적으로 전송되었습니다.',
        logId: logRef?.id || 'temp-log-id'
      });

    } catch (emailError) {
      console.error('이메일 전송 실패:', emailError);
      
      // 실패 로그 업데이트
      if (db) {
        await addDoc(collection(db, 'emailNotificationResults'), {
          logId: logRef?.id || 'temp-log-id',
          status: 'failed',
          failedAt: new Date(),
          errorMessage: emailError instanceof Error ? emailError.message : '알 수 없는 오류',
          retryCount: 1
        });
      }

      return NextResponse.json(
        { error: '이메일 전송에 실패했습니다.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('이메일 알림 처리 오류:', error);
    return NextResponse.json(
      { error: '이메일 알림 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 이메일 템플릿 생성
function getEmailTemplate(type: string, data: any): string {
  const baseTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>투어가이더 알림</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>투어가이더</h1>
          <p>현지 전문가와 함께하는 맞춤형 여행 상담</p>
        </div>
        <div class="content">
          <h2>${data.title}</h2>
          <p>안녕하세요, <strong>${data.userName}</strong>님!</p>
          <div class="highlight">
            ${data.message}
          </div>
          <div style="text-align: center;">
            <a href="https://tourguider.com" class="button">투어가이더 홈페이지 방문</a>
          </div>
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            이 이메일에 대한 문의사항이 있으시면 언제든 연락주세요.<br>
            전화: 010-5940-0104 | 이메일: help@tourguider.com
          </p>
        </div>
        <div class="footer">
          <p>© 2024 투어가이더. All rights reserved.</p>
          <p>이 이메일은 투어가이더 서비스 이용과 관련된 중요한 알림입니다.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // 타입별 맞춤 템플릿
  switch (type) {
    case 'payment_success':
      return baseTemplate.replace(
        '${data.message}',
        `결제가 성공적으로 완료되었습니다.<br><br>
        <strong>결제 금액:</strong> ${data.data?.amount || '확인 중'}<br>
        <strong>결제 일시:</strong> ${new Date().toLocaleString('ko-KR')}<br>
        <strong>서비스:</strong> ${data.data?.serviceName || '여행 상담 서비스'}`
      );
    
    case 'quote_submitted':
      return baseTemplate.replace(
        '${data.message}',
        `견적 요청이 성공적으로 접수되었습니다.<br><br>
        <strong>요청 일시:</strong> ${new Date().toLocaleString('ko-KR')}<br>
        <strong>상태:</strong> 검토 중<br><br>
        전문가가 검토한 후 빠른 시일 내에 연락드리겠습니다.`
      );
    
    case 'quote_approved':
      return baseTemplate.replace(
        '${data.message}',
        `축하합니다! 견적 요청이 승인되었습니다.<br><br>
        <strong>승인 일시:</strong> ${new Date().toLocaleString('ko-KR')}<br>
        <strong>다음 단계:</strong> 결제 진행<br><br>
        결제를 완료하시면 상담 서비스를 이용하실 수 있습니다.`
      );
    
    case 'refund_processed':
      return baseTemplate.replace(
        '${data.message}',
        `환불 처리가 완료되었습니다.<br><br>
        <strong>환불 금액:</strong> ${data.data?.amount || '확인 중'}<br>
        <strong>처리 일시:</strong> ${new Date().toLocaleString('ko-KR')}<br>
        <strong>환불 방법:</strong> 원결제 수단으로 환불<br><br>
        환불금은 3-5일 내에 반영됩니다.`
      );
    
    default:
      return baseTemplate.replace('${data.message}', data.message);
  }
}

// 이메일 알림 로그 조회
export async function GET(req: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured',
        logs: []
      });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const userEmail = searchParams.get('userEmail');
    const limit = parseInt(searchParams.get('limit') || '50');

    let q = query(
      collection(db, 'emailNotificationLogs'),
      orderBy('sentAt', 'desc')
    );

    if (status) {
      q = query(q, where('status', '==', status));
    }

    if (type) {
      q = query(q, where('type', '==', type));
    }

    if (userEmail) {
      q = query(q, where('userEmail', '==', userEmail));
    }

    const snapshot = await getDocs(q);
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
    console.error('이메일 알림 로그 조회 오류:', error);
    return NextResponse.json(
      { error: '로그 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}
