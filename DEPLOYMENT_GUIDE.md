# 🚀 투어가이더 사이트 배포 가이드

## 📋 **배포 전 체크리스트**

### ✅ **완료된 기능들**
- [x] **로그인/회원가입** (Firebase Authentication)
- [x] **결제 시스템** (Stripe)
- [x] **카카오 채팅** (KakaoTalk Channel)
- [x] **견적 요청 시스템**
- [x] **관리자 대시보드**
- [x] **사용자 대시보드**
- [x] **반응형 디자인**
- [x] **SEO 최적화**

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

## 📞 **지원**

배포 중 문제가 발생하면:
- **이메일**: help@tourguider.com
- **전화**: 1588-0000
- **카카오톡**: [카카오채널](https://pf.kakao.com/_your_channel_id)

---

**🎉 배포 완료 후 완벽한 투어가이더 사이트가 준비됩니다!** 