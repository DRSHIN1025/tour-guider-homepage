import { getAuthInstance, getFirestoreInstance } from './firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// 카카오 로그인 타입 정의
interface KakaoUser {
  id: number;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image?: string;
    thumbnail_image?: string;
  };
  kakao_account: {
    email?: string;
    profile: {
      nickname: string;
      profile_image_url?: string;
      thumbnail_image_url?: string;
    };
  };
}

// 네이버 로그인 타입 정의
interface NaverUser {
  id: string;
  email: string;
  name: string;
  nickname: string;
  profile_image?: string;
}

// 카카오 SDK 초기화
export const initializeKakao = () => {
  if (typeof window === 'undefined') return false;
  
  const kakao = (window as any).Kakao;
  if (!kakao) {
    console.error('Kakao SDK가 로드되지 않았습니다.');
    return false;
  }

  if (!kakao.isInitialized()) {
    const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    if (!clientId) {
      console.error('Kakao Client ID가 설정되지 않았습니다.');
      return false;
    }
    kakao.init(clientId);
  }
  
  return true;
};

// 네이버 SDK 초기화
export const initializeNaver = () => {
  if (typeof window === 'undefined') return false;
  
  const naver = (window as any).naver;
  if (!naver) {
    console.error('Naver SDK가 로드되지 않았습니다.');
    return false;
  }
  
  return true;
};

// 카카오 로그인 (개발용 더미 구현)
export const signInWithKakao = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    // 개발용: 더미 카카오 로그인 시뮬레이션
    setTimeout(() => {
      try {
        console.log('카카오 로그인 시뮬레이션 시작...');
        
        // 더미 사용자 정보
        const dummyUserInfo = {
          id: Math.floor(Math.random() * 1000000),
          properties: {
            nickname: '카카오사용자' + Math.floor(Math.random() * 100),
            profile_image: 'https://via.placeholder.com/100x100.png?text=K'
          },
          kakao_account: {
            email: `kakao_user_${Math.floor(Math.random() * 1000)}@kakao.com`,
            profile: {
              nickname: '카카오사용자' + Math.floor(Math.random() * 100),
              profile_image_url: 'https://via.placeholder.com/100x100.png?text=K'
            }
          }
        };

        console.log('카카오 더미 사용자 정보:', dummyUserInfo);
        
        // 성공 시뮬레이션
        resolve({
          user: dummyUserInfo,
          message: '카카오 로그인이 완료되었습니다! (개발용 더미)'
        });
        
      } catch (error) {
        reject(new Error('카카오 로그인 시뮬레이션 실패'));
      }
    }, 1000); // 1초 딜레이로 실제 API 호출 시뮬레이션
  });
};

// 네이버 로그인 (개발용 더미 구현)
export const signInWithNaver = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    // 개발용: 더미 네이버 로그인 시뮬레이션
    setTimeout(() => {
      try {
        console.log('네이버 로그인 시뮬레이션 시작...');
        
        // 더미 사용자 정보
        const dummyUserInfo = {
          id: 'naver_' + Math.floor(Math.random() * 1000000),
          email: `naver_user_${Math.floor(Math.random() * 1000)}@naver.com`,
          name: '네이버사용자' + Math.floor(Math.random() * 100),
          nickname: '네이버닉네임' + Math.floor(Math.random() * 100),
          profile_image: 'https://via.placeholder.com/100x100.png?text=N'
        };

        console.log('네이버 더미 사용자 정보:', dummyUserInfo);
        
        // 성공 시뮬레이션
        resolve({
          user: dummyUserInfo,
          message: '네이버 로그인이 완료되었습니다! (개발용 더미)'
        });
        
      } catch (error) {
        reject(new Error('네이버 로그인 시뮬레이션 실패'));
      }
    }, 1000); // 1초 딜레이로 실제 API 호출 시뮬레이션
  });
};

// 카카오 사용자 정보 가져오기
const getKakaoUserInfo = async (): Promise<KakaoUser> => {
  const kakao = (window as any).Kakao;
  
  return new Promise((resolve, reject) => {
    kakao.API.request({
      url: '/v2/user/me',
      success: (response: KakaoUser) => {
        resolve(response);
      },
      fail: (error: any) => {
        reject(new Error('카카오 사용자 정보를 가져오는데 실패했습니다.'));
      }
    });
  });
};

// 카카오 Custom Token 생성 (백엔드 API 필요)
const createKakaoCustomToken = async (userInfo: KakaoUser): Promise<string> => {
  // 실제 구현에서는 백엔드 API를 호출해야 합니다
  // 현재는 개발용 더미 토큰을 반환
  console.log('카카오 사용자 정보:', userInfo);
  
  // TODO: 백엔드 API 구현 후 실제 Custom Token 생성
  throw new Error('카카오 Custom Token 생성 기능이 아직 구현되지 않았습니다. 백엔드 API가 필요합니다.');
};

// 소셜 사용자 데이터 저장
const saveSocialUserData = async (uid: string, userData: any) => {
  const db = getFirestoreInstance();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');
  
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', uid), {
      ...userData,
      role: 'user',
      createdAt: new Date()
    });
  }
};

// 네이버 콜백 처리
export const handleNaverCallback = async (code: string, state: string) => {
  try {
    // 네이버 액세스 토큰 가져오기
    const tokenResponse = await fetch('/api/auth/naver/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state }),
    });

    if (!tokenResponse.ok) {
      throw new Error('네이버 토큰 가져오기 실패');
    }

    const { access_token } = await tokenResponse.json();

    // 네이버 사용자 정보 가져오기
    const userResponse = await fetch('/api/auth/naver/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token }),
    });

    if (!userResponse.ok) {
      throw new Error('네이버 사용자 정보 가져오기 실패');
    }

    const userInfo = await userResponse.json();

    // Firebase Custom Token 생성
    const customTokenResponse = await fetch('/api/auth/naver/custom-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInfo }),
    });

    if (!customTokenResponse.ok) {
      throw new Error('Firebase Custom Token 생성 실패');
    }

    const { customToken } = await customTokenResponse.json();

    // Firebase 로그인
    const auth = getAuthInstance();
    if (!auth) throw new Error('Firebase Auth가 초기화되지 않았습니다.');

    const result = await signInWithCustomToken(auth, customToken);

    // Firestore에 사용자 데이터 저장
    await saveSocialUserData(result.user.uid, {
      email: userInfo.email,
      displayName: userInfo.name,
      photoURL: userInfo.profile_image,
      provider: 'naver',
      naverId: userInfo.id
    });

    return result;
  } catch (error) {
    console.error('네이버 콜백 처리 실패:', error);
    throw error;
  }
}; 