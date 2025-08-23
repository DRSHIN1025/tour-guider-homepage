'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Bell, 
  Mail, 
  Smartphone, 
  Calendar,
  Clock,
  Eye,
  Trash2,
  RefreshCw,
  Download
} from 'lucide-react';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationHistoryItem {
  id: string;
  type: 'push' | 'email' | 'in_app';
  title: string;
  message: string;
  category: 'payment' | 'quote' | 'refund' | 'admin' | 'marketing';
  status: 'read' | 'unread';
  createdAt: Date;
  readAt?: Date;
  data?: any;
}

interface NotificationHistoryProps {
  maxItems?: number;
  showFilters?: boolean;
  showActions?: boolean;
}

// localStorage 안전하게 사용하는 헬퍼 함수
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
};

export function NotificationHistory({ 
  maxItems = 50, 
  showFilters = true, 
  showActions = true 
}: NotificationHistoryProps) {
  const { user } = useLocalAuth();
  const { success, error: showError } = useNotifications();
  
  const [notifications, setNotifications] = useState<NotificationHistoryItem[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      loadNotificationHistory();
    }
  }, [user]);

  useEffect(() => {
    filterNotifications();
  }, [notifications, searchTerm, categoryFilter, typeFilter, statusFilter]);

  const loadNotificationHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // 로컬 스토리지에서 알림 히스토리 로드
      const saved = safeLocalStorage.getItem(`notificationHistory_${user.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
      } else {
        // 기본 알림 히스토리 생성 (개발용)
        const defaultHistory = generateDefaultHistory();
        setNotifications(defaultHistory);
        safeLocalStorage.setItem(`notificationHistory_${user.id}`, JSON.stringify(defaultHistory));
      }
    } catch (error) {
      console.error('알림 히스토리 로드 실패:', error);
      showError('로드 실패', '알림 히스토리를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const generateDefaultHistory = (): NotificationHistoryItem[] => {
    const now = new Date();
    return [
      {
        id: '1',
        type: 'push',
        title: '결제 완료',
        message: '투어가이더 상담 서비스 결제가 완료되었습니다.',
        category: 'payment',
        status: 'read',
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2시간 전
        readAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1시간 전
        data: { amount: '50,000원', service: '기본 상담 서비스' }
      },
      {
        id: '2',
        type: 'email',
        title: '견적 요청 접수',
        message: '견적 요청이 성공적으로 접수되었습니다.',
        category: 'quote',
        status: 'unread',
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1일 전
        data: { destination: '동남아 여행', duration: '5박 6일' }
      },
      {
        id: '3',
        type: 'in_app',
        title: '환불 처리 완료',
        message: '환불 처리가 완료되었습니다.',
        category: 'refund',
        status: 'read',
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3일 전
        readAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2일 전
        data: { amount: '25,000원' }
      }
    ];
  };

  const filterNotifications = () => {
    let filtered = notifications;

    // 카테고리 필터
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(n => n.category === categoryFilter);
    }

    // 타입 필터
    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter);
    }

    // 상태 필터
    if (statusFilter !== 'all') {
      filtered = filtered.filter(n => n.status === statusFilter);
    }

    // 검색어 필터
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(term) ||
        n.message.toLowerCase().includes(term)
      );
    }

    // 최신순 정렬 및 제한
    filtered = filtered
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, maxItems);

    setFilteredNotifications(filtered);
  };

  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    
    try {
      const updatedNotifications = notifications.map(n => 
        n.id === notificationId 
          ? { ...n, status: 'read' as const, readAt: new Date() }
          : n
      );
      
      setNotifications(updatedNotifications);
      safeLocalStorage.setItem(`notificationHistory_${user.id}`, JSON.stringify(updatedNotifications));
      
      success('알림', '알림을 읽음으로 표시했습니다.');
    } catch (error) {
      console.error('알림 상태 업데이트 실패:', error);
      showError('업데이트 실패', '알림 상태 업데이트에 실패했습니다.');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!user) return;
    
    if (!confirm('이 알림을 삭제하시겠습니까?')) return;
    
    try {
      const updatedNotifications = notifications.filter(n => n.id !== notificationId);
      setNotifications(updatedNotifications);
      safeLocalStorage.setItem(`notificationHistory_${user.id}`, JSON.stringify(updatedNotifications));
      
      success('알림', '알림이 삭제되었습니다.');
    } catch (error) {
      console.error('알림 삭제 실패:', error);
      showError('삭제 실패', '알림 삭제에 실패했습니다.');
    }
  };

  const clearAllRead = async () => {
    if (!user) return;
    
    if (!confirm('읽은 모든 알림을 삭제하시겠습니까?')) return;
    
    try {
      const updatedNotifications = notifications.filter(n => n.status === 'unread');
      setNotifications(updatedNotifications);
      safeLocalStorage.setItem(`notificationHistory_${user.id}`, JSON.stringify(updatedNotifications));
      
      success('알림', '읽은 모든 알림이 삭제되었습니다.');
    } catch (error) {
      console.error('알림 일괄 삭제 실패:', error);
      showError('삭제 실패', '알림 일괄 삭제에 실패했습니다.');
    }
  };

  const exportHistory = () => {
    if (!user) return;
    
    try {
      const csvContent = generateCSV(notifications);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `notification_history_${user.id}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      success('내보내기', '알림 히스토리가 CSV 파일로 내보내졌습니다.');
    } catch (error) {
      console.error('CSV 내보내기 실패:', error);
      showError('내보내기 실패', 'CSV 내보내기에 실패했습니다.');
    }
  };

  const generateCSV = (data: NotificationHistoryItem[]): string => {
    const headers = ['ID', '타입', '제목', '메시지', '카테고리', '상태', '생성일', '읽은일', '데이터'];
    const rows = data.map(n => [
      n.id,
      n.type,
      n.title,
      n.message,
      n.category,
      n.status,
      n.createdAt.toISOString(),
      n.readAt?.toISOString() || '',
      JSON.stringify(n.data || {})
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'push': return <Smartphone className="w-4 h-4 text-blue-600" />;
      case 'email': return <Mail className="w-4 h-4 text-green-600" />;
      case 'in_app': return <Bell className="w-4 h-4 text-purple-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      payment: 'bg-emerald-100 text-emerald-800',
      quote: 'bg-blue-100 text-blue-800',
      refund: 'bg-orange-100 text-orange-800',
      admin: 'bg-purple-100 text-purple-800',
      marketing: 'bg-pink-100 text-pink-800'
    };
    
    return (
      <Badge className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {category}
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">로그인이 필요합니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 및 액션 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">알림 히스토리</h3>
          <p className="text-sm text-gray-600">
            총 {notifications.length}개의 알림 중 {filteredNotifications.length}개 표시
          </p>
        </div>
        
        {showActions && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearAllRead}>
              읽은 알림 삭제
            </Button>
            <Button variant="outline" size="sm" onClick={exportHistory}>
              <Download className="w-4 h-4 mr-2" />
              CSV 내보내기
            </Button>
            <Button variant="outline" size="sm" onClick={loadNotificationHistory}>
              <RefreshCw className="w-4 h-4 mr-2" />
              새로고침
            </Button>
          </div>
        )}
      </div>

      {/* 필터 */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="알림 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 카테고리</SelectItem>
                  <SelectItem value="payment">결제</SelectItem>
                  <SelectItem value="quote">견적</SelectItem>
                  <SelectItem value="refund">환불</SelectItem>
                  <SelectItem value="admin">관리자</SelectItem>
                  <SelectItem value="marketing">마케팅</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="알림 타입" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 타입</SelectItem>
                  <SelectItem value="push">푸시</SelectItem>
                  <SelectItem value="email">이메일</SelectItem>
                  <SelectItem value="in_app">앱 내부</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="read">읽음</SelectItem>
                  <SelectItem value="unread">읽지 않음</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 알림 목록 */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">알림을 불러오는 중...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">알림이 없습니다</h3>
              <p className="text-gray-600">
                {searchTerm || categoryFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all'
                  ? '필터 조건에 맞는 알림이 없습니다.'
                  : '아직 받은 알림이 없습니다.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-all duration-200 ${
                notification.status === 'unread' 
                  ? 'border-l-4 border-l-blue-500 bg-blue-50' 
                  : 'border-l-4 border-l-gray-200'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon(notification.type)}
                      <h4 className="font-medium text-gray-900 truncate">
                        {notification.title}
                      </h4>
                      {getCategoryBadge(notification.category)}
                      {notification.status === 'unread' && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          새
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(notification.createdAt)}
                      </span>
                      {notification.readAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          읽음: {formatDate(notification.readAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {showActions && (
                    <div className="flex items-center gap-2">
                      {notification.status === 'unread' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
