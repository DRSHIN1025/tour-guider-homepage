import { 
  collection, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface ReferralUser {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  referredCount: number;
  totalEarnings: number;
  createdAt: Timestamp;
}

export interface ReferralRelationship {
  id: string;
  referrerId: string;
  referrerName: string;
  referrerEmail: string;
  referredUserId: string;
  referredUserName: string;
  referredUserEmail: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  referralCode: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp;
  earnings?: number;
}

export interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  level: 'bronze' | 'silver' | 'gold';
}

/**
 * 사용자별 고유 레퍼럴 코드 생성
 */
export const generateReferralCode = (userId: string): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 6);
  return `${userId.substring(0, 3)}${timestamp}${randomStr}`.toUpperCase();
};

/**
 * 레퍼럴 코드 유효성 검증 및 추천인 정보 조회
 */
export const validateReferralCode = async (code: string): Promise<ReferralUser | null> => {
  try {
    if (!db) {
      console.warn('Firebase not configured, referral validation skipped');
      return null;
    }
    
    // users 컬렉션에서 해당 레퍼럴 코드를 가진 사용자 조회
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('referralCode', '==', code));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return {
        id: userDoc.id,
        ...userDoc.data()
      } as ReferralUser;
    }
    
    return null;
  } catch (error) {
    console.error('레퍼럴 코드 검증 오류:', error);
    return null;
  }
};

/**
 * 레퍼럴 관계 생성
 */
export const createReferralRelationship = async (
  referrerId: string,
  referredUserId: string,
  referralCode: string,
  referrerName: string,
  referrerEmail: string,
  referredUserName: string,
  referredUserEmail: string
): Promise<string | null> => {
  try {
    if (!db) {
      console.warn('Firebase not configured, referral relationship creation skipped');
      return null;
    }
    
    const referralData = {
      referrerId,
      referrerName,
      referrerEmail,
      referredUserId,
      referredUserName,
      referredUserEmail,
      referralCode,
      status: 'pending' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'referrals'), referralData);
    
    // 추천인의 추천 수 증가
    await updateReferralCount(referrerId, 1);
    
    return docRef.id;
  } catch (error) {
    console.error('레퍼럴 관계 생성 오류:', error);
    return null;
  }
};

/**
 * 추천인의 추천 수 업데이트
 */
export const updateReferralCount = async (userId: string, increment: number): Promise<void> => {
  try {
    if (!db) {
      console.warn('Firebase not configured, referral count update skipped');
      return;
    }
    
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentCount = userDoc.data().referredCount || 0;
      await updateDoc(userRef, {
        referredCount: currentCount + increment,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('추천 수 업데이트 오류:', error);
  }
};

/**
 * 사용자의 레퍼럴 통계 조회
 */
export const getUserReferralStats = async (userId: string): Promise<ReferralStats> => {
  try {
    if (!db) {
      console.warn('Firebase not configured, returning default referral stats');
      return {
        totalReferrals: 0,
        successfulReferrals: 0,
        pendingReferrals: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        level: 'bronze'
      };
    }
    
    const referralsRef = collection(db, 'referrals');
    const q = query(referralsRef, where('referrerId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    let totalReferrals = 0;
    let successfulReferrals = 0;
    let pendingReferrals = 0;
    let totalEarnings = 0;
    let pendingEarnings = 0;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as ReferralRelationship;
      totalReferrals++;
      
      if (data.status === 'completed') {
        successfulReferrals++;
        totalEarnings += data.earnings || 0;
      } else if (data.status === 'pending') {
        pendingReferrals++;
        pendingEarnings += data.earnings || 0;
      }
    });
    
    // 레벨 계산
    let level: 'bronze' | 'silver' | 'gold' = 'bronze';
    if (successfulReferrals >= 16) {
      level = 'gold';
    } else if (successfulReferrals >= 6) {
      level = 'silver';
    }
    
    return {
      totalReferrals,
      successfulReferrals,
      pendingReferrals,
      totalEarnings,
      pendingEarnings,
      level
    };
  } catch (error) {
    console.error('레퍼럴 통계 조회 오류:', error);
    return {
      totalReferrals: 0,
      successfulReferrals: 0,
      pendingReferrals: 0,
      totalEarnings: 0,
      pendingEarnings: 0,
      level: 'bronze'
    };
  }
};

/**
 * 사용자의 레퍼럴 관계 목록 조회
 */
export const getUserReferrals = async (userId: string): Promise<ReferralRelationship[]> => {
  try {
    if (!db) {
      console.warn('Firebase not configured, returning empty referrals list');
      return [];
    }
    
    const referralsRef = collection(db, 'referrals');
    const q = query(
      referralsRef, 
      where('referrerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ReferralRelationship[];
  } catch (error) {
    console.error('레퍼럴 관계 조회 오류:', error);
    return [];
  }
};

/**
 * 레퍼럴 상태 업데이트
 */
export const updateReferralStatus = async (
  referralId: string, 
  status: ReferralRelationship['status'],
  earnings?: number
): Promise<boolean> => {
  try {
    if (!db) {
      console.warn('Firebase not configured, referral status update skipped');
      return false;
    }
    
    const referralRef = doc(db, 'referrals', referralId);
    const updateData: any = {
      status,
      updatedAt: serverTimestamp()
    };
    
    if (status === 'completed' && earnings !== undefined) {
      updateData.completedAt = serverTimestamp();
      updateData.earnings = earnings;
    }
    
    await updateDoc(referralRef, updateData);
    return true;
  } catch (error) {
    console.error('레퍼럴 상태 업데이트 오류:', error);
    return false;
  }
};

/**
 * 레퍼럴 보상 계산
 */
export const calculateReferralReward = (level: 'bronze' | 'silver' | 'gold'): number => {
  switch (level) {
    case 'bronze':
      return 5000;
    case 'silver':
      return 10000;
    case 'gold':
      return 15000;
    default:
      return 5000;
  }
};

/**
 * 레벨별 할인율 계산
 */
export const calculateDiscountRate = (level: 'bronze' | 'silver' | 'gold'): number => {
  switch (level) {
    case 'bronze':
      return 0.1; // 10%
    case 'silver':
      return 0.2; // 20%
    case 'gold':
      return 0.3; // 30%
    default:
      return 0.1;
  }
};

/**
 * 레퍼럴 코드 중복 검사
 */
export const isReferralCodeUnique = async (code: string): Promise<boolean> => {
  try {
    if (!db) {
      console.warn('Firebase not configured, referral code uniqueness check skipped');
      return false;
    }
    
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('referralCode', '==', code));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.empty;
  } catch (error) {
    console.error('레퍼럴 코드 중복 검사 오류:', error);
    return false;
  }
};

/**
 * 사용자에게 레퍼럴 코드 할당
 */
export const assignReferralCodeToUser = async (userId: string): Promise<string | null> => {
  try {
    if (!db) {
      console.warn('Firebase not configured, referral code assignment skipped');
      return null;
    }
    
    let referralCode: string = '';
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;
    
    // 고유한 레퍼럴 코드 생성
    while (!isUnique && attempts < maxAttempts) {
      referralCode = generateReferralCode(userId);
      isUnique = await isReferralCodeUnique(referralCode);
      attempts++;
    }
    
    if (!isUnique) {
      throw new Error('고유한 레퍼럴 코드를 생성할 수 없습니다.');
    }
    
    // 사용자 문서에 레퍼럴 코드 저장
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      referralCode,
      referredCount: 0,
      totalEarnings: 0,
      updatedAt: serverTimestamp()
    });
    
    return referralCode;
  } catch (error) {
    console.error('레퍼럴 코드 할당 오류:', error);
    return null;
  }
};
