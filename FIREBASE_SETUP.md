# Firebase 설정 가이드

## 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCJfso0a1JKqny2Qgn9sXJgxaL0Gz57wno
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tour-guider-homepage.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tour-guider-homepage
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tour-guider-homepage.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=879427263594
NEXT_PUBLIC_FIREBASE_APP_ID=1:879427263594:web:d43e9b06e0536e8a687e13

# Social Login Configuration
NEXT_PUBLIC_KAKAO_CLIENT_ID=your_kakao_client_id
NEXT_PUBLIC_NAVER_CLIENT_ID=your_naver_client_id

# Payment Configuration
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq
NEXT_PUBLIC_TOSS_SECRET_KEY=test_sk_D4yKeq5bgrpKRd0JYbLVGX0lzW6Y
```

## 2. Firebase Console 설정

### 2.1 Google 로그인 활성화
1. [Firebase Console](https://console.firebase.google.com/project/tour-guider-homepage) 접속
2. **Authentication** → **Sign-in method** → **Google** 활성화
3. **Authorized domains**에 `tourguider.biz` 추가

### 2.2 Firestore 데이터베이스 생성
1. **Firestore Database** → **Create database**
2. **Start in test mode** 선택
3. **Location** 선택 (asia-northeast3 권장)

### 2.3 Storage 설정
1. **Storage** → **Get started**
2. **Start in test mode** 선택
3. **Location** 선택 (asia-northeast3 권장)

## 3. 소셜 로그인 설정

### 3.1 카카오 로그인
1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 애플리케이션 생성
3. **JavaScript 키**를 `NEXT_PUBLIC_KAKAO_CLIENT_ID`에 설정

### 3.2 네이버 로그인
1. [Naver Developers](https://developers.naver.com/) 접속
2. 애플리케이션 생성
3. **Client ID**를 `NEXT_PUBLIC_NAVER_CLIENT_ID`에 설정

## 4. 테스트 방법

### 4.1 개발 서버 실행
```bash
npm run dev
```

### 4.2 Google 로그인 테스트
1. `http://localhost:3000/login` 접속
2. Google 로그인 버튼 클릭
3. Google 계정 선택 팝업 확인

### 4.3 견적 요청 테스트
1. 로그인 후 메인 페이지에서 견적 요청
2. 파일 업로드 테스트
3. 관리자 페이지에서 요청 확인

## 5. 문제 해결

### 5.1 "Firebase not initialized" 오류
- `.env.local` 파일이 올바른 위치에 있는지 확인
- 환경 변수 값이 정확한지 확인
- 개발 서버 재시작

### 5.2 Google 로그인 팝업 차단
- 브라우저 팝업 차단 해제
- Firebase Console에서 도메인 설정 확인

### 5.3 파일 업로드 실패
- Firebase Storage 규칙 확인
- 파일 크기 제한 확인 (15MB)

## 6. 배포 설정

### 6.1 Firebase Hosting 배포
```bash
npm run build
firebase deploy
```

### 6.2 도메인 연결
1. Firebase Console → **Hosting** → **Add custom domain**
2. `tourguider.biz` 추가
3. DNS 설정 업데이트

## 7. 보안 설정

### 7.1 Firestore 보안 규칙
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /quotes/{quoteId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 7.2 Storage 보안 규칙
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /quotes/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
``` 