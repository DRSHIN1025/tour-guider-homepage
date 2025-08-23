# 투어가이더 홈페이지 🚀

현지 전문가와 함께하는 맞춤형 여행 상담 서비스 플랫폼입니다.

## ✨ 주요 기능

### 🔐 인증 시스템
- **Firebase Authentication** 기반 로그인/회원가입
- **소셜 로그인**: Google, Kakao, Naver 지원
- **관리자 전용 로그인** 시스템
- **세션 관리** 및 보안 기능

### 📧 통합 알림 시스템
- **실시간 알림**: Firestore 기반 실시간 상태 변경 알림
- **푸시 알림**: 브라우저 레벨 푸시 알림 (Service Worker)
- **이메일 알림**: 중요한 알림을 이메일로도 전송
- **사용자별 설정**: 개인화된 알림 선호도 및 조용한 시간 설정
- **알림 히스토리**: 과거 알림 조회, 검색, 필터링, CSV 내보내기

### 💳 결제 시스템
- **Stripe** 기반 안전한 결제 처리
- **3가지 상담 서비스** 제공:
  - 기본 상담 서비스 (50,000원)
  - 프리미엄 상담 서비스 (100,000원)
  - 완전 패키지 서비스 (200,000원)
- **결제 성공/실패** 페이지
- **결제 내역 관리**

### 💬 카카오 채팅
- **KakaoTalk Channel** 연동
- **실시간 상담** 기능
- **24시간 고객 지원**

### 📋 견적 요청 시스템
- **맞춤형 여행 견적** 요청
- **파일 업로드** 기능
- **실시간 상태 추적**

### 👨‍💼 관리자 대시보드
- **견적 요청 관리**
- **고객 정보 관리**
- **결제 내역 관리**
- **푸시 알림 관리**: 타겟팅, 스케줄링, 커스텀 액션
- **Excel/CSV 다운로드**

### 👤 사용자 대시보드
- **내 견적 요청** 확인
- **결제 내역** 조회
- **상담 서비스** 이용
- **알림 센터**: 통합 알림 관리 및 히스토리
- **개인 설정**: 푸시 알림 및 이메일 알림 설정

## 🛠️ 기술 스택

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn UI**
- **Lucide React**

### Backend
- **Firebase Firestore** (데이터베이스)
- **Firebase Storage** (파일 저장)
- **Firebase Authentication** (인증)
- **Stripe** (결제)

### 외부 서비스
- **Kakao Developers** (카카오 채팅)
- **Vercel** (배포)

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/tour-guider-homepage.git
cd tour-guider-homepage
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
```bash
cp env.example .env.local
```

`.env.local` 파일을 편집하여 필요한 API 키들을 설정하세요:

```env
# Firebase 설정
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe 설정
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Kakao 설정
NEXT_PUBLIC_KAKAO_APP_KEY=your_kakao_app_key
KAKAO_ADMIN_KEY=your_kakao_admin_key
NEXT_PUBLIC_KAKAO_CHANNEL_ID=your_channel_id

# 기타 설정
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조

```
tour-guider-homepage/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   ├── admin/             # 관리자 페이지
│   ├── dashboard/         # 사용자 대시보드
│   ├── payment/           # 결제 관련 페이지
│   ├── quote/             # 견적 요청 페이지
│   └── reviews/           # 후기 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/               # Shadcn UI 컴포넌트
│   ├── AuthModal.tsx     # 인증 모달
│   ├── KakaoChat.tsx     # 카카오 채팅
│   └── UserHeader.tsx    # 사용자 헤더
├── hooks/                # 커스텀 훅
├── lib/                  # 유틸리티 및 설정
└── public/               # 정적 파일
```

## 🔧 설정 가이드

### Firebase 설정
1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
2. Authentication, Firestore, Storage 활성화
3. 웹 앱 추가 및 설정 정보 복사

### Stripe 설정
1. [Stripe Dashboard](https://dashboard.stripe.com/)에서 계정 생성
2. API 키 발급 (테스트/실제)
3. 웹훅 설정 (선택사항)

### Kakao 설정
1. [Kakao Developers](https://developers.kakao.com/)에서 앱 생성
2. KakaoTalk Channel 생성
3. JavaScript 키 및 채널 ID 발급

## 🚀 배포

### Vercel 배포
1. GitHub 저장소를 Vercel에 연결
2. 환경 변수 설정
3. 자동 배포 활성화

### 환경 변수 설정 (Vercel)
- Vercel 대시보드에서 프로젝트 설정
- Environment Variables 섹션에서 모든 환경 변수 추가

## 📱 주요 페이지

- **홈페이지** (`/`): 메인 랜딩 페이지
- **견적 요청** (`/quote`): 맞춤 견적 요청
- **결제** (`/payment`): 상담 서비스 결제
- **사용자 대시보드** (`/dashboard`): 개인 정보, 견적 관리, 알림 센터
- **관리자 대시보드** (`/admin`): 전체 시스템 관리, 푸시 알림 관리
- **알림 센터** (`/notifications`): 사용자 알림 관리
- **후기** (`/reviews`): 여행 후기 및 리뷰

## 🔒 보안 기능

- **Firebase Security Rules** 설정
- **관리자 인증** 시스템
- **세션 관리** 및 자동 로그아웃
- **입력 검증** 및 XSS 방지
- **HTTPS** 강제 적용

## 🎨 디자인 시스템

- **Tailwind CSS** 기반 반응형 디자인
- **Shadcn UI** 컴포넌트 라이브러리
- **모던한 UI/UX** 디자인
- **다크 모드** 지원 (준비 중)

## 📊 성능 최적화

- **Next.js App Router** 활용
- **이미지 최적화** (Next.js Image)
- **코드 스플리팅** 및 지연 로딩
- **SEO 최적화**

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

- **이메일**: help@tourguider.com
- **전화**: 010-5940-0104
- **카카오톡**: @투어가이더

---

**투어가이더**와 함께 특별한 여행을 시작하세요! ✈️🌍 