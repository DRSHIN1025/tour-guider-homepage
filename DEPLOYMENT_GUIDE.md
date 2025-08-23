# 🚀 투어가이더 사이트 배포 가이드

## 📋 **배포 전 체크리스트**

### ✅ **완료된 기능들**
- [x] **로그인/회원가입** (Firebase Authentication)
- [x] **결제 시스템** (Stripe)
- [x] **카카오 채팅** (KakaoTalk Channel)
- [x] **견적 요청 시스템**
- [x] **관리자 대시보드**
- [x] **사용자 대시보드**
- [x] **파일 업로드/다운로드** (Firebase Storage + 프록시 API)
- [x] **반응형 디자인**
- [x] **SEO 최적화**

### 🔧 **최근 수정사항 (관리자 파일 다운로드 개선)**
- [x] **환경별 다운로드 전략** - 로컬: API 프록시, 배포: 직접 다운로드
- [x] **Firebase Storage CORS** - 브라우저 보안 정책 우회 방법 적용
- [x] **파일 타입 지원** - DOC, PPT, HWP, 이미지, PDF 등 모든 형식 지원
- [x] **API 프록시 라우트** - `/api/download`로 서버사이드 다운로드 처리
- [x] **로컬 환경 감지** - localhost, 127.0.0.1, 192.168.x.x 자동 감지

---

## 🎯 **배포 방법 1: Vercel (추천)**

### **1단계: Vercel 계정 생성**
1. [Vercel](https://vercel.com) 접속
2. GitHub 계정으로 로그인
3. 새 프로젝트 생성

### **2단계: GitHub 저장소 연결**
```bash
# 현재 브랜치를 main으로 병합
git checkout main
git merge complete-update
git push origin main
```

### **3단계: Vercel에서 프로젝트 설정**
1. **Import Git Repository** 클릭
2. **tour-guider-homepage** 선택
3. **Framework Preset**: Next.js 선택
4. **Root Directory**: `./` (기본값)
5. **Build Command**: `npm run build` (기본값)
6. **Output Directory**: `.next` (기본값)

### **4단계: 환경 변수 설정**
Vercel 대시보드 → Settings → Environment Variables에서 다음 추가:

```env
# Firebase 설정
NEXT_PUBLIC_FIREBASE_API_KEY=실제_키
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=실제_도메인
NEXT_PUBLIC_FIREBASE_PROJECT_ID=실제_프로젝트_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=실제_버킷
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=실제_센더_ID
NEXT_PUBLIC_FIREBASE_APP_ID=실제_앱_ID

# Stripe 설정
STRIPE_SECRET_KEY=sk_live_실제_키
STRIPE_PUBLISHABLE_KEY=pk_live_실제_키
STRIPE_WEBHOOK_SECRET=whsec_실제_웹훅_시크릿

# Kakao 설정
NEXT_PUBLIC_KAKAO_APP_KEY=실제_카카오_키
KAKAO_ADMIN_KEY=실제_카카오_관리자_키
NEXT_PUBLIC_KAKAO_CHANNEL_ID=실제_채널_ID

# 기타 설정
NEXT_PUBLIC_BASE_URL=https://www.tourguider.biz
```

### **5단계: 도메인 연결**
1. **Domains** 섹션에서 `www.tourguider.biz` 추가
2. **DNS 설정** 업데이트 (네임서버 변경)

---

## 🎯 **배포 방법 2: Netlify**

### **1단계: Netlify 계정 생성**
1. [Netlify](https://netlify.com) 접속
2. GitHub 계정으로 로그인

### **2단계: 프로젝트 배포**
1. **New site from Git** 클릭
2. **GitHub** 선택
3. **tour-guider-homepage** 저장소 선택
4. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`

### **3단계: 환경 변수 설정**
Site settings → Environment variables에서 위와 동일한 환경 변수 추가

---

## 🔧 **실제 서비스 설정**

### **1. Firebase 설정**
1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
2. **Authentication**, **Firestore**, **Storage** 활성화
3. 웹 앱 추가 및 설정 정보 복사

### **2. Stripe 설정**
1. [Stripe Dashboard](https://dashboard.stripe.com/)에서 계정 생성
2. **Live API keys** 발급
3. **Webhook** 설정 (선택사항)

### **3. Kakao 설정**
1. [Kakao Developers](https://developers.kakao.com/)에서 앱 생성
2. **KakaoTalk Channel** 생성
3. **JavaScript 키** 및 **채널 ID** 발급

---

## 🧪 **배포 후 테스트**

### **기능 테스트**
- [ ] **홈페이지** 로딩 확인
- [ ] **로그인/회원가입** 테스트
- [ ] **견적 요청** 테스트
- [ ] **결제 시스템** 테스트
- [ ] **카카오 채팅** 테스트
- [ ] **관리자 대시보드** 접근
- [ ] **사용자 대시보드** 접근

### **성능 테스트**
- [ ] **페이지 로딩 속도** 확인
- [ ] **모바일 반응형** 테스트
- [ ] **SEO 메타데이터** 확인
- [ ] **Google Analytics** 연동 확인

---

## 🚨 **문제 해결**

### **파일 다운로드 문제 해결** 📁
> **문제**: 관리자 페이지에서 첨부파일 다운로드가 작동하지 않는 경우

#### **개발환경 vs 배포환경 차이점**
| 환경 | 다운로드 방법 | CORS 제한 | 해결책 |
|------|---------------|-----------|---------|
| **로컬 (localhost)** | API 프록시 | ❌ 제한됨 | `/api/download` 서버사이드 처리 |
| **배포 (도메인)** | 직접 다운로드 | ✅ 허용됨 | Firebase Storage URL 직접 접근 |

#### **자동 해결 시스템**
현재 코드에서 자동으로 환경을 감지하여 적절한 다운로드 방법을 선택합니다:
```javascript
// 로컬 환경 자동 감지
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname.includes('192.168.');

if (isLocalhost) {
  // API 프록시를 통한 다운로드
  fetch('/api/download', { method: 'POST', ... })
} else {
  // 직접 다운로드
  fetch(firebaseUrl)
}
```

#### **Firebase Storage CORS 설정**
배포 환경에서 직접 다운로드가 안 되는 경우:
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# CORS 규칙 생성 (cors.json)
[
  {
    "origin": ["*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]

# CORS 적용
gsutil cors set cors.json gs://your-bucket-name
```

### **빌드 오류**
```bash
# 의존성 재설치
npm install

# 캐시 클리어
npm run build -- --no-cache
```

### **환경 변수 오류**
- 모든 환경 변수가 올바르게 설정되었는지 확인
- 대소문자 구분 확인
- 특수문자 이스케이프 확인

### **도메인 연결 오류**
- DNS 설정 확인
- 네임서버 변경 후 24-48시간 대기
- SSL 인증서 자동 발급 확인

---

## 📞 연락처 정보

- **이메일**: help@tourguider.com
- **전화**: 010-5940-0104
- **카카오톡**: @투어가이더

---

**🎉 배포 완료 후 완벽한 투어가이더 사이트가 준비됩니다!** 