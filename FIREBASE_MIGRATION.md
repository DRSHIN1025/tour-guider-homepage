# 🔥 Firebase 마이그레이션 가이드

## 📋 개요
Supabase에서 Firebase로 마이그레이션하여 보안 문제를 해결하고 더 안정적인 서비스를 제공합니다.

## 🚀 Firebase 프로젝트 설정

### 1. Firebase 콘솔에서 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `tour-guider-homepage`
4. Google Analytics 활성화 (선택사항)

### 2. 웹 앱 등록
1. 프로젝트 대시보드에서 "웹" 아이콘 클릭
2. 앱 닉네임: `tour-guider-web`
3. Firebase Hosting 설정 (선택사항)
4. 등록 완료 후 설정 정보 복사

### 3. 환경변수 설정
```bash
# .env.local 파일 생성
cp firebase-config.example .env.local
```

실제 Firebase 설정값으로 `.env.local` 파일을 업데이트하세요:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=실제_API_키
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=프로젝트ID.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=프로젝트ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=프로젝트ID.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=실제_발신자ID
NEXT_PUBLIC_FIREBASE_APP_ID=실제_앱ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=실제_측정ID
```

## 🔐 인증 설정

### 1. Authentication 활성화
1. Firebase 콘솔 → Authentication
2. "시작하기" 클릭
3. 로그인 방법 추가:
   - 이메일/비밀번호
   - Google 로그인

### 2. Google 로그인 설정
1. Google 로그인 활성화
2. 프로젝트 지원 이메일 설정
3. 승인된 도메인 추가 (배포 시)

## 📊 Firestore 데이터베이스 설정

### 1. Firestore 생성
1. Firebase 콘솔 → Firestore Database
2. "데이터베이스 만들기" 클릭
3. 보안 규칙: "테스트 모드에서 시작" 선택
4. 위치: `asia-northeast3 (서울)`

### 2. 보안 규칙 설정
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 인증 확인
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 견적 요청 (인증된 사용자만)
    match /quotes/{quoteId} {
      allow read, write: if request.auth != null;
    }
    
    // 후기 (모든 사용자 읽기, 인증된 사용자만 쓰기)
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🗄️ 데이터 마이그레이션

### 1. Supabase 데이터 내보내기
```sql
-- 사용자 데이터
SELECT * FROM auth.users;

-- 견적 요청 데이터
SELECT * FROM quotes;

-- 후기 데이터
SELECT * FROM reviews;
```

### 2. Firestore로 데이터 가져오기
Firebase Admin SDK를 사용하여 데이터를 마이그레이션할 수 있습니다.

## 🚀 배포 설정

### 1. Vercel 배포
1. Vercel 프로젝트에 환경변수 추가
2. Firebase 설정값들을 Vercel 환경변수로 설정

### 2. Firebase Hosting (선택사항)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🔧 주요 변경사항

### ✅ 완료된 작업
- [x] Firebase SDK 설치
- [x] Firebase 설정 파일 생성
- [x] 인증 훅 생성
- [x] UserHeader 컴포넌트 업데이트
- [x] Supabase 의존성 제거

### 📝 추가 작업 필요
- [ ] Firebase 프로젝트 생성
- [ ] 환경변수 설정
- [ ] 데이터 마이그레이션
- [ ] 보안 규칙 설정
- [ ] 테스트 및 검증

## 🛡️ 보안 개선사항

### Firebase의 보안 장점
1. **자동 보안 규칙**: Firestore 보안 규칙으로 데이터 접근 제어
2. **인증 통합**: Firebase Auth와 완전 통합
3. **실시간 보안**: 실시간 데이터베이스 보안 모니터링
4. **Google 인프라**: Google의 보안 인프라 활용

### Supabase 보안 문제 해결
- ❌ RLS 정책 누락 문제 해결
- ❌ API 키 노출 위험 제거
- ❌ 데이터베이스 무단 접근 방지

## 📞 지원

문제가 발생하면:
1. Firebase 문서 확인
2. Firebase 콘솔 로그 확인
3. 개발자 도구 콘솔 확인

## 🎯 다음 단계

1. Firebase 프로젝트 생성
2. 환경변수 설정
3. 데이터 마이그레이션
4. 테스트 및 검증
5. 프로덕션 배포 