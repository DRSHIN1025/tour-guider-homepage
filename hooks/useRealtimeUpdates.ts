'use client';

import { useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit, where } from 'firebase/firestore';
import { useNotifications } from './useNotifications';
import { useLocalAuth } from './useLocalAuth';

interface Payment {
  id: string;
  amount: number;
  status: string;
  customerEmail: string;
  customerName?: string;
  metadata?: {
    destination?: string;
    duration?: string;
    travelers?: string;
  };
  createdAt: any;
}

interface Quote {
  id: string;
  destination: string;
  customerName: string;
  customerEmail: string;
  status: string;
  createdAt: any;
}

interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: string;
  customerEmail: string;
  customerName?: string;
  createdAt: any;
}

export function useRealtimeUpdates() {
  const { isAuthenticated, user } = useLocalAuth();
  const { 
    paymentSuccess, 
    paymentFailed, 
    refundProcessed
  } = useNotifications();
  
  const unsubscribeRefs = useRef<(() => void)[]>([]);
  const lastUpdateRef = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const unsubscribes: (() => void)[] = [];

    // 결제 실시간 감시 (관리자용)
    if (user.isAdmin) {
      const paymentsQuery = query(
        collection(db, 'payments'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      const unsubscribePayments = onSnapshot(paymentsQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const payment = change.doc.data() as Payment;
            const paymentId = change.doc.id;
            
            // 새로운 결제 알림
            if (payment.status === 'succeeded' && !lastUpdateRef.current[`payment_${paymentId}`]) {
              lastUpdateRef.current[`payment_${paymentId}`] = payment.createdAt;
              
              const destination = payment.metadata?.destination || '여행';
              paymentSuccess(payment.customerEmail || 'unknown@example.com', payment.customerName || '고객님', payment.id, destination);
            }
          } else if (change.type === 'modified') {
            const payment = change.doc.data() as Payment;
            const paymentId = change.doc.id;
            const oldPayment = lastUpdateRef.current[`payment_${paymentId}`];
            
            // 결제 상태 변경 알림
            if (oldPayment && oldPayment.status !== payment.status) {
              lastUpdateRef.current[`payment_${paymentId}`] = payment;
              
              if (payment.status === 'failed') {
                paymentFailed('결제 처리 실패');
              }
            }
          }
        });
      });

      unsubscribes.push(unsubscribePayments);
    }

    // 견적 실시간 감시 (관리자용)
    if (user.isAdmin) {
      const quotesQuery = query(
        collection(db, 'quotes'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      const unsubscribeQuotes = onSnapshot(quotesQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const quote = change.doc.data() as Quote;
            const quoteId = change.doc.id;
            
            // 새로운 견적 요청 알림
            if (!lastUpdateRef.current[`quote_${quoteId}`]) {
              lastUpdateRef.current[`quote_${quoteId}`] = quote.createdAt;
              // quoteReceived 함수가 없으므로 주석 처리
              // quoteReceived(quote.destination, quote.customerName);
            }
          } else if (change.type === 'modified') {
            const quote = change.doc.data() as Quote;
            const quoteId = change.doc.id;
            const oldQuote = lastUpdateRef.current[`quote_${quoteId}`];
            
            // 견적 상태 변경 알림
            if (oldQuote && oldQuote.status !== quote.status) {
              lastUpdateRef.current[`quote_${quoteId}`] = quote;
              // quoteUpdated 함수가 없으므로 주석 처리
              // quoteUpdated(quote.status, quote.destination);
            }
          }
        });
      });

      unsubscribes.push(unsubscribeQuotes);
    }

    // 환불 실시간 감시 (관리자용)
    if (user.isAdmin) {
      const refundsQuery = query(
        collection(db, 'refunds'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      const unsubscribeRefunds = onSnapshot(refundsQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const refund = change.doc.data() as Refund;
            const refundId = change.doc.id;
            
            // 새로운 환불 요청 알림
            if (!lastUpdateRef.current[`refund_${refundId}`]) {
              lastUpdateRef.current[`refund_${refundId}`] = refund.createdAt;
              refundProcessed(refund.customerEmail || 'unknown@example.com', refund.customerName || '고객님', refund.id, refund.amount?.toString() || '0');
            }
          }
        });
      });

      unsubscribes.push(unsubscribeRefunds);
    }

    // 사용자별 결제 실시간 감시
    if (!user.isAdmin) {
      const userPaymentsQuery = query(
        collection(db, 'payments'),
        where('customerEmail', '==', user.email),
        orderBy('createdAt', 'desc'),
        limit(5)
      );

      const unsubscribeUserPayments = onSnapshot(userPaymentsQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const payment = change.doc.data() as Payment;
            const paymentId = change.doc.id;
            
            // 새로운 결제 알림
            if (payment.status === 'succeeded' && !lastUpdateRef.current[`user_payment_${paymentId}`]) {
              lastUpdateRef.current[`user_payment_${paymentId}`] = payment.createdAt;
              
              const destination = payment.metadata?.destination || '여행';
              paymentSuccess(payment.customerEmail || 'unknown@example.com', payment.customerName || '고객님', payment.id, destination);
            }
          } else if (change.type === 'modified') {
            const payment = change.doc.data() as Payment;
            const paymentId = change.doc.id;
            const oldPayment = lastUpdateRef.current[`user_payment_${paymentId}`];
            
            // 결제 상태 변경 알림
            if (oldPayment && oldPayment.status !== payment.status) {
              lastUpdateRef.current[`user_payment_${paymentId}`] = payment;
              
              if (payment.status === 'failed') {
                paymentFailed('결제 처리 실패');
              }
            }
          }
        });
      });

      unsubscribes.push(unsubscribeUserPayments);
    }

    // 사용자별 견적 실시간 감시
    if (!user.isAdmin) {
      const userQuotesQuery = query(
        collection(db, 'quotes'),
        where('customerEmail', '==', user.email),
        orderBy('createdAt', 'desc'),
        limit(5)
      );

      const unsubscribeUserQuotes = onSnapshot(userQuotesQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'modified') {
            const quote = change.doc.data() as Quote;
            const quoteId = change.doc.id;
            const oldQuote = lastUpdateRef.current[`user_quote_${quoteId}`];
            
            // 견적 상태 변경 알림
            if (oldQuote && oldQuote.status !== quote.status) {
              lastUpdateRef.current[`user_quote_${quoteId}`] = quote;
              // quoteUpdated 함수가 없으므로 주석 처리
              // quoteUpdated(quote.status, quote.destination);
            }
          }
        });
      });

      unsubscribes.push(unsubscribeUserQuotes);
    }

    unsubscribeRefs.current = unsubscribes;

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [isAuthenticated, user, paymentSuccess, paymentFailed, refundProcessed]);

  // 컴포넌트 언마운트 시 구독 해제
  useEffect(() => {
    return () => {
      unsubscribeRefs.current.forEach(unsubscribe => unsubscribe());
    };
  }, []);
}
