import { getFirestoreInstance } from './firebase'
import { collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, increment, addDoc, serverTimestamp, orderBy } from 'firebase/firestore'

// 레퍼럴 시스템 인터페이스
export interface ReferralCode {
  id: string
  userId: string
  userName: string
  userEmail: string
  code: string
  usageCount: number
  maxUsage: number
  rewardAmount: number
  isActive: boolean
  createdAt: Date
  expiresAt?: Date
}

export interface ReferralUsage {
  id: string
  referrerId: string
  referrerCode: string
  referredUserId: string
  referredUserName: string
  referredUserEmail: string
  rewardAmount: number
  status: 'pending' | 'approved' | 'paid' | 'expired'
  usedAt: Date
  paidAt?: Date
}

export interface ReferralReward {
  id: string
  userId: string
  userName: string
  userEmail: string
  amount: number
  source: 'referral' | 'bonus' | 'promotion'
  status: 'pending' | 'approved' | 'paid'
  createdAt: Date
  paidAt?: Date
  description: string
}

// 고유 레퍼럴 코드 생성 (중복 방지)
export const generateReferralCode = async (userId: string, userName: string): Promise<string> => {
  const db = getFirestoreInstance()
  
  // 최대 10번 시도
  for (let attempt = 0; attempt < 10; attempt++) {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    const nameInitial = userName.charAt(0).toUpperCase()
    const code = `${nameInitial}${timestamp}${random}`.toUpperCase()
    
    // 중복 확인
    const existingCode = await getReferralCodeByCode(code)
    if (!existingCode) {
      return code
    }
  }
  
  throw new Error('고유한 레퍼럴 코드를 생성할 수 없습니다. 다시 시도해주세요.')
}

// 레퍼럴 코드 생성 및 저장
export const createReferralCode = async (userId: string, userName: string, userEmail: string): Promise<ReferralCode> => {
  const db = getFirestoreInstance()
  
  // 기존 코드가 있는지 확인
  const existingCode = await getReferralCodeByUserId(userId)
  if (existingCode) {
    return existingCode
  }

  const code = await generateReferralCode(userId, userName)
  const referralCode: Omit<ReferralCode, 'id'> = {
    userId,
    userName,
    userEmail,
    code,
    usageCount: 0,
    maxUsage: 50, // 최대 50명까지 추천 가능
    rewardAmount: 10000, // 추천인당 1만원 보상
    isActive: true,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1년 유효
  }

  const docRef = doc(collection(db, 'referralCodes'))
  await setDoc(docRef, referralCode)

  return {
    id: docRef.id,
    ...referralCode
  }
}

// 사용자 ID로 레퍼럴 코드 조회
export const getReferralCodeByUserId = async (userId: string): Promise<ReferralCode | null> => {
  const db = getFirestoreInstance()
  
  const q = query(
    collection(db, 'referralCodes'),
    where('userId', '==', userId),
    where('isActive', '==', true)
  )
  
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  
  const doc = snapshot.docs[0]
  return {
    id: doc.id,
    ...doc.data()
  } as ReferralCode
}

// 레퍼럴 코드로 조회
export const getReferralCodeByCode = async (code: string): Promise<ReferralCode | null> => {
  const db = getFirestoreInstance()
  
  const q = query(
    collection(db, 'referralCodes'),
    where('code', '==', code.toUpperCase()),
    where('isActive', '==', true)
  )
  
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  
  const doc = snapshot.docs[0]
  return {
    id: doc.id,
    ...doc.data()
  } as ReferralCode
}

// 레퍼럴 코드 사용 처리 (개선된 버전)
export const useReferralCode = async (
  referrerCode: string,
  referredUserId: string,
  referredUserName: string,
  referredUserEmail: string
): Promise<boolean> => {
  const db = getFirestoreInstance()
  
  // 레퍼럴 코드 조회
  const referralCode = await getReferralCodeByCode(referrerCode)
  if (!referralCode) {
    throw new Error('유효하지 않은 레퍼럴 코드입니다.')
  }

  // 자기 자신을 추천하는지 확인
  if (referralCode.userId === referredUserId) {
    throw new Error('자기 자신을 추천할 수 없습니다.')
  }

  // 이미 사용된 코드인지 확인
  const existingUsage = await getReferralUsageByReferredUser(referredUserId)
  if (existingUsage) {
    throw new Error('이미 레퍼럴 코드를 사용한 사용자입니다.')
  }

  // 사용 횟수 제한 확인
  if (referralCode.usageCount >= referralCode.maxUsage) {
    throw new Error('레퍼럴 코드의 사용 한도를 초과했습니다.')
  }

  // 만료일 확인
  if (referralCode.expiresAt && referralCode.expiresAt < new Date()) {
    throw new Error('만료된 레퍼럴 코드입니다.')
  }

  // 활성 상태 확인
  if (!referralCode.isActive) {
    throw new Error('비활성화된 레퍼럴 코드입니다.')
  }

  try {
    // 트랜잭션으로 데이터 일관성 보장
    const batch = db.batch()
    
    // 레퍼럴 사용 기록 생성
    const usageRef = doc(collection(db, 'referralUsages'))
    const usageData: Omit<ReferralUsage, 'id'> = {
      referrerId: referralCode.userId,
      referrerCode: referralCode.code,
      referredUserId,
      referredUserName,
      referredUserEmail,
      rewardAmount: referralCode.rewardAmount,
      status: 'pending',
      usedAt: new Date()
    }
    batch.set(usageRef, usageData)

    // 레퍼럴 코드 사용 횟수 증가
    const codeRef = doc(db, 'referralCodes', referralCode.id)
    batch.update(codeRef, {
      usageCount: increment(1)
    })

    // 추천인 보상 생성
    const rewardRef = doc(collection(db, 'referralRewards'))
    const rewardData: Omit<ReferralReward, 'id'> = {
      userId: referralCode.userId,
      userName: referralCode.userName,
      userEmail: referralCode.userEmail,
      amount: referralCode.rewardAmount,
      source: 'referral',
      status: 'pending',
      createdAt: new Date(),
      description: `${referredUserName}님 추천 보상`
    }
    batch.set(rewardRef, rewardData)

    // 배치 커밋
    await batch.commit()

    return true
  } catch (error) {
    console.error('레퍼럴 코드 사용 오류:', error)
    throw error
  }
}

// 추천받은 사용자의 레퍼럴 사용 기록 조회
export const getReferralUsageByReferredUser = async (referredUserId: string): Promise<ReferralUsage | null> => {
  const db = getFirestoreInstance()
  
  const q = query(
    collection(db, 'referralUsages'),
    where('referredUserId', '==', referredUserId)
  )
  
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  
  const doc = snapshot.docs[0]
  return {
    id: doc.id,
    ...doc.data()
  } as ReferralUsage
}

// 사용자의 추천 통계 조회
export const getUserReferralStats = async (userId: string) => {
  const db = getFirestoreInstance()
  
  // 추천 코드 정보
  const referralCode = await getReferralCodeByUserId(userId)
  
  // 추천 사용 기록
  const usageQuery = query(
    collection(db, 'referralUsages'),
    where('referrerId', '==', userId)
  )
  const usageSnapshot = await getDocs(usageQuery)
  const usages = usageSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ReferralUsage[]
  
  // 보상 기록
  const rewardQuery = query(
    collection(db, 'referralRewards'),
    where('userId', '==', userId)
  )
  const rewardSnapshot = await getDocs(rewardQuery)
  const rewards = rewardSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ReferralReward[]
  
  const totalEarned = rewards.reduce((sum, reward) => sum + reward.amount, 0)
  const totalPaid = rewards
    .filter(reward => reward.status === 'paid')
    .reduce((sum, reward) => sum + reward.amount, 0)
  
  return {
    referralCode,
    totalReferrals: usages.length,
    successfulReferrals: usages.filter(u => u.status === 'approved').length,
    totalEarned,
    totalPaid,
    pendingAmount: totalEarned - totalPaid,
    usages,
    rewards
  }
}

// 관리자용 전체 레퍼럴 통계
export const getAdminReferralStats = async () => {
  const db = getFirestoreInstance()
  
  const [codesSnapshot, usagesSnapshot, rewardsSnapshot] = await Promise.all([
    getDocs(collection(db, 'referralCodes')),
    getDocs(collection(db, 'referralUsages')),
    getDocs(collection(db, 'referralRewards'))
  ])
  
  const codes = codesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ReferralCode[]
  
  const usages = usagesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ReferralUsage[]
  
  const rewards = rewardsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ReferralReward[]
  
  return {
    totalCodes: codes.length,
    activeCodes: codes.filter(c => c.isActive).length,
    totalUsages: usages.length,
    totalReferrals: usages.length,
    successfulReferrals: usages.filter(u => u.status === 'approved').length,
    totalRewards: rewards.reduce((sum, r) => sum + r.amount, 0),
    approvedRewards: rewards
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + r.amount, 0),
    codes,
    usages,
    rewards
  }
}

// 관리자 페이지용 별칭 함수들
export const getAllReferralCodes = async (): Promise<ReferralCode[]> => {
  const db = getFirestoreInstance()
  const snapshot = await getDocs(collection(db, 'referralCodes'))
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ReferralCode[]
}

export const getAllReferralStats = async () => {
  return await getAdminReferralStats()
}

export const approveReward = async (rewardId: string): Promise<void> => {
  return await approveReferralReward(rewardId)
}

// 보상 승인 처리 (관리자용)
export const approveReferralReward = async (rewardId: string): Promise<void> => {
  const db = getFirestoreInstance()
  
  const rewardRef = doc(db, 'referralRewards', rewardId)
  await updateDoc(rewardRef, {
    status: 'approved',
    paidAt: new Date()
  })
  
  // 관련된 레퍼럴 사용 기록도 승인
  const reward = await getDoc(rewardRef)
  if (reward.exists()) {
    const rewardData = reward.data() as ReferralReward
    const usageQuery = query(
      collection(db, 'referralUsages'),
      where('referrerId', '==', rewardData.userId),
      where('status', '==', 'pending')
    )
    const usageSnapshot = await getDocs(usageQuery)
    
    for (const usageDoc of usageSnapshot.docs) {
      await updateDoc(doc(db, 'referralUsages', usageDoc.id), {
        status: 'approved'
      })
    }
  }
}

// 보상 지급 처리 (관리자용) - 개선된 버전
export const payReferralReward = async (
  rewardId: string, 
  paymentMethod: string = 'bank_transfer',
  paymentDetails?: {
    accountNumber?: string
    bankName?: string
    recipientName?: string
    notes?: string
  }
): Promise<void> => {
  const db = getFirestoreInstance()
  
  const rewardRef = doc(db, 'referralRewards', rewardId)
  const rewardDoc = await getDoc(rewardRef)
  
  if (!rewardDoc.exists()) {
    throw new Error('보상을 찾을 수 없습니다.')
  }
  
  const rewardData = rewardDoc.data() as ReferralReward
  
  if (rewardData.status !== 'approved') {
    throw new Error('승인되지 않은 보상입니다.')
  }
  
  await updateDoc(rewardRef, {
    status: 'paid',
    paidAt: new Date(),
    paymentMethod,
    paymentDetails
  })
  
  // 관련된 레퍼럴 사용 기록도 지급 완료로 업데이트
  const usageQuery = query(
    collection(db, 'referralUsages'),
    where('referrerId', '==', rewardData.userId),
    where('status', '==', 'approved')
  )
  const usageSnapshot = await getDocs(usageQuery)
  
  for (const usageDoc of usageSnapshot.docs) {
    await updateDoc(doc(db, 'referralUsages', usageDoc.id), {
      status: 'paid'
    })
  }
}

// 레퍼럴 코드 비활성화
export const deactivateReferralCode = async (codeId: string): Promise<void> => {
  const db = getFirestoreInstance()
  
  const codeRef = doc(db, 'referralCodes', codeId)
  await updateDoc(codeRef, {
    isActive: false
  })
}

// 레퍼럴 코드 재활성화
export const reactivateReferralCode = async (codeId: string): Promise<void> => {
  const db = getFirestoreInstance()
  
  const codeRef = doc(db, 'referralCodes', codeId)
  await updateDoc(codeRef, {
    isActive: true
  })
}

// 레퍼럴 코드 수정
export const updateReferralCode = async (
  codeId: string, 
  updates: Partial<Pick<ReferralCode, 'maxUsage' | 'rewardAmount' | 'expiresAt'>>
): Promise<void> => {
  const db = getFirestoreInstance()
  
  const codeRef = doc(db, 'referralCodes', codeId)
  await updateDoc(codeRef, updates)
}

// 사용자별 레퍼럴 사용 기록 조회
export const getUserReferralUsages = async (userId: string): Promise<ReferralUsage[]> => {
  const db = getFirestoreInstance()
  
  const q = query(
    collection(db, 'referralUsages'),
    where('referrerId', '==', userId),
    orderBy('usedAt', 'desc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ReferralUsage[]
}

// 사용자별 보상 기록 조회
export const getUserReferralRewards = async (userId: string): Promise<ReferralReward[]> => {
  const db = getFirestoreInstance()
  
  const q = query(
    collection(db, 'referralRewards'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ReferralReward[]
}

// 레퍼럴 코드 통계 (관리자용) - 개선된 버전
export const getReferralCodeStats = async (codeId: string) => {
  const db = getFirestoreInstance()
  
  const [codeDoc, usagesSnapshot] = await Promise.all([
    getDoc(doc(db, 'referralCodes', codeId)),
    getDocs(query(
      collection(db, 'referralUsages'),
      where('referrerCode', '==', codeId)
    ))
  ])
  
  if (!codeDoc.exists()) {
    throw new Error('레퍼럴 코드를 찾을 수 없습니다.')
  }
  
  const codeData = codeDoc.data() as ReferralCode
  const usages = usagesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ReferralUsage[]
  
  const totalRewardAmount = usages.reduce((sum, u) => sum + u.rewardAmount, 0)
  const paidRewardAmount = usages
    .filter(u => u.status === 'paid' || u.status === 'approved')
    .reduce((sum, u) => sum + u.rewardAmount, 0)
  
  return {
    code: codeData,
    totalUsages: usages.length,
    successfulUsages: usages.filter(u => u.status === 'approved' || u.status === 'paid').length,
    pendingUsages: usages.filter(u => u.status === 'pending').length,
    totalRewardAmount,
    paidRewardAmount,
    pendingRewardAmount: totalRewardAmount - paidRewardAmount,
    usages: usages.sort((a, b) => new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime())
  }
}

// 레퍼럴 시스템 전체 통계 (관리자용)
export const getReferralSystemStats = async () => {
  const db = getFirestoreInstance()
  
  const [codesSnapshot, usagesSnapshot, rewardsSnapshot] = await Promise.all([
    getDocs(collection(db, 'referralCodes')),
    getDocs(collection(db, 'referralUsages')),
    getDocs(collection(db, 'referralRewards'))
  ])
  
  const codes = codesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ReferralCode[]
  
  const usages = usagesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ReferralUsage[]
  
  const rewards = rewardsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ReferralReward[]
  
  const totalRewards = rewards.reduce((sum, r) => sum + r.amount, 0)
  const paidRewards = rewards
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + r.amount, 0)
  
  const monthlyStats = usages.reduce((acc, usage) => {
    const month = new Date(usage.usedAt).toISOString().slice(0, 7) // YYYY-MM
    if (!acc[month]) {
      acc[month] = { count: 0, amount: 0 }
    }
    acc[month].count++
    acc[month].amount += usage.rewardAmount
    return acc
  }, {} as Record<string, { count: number; amount: number }>)
  
  return {
    totalCodes: codes.length,
    activeCodes: codes.filter(c => c.isActive).length,
    totalReferrals: usages.length,
    successfulReferrals: usages.filter(u => u.status === 'approved' || u.status === 'paid').length,
    totalRewards,
    paidRewards,
    pendingRewards: totalRewards - paidRewards,
    monthlyStats,
    codes,
    usages,
    rewards
  }
}
