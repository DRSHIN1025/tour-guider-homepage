// 이메일 알림 시스템 - 투어가이더 홈페이지
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  to: string;
  from?: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * 견적 요청 완료 알림 이메일
 */
export const getQuoteConfirmationEmail = (userName: string, destination: string): EmailTemplate => {
  return {
    subject: `[K-BIZ TRAVEL] 견적 요청이 접수되었습니다 - ${destination}`,
    html: `
      <div style="font-family: 'Pretendard', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%); padding: 30px; text-align: center; border-radius: 15px 15px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">K-BIZ TRAVEL</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">동남아 특화 맞춤여행</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 15px 15px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px;">안녕하세요, ${userName}님!</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
            <strong>${destination}</strong> 여행 견적 요청이 성공적으로 접수되었습니다.
          </p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 16px;">📋 견적 요청 내용</h3>
            <ul style="color: #4b5563; margin: 0; padding-left: 20px;">
              <li>여행지: ${destination}</li>
              <li>접수일시: ${new Date().toLocaleString('ko-KR')}</li>
              <li>처리상태: 검토 중</li>
            </ul>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6; margin: 20px 0;">
            전문 여행 상담사가 귀하의 요청사항을 검토한 후, 
            <strong>24시간 이내</strong>에 상세한 견적서와 함께 연락드리겠습니다.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://tourguider.com/dashboard" 
               style="background: linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
              견적 현황 확인하기
            </a>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 14px;">💡 빠른 상담이 필요하신가요?</h4>
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              카카오톡: @kbiztravel<br>
              전화: 010-5940-0104 (평일 9:00-18:00)
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">본 메일은 발신전용입니다. 문의사항은 위 연락처로 연락주세요.</p>
          <p style="margin: 5px 0 0 0;">© 2024 K-BIZ TRAVEL CORP. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
K-BIZ TRAVEL - 견적 요청 접수 완료

안녕하세요, ${userName}님!

${destination} 여행 견적 요청이 성공적으로 접수되었습니다.

📋 견적 요청 내용
- 여행지: ${destination}
- 접수일시: ${new Date().toLocaleString('ko-KR')}
- 처리상태: 검토 중

전문 여행 상담사가 귀하의 요청사항을 검토한 후, 
24시간 이내에 상세한 견적서와 함께 연락드리겠습니다.

견적 현황 확인: https://tourguider.com/dashboard

💡 빠른 상담이 필요하신가요?
카카오톡: @kbiztravel
전화: 010-5940-0104 (평일 9:00-18:00)

본 메일은 발신전용입니다. 문의사항은 위 연락처로 연락주세요.
© 2024 K-BIZ TRAVEL CORP. All rights reserved.
    `
  };
};

/**
 * 견적 완료 알림 이메일
 */
export const getQuoteCompletedEmail = (userName: string, destination: string, quoteAmount: string): EmailTemplate => {
  return {
    subject: `[K-BIZ TRAVEL] ${destination} 여행 견적이 완성되었습니다!`,
    html: `
      <div style="font-family: 'Pretendard', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 15px 15px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎉 견적 완성!</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">${destination} 여행 견적이 준비되었습니다</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 15px 15px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px;">안녕하세요, ${userName}님!</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
            요청하신 <strong>${destination}</strong> 여행 견적이 완성되었습니다!
          </p>
          
          <div style="background: #ecfdf5; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #065f46; margin: 0 0 15px 0; font-size: 18px;">💰 견적 금액</h3>
            <div style="font-size: 24px; font-weight: bold; color: #065f46; text-align: center;">
              ${quoteAmount}
            </div>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 16px;">📋 견적서 확인</h3>
            <p style="color: #4b5563; margin: 0 0 15px 0;">
              상세한 견적서를 확인하고 예약을 진행하세요.
            </p>
            <div style="text-align: center;">
              <a href="https://tourguider.com/dashboard" 
                 style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                견적서 확인하기
              </a>
            </div>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 14px;">⏰ 견적 유효기간</h4>
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              이 견적은 <strong>7일간</strong> 유효합니다.<br>
              빠른 예약을 권장드립니다!
            </p>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
            <h4 style="color: #0c4a6e; margin: 0 0 10px 0; font-size: 14px;">📞 추가 문의사항</h4>
            <p style="color: #0c4a6e; margin: 0; font-size: 14px;">
              견적서에 대한 궁금한 점이 있으시면 언제든 연락주세요!<br>
              카카오톡: @kbiztravel | 전화: 010-5940-0104
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">본 메일은 발신전용입니다. 문의사항은 위 연락처로 연락주세요.</p>
          <p style="margin: 5px 0 0 0;">© 2024 K-BIZ TRAVEL CORP. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
K-BIZ TRAVEL - 견적 완성 알림

안녕하세요, ${userName}님!

요청하신 ${destination} 여행 견적이 완성되었습니다!

💰 견적 금액: ${quoteAmount}

📋 견적서 확인
상세한 견적서를 확인하고 예약을 진행하세요.
견적서 확인: https://tourguider.com/dashboard

⏰ 견적 유효기간
이 견적은 7일간 유효합니다. 빠른 예약을 권장드립니다!

📞 추가 문의사항
견적서에 대한 궁금한 점이 있으시면 언제든 연락주세요!
카카오톡: @kbiztravel
전화: 010-5940-0104

본 메일은 발신전용입니다. 문의사항은 위 연락처로 연락주세요.
© 2024 K-BIZ TRAVEL CORP. All rights reserved.
    `
  };
};

/**
 * 레퍼럴 보상 지급 알림 이메일
 */
export const getReferralRewardEmail = (userName: string, referredUserName: string, amount: number): EmailTemplate => {
  return {
    subject: `[K-BIZ TRAVEL] 🎁 레퍼럴 보상이 지급되었습니다!`,
    html: `
      <div style="font-family: 'Pretendard', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); padding: 30px; text-align: center; border-radius: 15px 15px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎁 레퍼럴 보상!</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">친구 초대로 보상을 받았습니다</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 15px 15px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px;">축하합니다, ${userName}님!</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
            <strong>${referredUserName}</strong>님이 귀하의 추천으로 가입하여 
            레퍼럴 보상이 지급되었습니다!
          </p>
          
          <div style="background: #fdf4ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
            <h3 style="color: #581c87; margin: 0 0 15px 0; font-size: 18px;">💰 지급된 보상</h3>
            <div style="font-size: 24px; font-weight: bold; color: #581c87; text-align: center;">
              +${amount.toLocaleString()}원
            </div>
            <p style="color: #581c87; margin: 10px 0 0 0; text-align: center; font-size: 14px;">
              계좌로 자동 입금되었습니다
            </p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 16px;">📊 레퍼럴 현황</h3>
            <p style="color: #4b5563; margin: 0 0 15px 0;">
              현재 레퍼럴 현황과 추가 보상을 확인해보세요.
            </p>
            <div style="text-align: center;">
              <a href="https://tourguider.com/referral" 
                 style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                레퍼럴 현황 보기
              </a>
            </div>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 14px;">🚀 더 많은 보상을 받는 방법</h4>
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              친구를 더 많이 초대할수록 더 큰 보상을 받을 수 있습니다!<br>
              브론즈 → 실버 → 골드 레벨로 업그레이드하세요.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">본 메일은 발신전용입니다. 문의사항은 고객센터로 연락주세요.</p>
          <p style="margin: 5px 0 0 0;">© 2024 K-BIZ TRAVEL CORP. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
K-BIZ TRAVEL - 레퍼럴 보상 지급 알림

축하합니다, ${userName}님!

${referredUserName}님이 귀하의 추천으로 가입하여 
레퍼럴 보상이 지급되었습니다!

💰 지급된 보상: +${amount.toLocaleString()}원
계좌로 자동 입금되었습니다

📊 레퍼럴 현황
현재 레퍼럴 현황과 추가 보상을 확인해보세요.
레퍼럴 현황: https://tourguider.com/referral

🚀 더 많은 보상을 받는 방법
친구를 더 많이 초대할수록 더 큰 보상을 받을 수 있습니다!
브론즈 → 실버 → 골드 레벨로 업그레이드하세요.

본 메일은 발신전용입니다. 문의사항은 고객센터로 연락주세요.
© 2024 K-BIZ TRAVEL CORP. All rights reserved.
    `
  };
};

/**
 * 여행 일정 알림 이메일
 */
export const getTravelReminderEmail = (userName: string, destination: string, travelDate: string): EmailTemplate => {
  return {
    subject: `[K-BIZ TRAVEL] ✈️ ${destination} 여행이 ${travelDate}에 시작됩니다!`,
    html: `
      <div style="font-family: 'Pretendard', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 30px; text-align: center; border-radius: 15px 15px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">✈️ 여행 준비!</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">${destination} 여행이 곧 시작됩니다</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 15px 15px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px;">안녕하세요, ${userName}님!</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
            <strong>${destination}</strong> 여행이 <strong>${travelDate}</strong>에 시작됩니다!<br>
            여행 준비를 위한 체크리스트를 확인해보세요.
          </p>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">📋 여행 전 체크리스트</h3>
            <ul style="color: #92400e; margin: 0; padding-left: 20px;">
              <li>여권 유효기간 확인 (6개월 이상)</li>
              <li>항공권 및 호텔 예약 확인</li>
              <li>여행 보험 가입 확인</li>
              <li>필수 의약품 준비</li>
              <li>현지 통화 및 신용카드 준비</li>
            </ul>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
            <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">📱 여행 정보</h3>
            <p style="color: #0c4a6e; margin: 0 0 15px 0;">
              상세한 여행 일정과 현지 가이드 연락처를 확인하세요.
            </p>
            <div style="text-align: center;">
              <a href="https://tourguider.com/dashboard" 
                 style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                여행 정보 확인
              </a>
            </div>
          </div>
          
          <div style="background: #ecfdf5; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h4 style="color: #065f46; margin: 0 0 10px 0; font-size: 14px;">🆘 긴급 연락처</h4>
            <p style="color: #065f46; margin: 0; font-size: 14px;">
              여행 중 문제가 발생하면 즉시 연락주세요!<br>
              현지 가이드: +82-10-1234-5678<br>
              K-BIZ TRAVEL: +82-2-1234-5678
            </p>
          </div>
          
          <div style="background: #fdf2f8; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ec4899;">
            <h4 style="color: #831843; margin: 0 0 10px 0; font-size: 14px;">🌟 즐거운 여행 되세요!</h4>
            <p style="color: #831843; margin: 0; font-size: 14px;">
              ${destination}에서 특별하고 아름다운 추억을 만드시길 바랍니다.<br>
              안전하고 즐거운 여행 되세요! 🎉
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">본 메일은 발신전용입니다. 문의사항은 고객센터로 연락주세요.</p>
          <p style="margin: 5px 0 0 0;">© 2024 K-BIZ TRAVEL CORP. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
K-BIZ TRAVEL - 여행 일정 알림

안녕하세요, ${userName}님!

${destination} 여행이 ${travelDate}에 시작됩니다!
여행 준비를 위한 체크리스트를 확인해보세요.

📋 여행 전 체크리스트
- 여권 유효기간 확인 (6개월 이상)
- 항공권 및 호텔 예약 확인
- 여행 보험 가입 확인
- 필수 의약품 준비
- 현지 통화 및 신용카드 준비

📱 여행 정보
상세한 여행 일정과 현지 가이드 연락처를 확인하세요.
여행 정보 확인: https://tourguider.com/dashboard

🆘 긴급 연락처
여행 중 문제가 발생하면 즉시 연락주세요!
현지 가이드: +82-10-1234-5678
K-BIZ TRAVEL: +82-2-1234-5678

🌟 즐거운 여행 되세요!
${destination}에서 특별하고 아름다운 추억을 만드시길 바랍니다.
안전하고 즐거운 여행 되세요! 🎉

본 메일은 발신전용입니다. 문의사항은 고객센터로 연락주세요.
© 2024 K-BIZ TRAVEL CORP. All rights reserved.
    `
  };
};

/**
 * 이메일 전송 함수
 */
export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    // 실제 이메일 전송 로직 구현
    // 여기서는 Firebase Functions나 외부 이메일 서비스 사용
    
    // 개발 환경에서는 로컬 스토리지에 저장
    if (process.env.NODE_ENV === 'development') {
      const emails = JSON.parse(localStorage.getItem('sentEmails') || '[]');
      emails.push({
        ...emailData,
        sentAt: new Date().toISOString(),
        id: Date.now().toString()
      });
      localStorage.setItem('sentEmails', JSON.stringify(emails));
    }
    
    return true;
  } catch (error) {
    console.error('이메일 전송 실패:', error);
    return false;
  }
}

/**
 * 견적 요청 완료 알림 이메일 전송
 */
export const sendQuoteConfirmationEmail = async (userEmail: string, userName: string, destination: string): Promise<boolean> => {
  const emailTemplate = getQuoteConfirmationEmail(userName, destination);
  
  const emailData: EmailData = {
    to: userEmail,
    from: 'noreply@kbiztravel.com',
    subject: emailTemplate.subject,
    html: emailTemplate.html,
    text: emailTemplate.text
  };
  
  return await sendEmail(emailData);
};

/**
 * 견적 완료 알림 이메일 전송
 */
export const sendQuoteCompletedEmail = async (userEmail: string, userName: string, destination: string, quoteAmount: string): Promise<boolean> => {
  const emailTemplate = getQuoteCompletedEmail(userName, destination, quoteAmount);
  
  const emailData: EmailData = {
    to: userEmail,
    from: 'noreply@kbiztravel.com',
    subject: emailTemplate.subject,
    html: emailTemplate.html,
    text: emailTemplate.text
  };
  
  return await sendEmail(emailData);
};

/**
 * 레퍼럴 보상 지급 알림 이메일 전송
 */
export const sendReferralRewardEmail = async (userEmail: string, userName: string, referredUserName: string, amount: number): Promise<boolean> => {
  const emailTemplate = getReferralRewardEmail(userName, referredUserName, amount);
  
  const emailData: EmailData = {
    to: userEmail,
    from: 'noreply@kbiztravel.com',
    subject: emailTemplate.subject,
    html: emailTemplate.html,
    text: emailTemplate.text
  };
  
  return await sendEmail(emailData);
};

/**
 * 여행 일정 알림 이메일 전송
 */
export const sendTravelReminderEmail = async (userEmail: string, userName: string, destination: string, travelDate: string): Promise<boolean> => {
  const emailTemplate = getTravelReminderEmail(userName, destination, travelDate);
  
  const emailData: EmailData = {
    to: userEmail,
    from: 'noreply@kbiztravel.com',
    subject: emailTemplate.subject,
    html: emailTemplate.html,
    text: emailTemplate.text
  };
  
  return await sendEmail(emailData);
};
