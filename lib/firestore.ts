import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { getFirestoreInstance } from './firebase';

export interface QuoteRequest {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  destination: string;
  duration: string;
  people: string;
  budget: string;
  startDate?: string;
  requirements?: string;
  contactMethod: 'email' | 'kakao';
  contactPhone?: string;
  attachments: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  adminNotes?: string;
}

// 견적 요청 저장
export const saveQuoteRequest = async (quoteData: Omit<QuoteRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
  const db = getFirestoreInstance();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');
  
  const quoteRequest: Omit<QuoteRequest, 'id'> = {
    ...quoteData,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const docRef = await addDoc(collection(db, 'quotes'), quoteRequest);
  console.log('견적 요청이 성공적으로 저장되었습니다:', docRef.id);
  return { id: docRef.id, ...quoteRequest };
};

// 모든 견적 요청 가져오기 (관리자용)
export const getQuoteRequests = async (): Promise<QuoteRequest[]> => {
  const db = getFirestoreInstance();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');
  
  const q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as QuoteRequest[];
};

// 특정 견적 요청 가져오기
export const getQuoteRequest = async (id: string): Promise<QuoteRequest | null> => {
  const db = getFirestoreInstance();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');
  
  const docRef = doc(db, 'quotes', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as QuoteRequest;
  }
  return null;
};

// 견적 상태 업데이트
export const updateQuoteStatus = async (id: string, status: QuoteRequest['status'], adminNotes?: string) => {
  const db = getFirestoreInstance();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');
  
  const docRef = doc(db, 'quotes', id);
  await updateDoc(docRef, {
    status,
    adminNotes,
    updatedAt: new Date()
  });
  console.log('견적 상태가 업데이트되었습니다:', id, status);
};

// 견적 요청 삭제
export const deleteQuoteRequest = async (id: string) => {
  const db = getFirestoreInstance();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');
  
  const docRef = doc(db, 'quotes', id);
  await deleteDoc(docRef);
  console.log('견적 요청이 삭제되었습니다:', id);
};

// 사용자별 견적 요청 가져오기
export const getUserQuoteRequests = async (userId: string): Promise<QuoteRequest[]> => {
  const db = getFirestoreInstance();
  if (!db) throw new Error('Firestore가 초기화되지 않았습니다.');
  
  const q = query(
    collection(db, 'quotes'), 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as QuoteRequest[];
};

// 실시간 견적 요청 모니터링 (관리자용)
export const subscribeToQuoteRequests = (callback: (quotes: QuoteRequest[]) => void) => {
  const db = getFirestoreInstance();
  if (!db) {
    console.error('Firestore가 초기화되지 않았습니다.');
    return () => {};
  }
  
  const q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));
  
  // 실시간 리스너 설정
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const quotes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as QuoteRequest[];
    
    callback(quotes);
  });
  
  return unsubscribe;
}; 