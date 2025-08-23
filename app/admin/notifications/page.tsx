'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Bell, 
  Users, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Info,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { commonClasses } from '@/lib/design-system';
import { useLocalAuth } from '@/hooks/useLocalAuth';
import { useNotifications } from '@/hooks/useNotifications';

interface PushNotificationForm {
  title: string;
  message: string;
  tag: string;
  targetType: 'all' | 'specific' | 'filtered';
  targetEmails: string[];
  targetUserIds: string[];
  requireInteraction: boolean;
  scheduleAt?: string;
  actions: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

interface NotificationLog {
  id: string;
  title: string;
  message: string;
  tag: string;
  targetCount: number;
  successfulSends: number;
  failedSends: number;
  status: string;
  sentAt: Date;
  scheduleAt?: Date;
}

export default function AdminNotificationsPage() {
  const router = useRouter();
  const { user, logout } = useLocalAuth();
  const { success, error: showError } = useNotifications();
  
  const [form, setForm] = useState<PushNotificationForm>({
    title: '',
    message: '',
    tag: '',
    targetType: 'all',
    targetEmails: [],
    targetUserIds: [],
    requireInteraction: false,
    actions: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customAction, setCustomAction] = useState({ action: '', title: '' });

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const adminAuth = localStorage.getItem('adminAuth');
        if (!adminAuth) {
          router.push('/admin/login');
          return;
        }
      }
    };

    checkAuth();
    fetchNotificationLogs();
  }, [router]);

  const fetchNotificationLogs = async () => {
    try {
      const response = await fetch('/api/push/send');
      if (response.ok) {
        const data = await response.json();
        setNotificationLogs(data.logs || []);
      }
    } catch (error) {
      console.error('알림 로그 조회 실패:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.message.trim()) {
      showError('입력 오류', '제목과 메시지를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      const payload = {
        title: form.title.trim(),
        message: form.message.trim(),
        tag: form.tag.trim() || 'admin-notification',
        requireInteraction: form.requireInteraction,
        actions: form.actions,
        targetUsers: form.targetType === 'all' 
          ? { allUsers: true }
          : form.targetType === 'specific'
          ? { userEmails: form.targetEmails.filter(e => e.trim()) }
          : { userIds: form.targetUserIds.filter(id => id.trim()) },
        scheduleAt: form.scheduleAt || undefined
      };

      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        success('푸시 알림', `알림이 ${result.successfulSends}명에게 전송되었습니다.`);
        
        // 폼 초기화
        setForm({
          title: '',
          message: '',
          tag: '',
          targetType: 'all',
          targetEmails: [],
          targetUserIds: [],
          requireInteraction: false,
          actions: []
        });
        
        // 로그 새로고침
        fetchNotificationLogs();
      } else {
        const errorData = await response.json();
        showError('전송 실패', errorData.error || '알림 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('푸시 알림 전송 오류:', error);
      showError('전송 오류', '알림 전송 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const addCustomAction = () => {
    if (customAction.action.trim() && customAction.title.trim()) {
      setForm(prev => ({
        ...prev,
        actions: [...prev.actions, { ...customAction }]
      }));
      setCustomAction({ action: '', title: '' });
    }
  };

  const removeAction = (index: number) => {
    setForm(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const addTargetEmail = () => {
    const email = prompt('이메일 주소를 입력하세요:');
    if (email && email.trim()) {
      setForm(prev => ({
        ...prev,
        targetEmails: [...prev.targetEmails, email.trim()]
      }));
    }
  };

  const removeTargetEmail = (index: number) => {
    setForm(prev => ({
      ...prev,
      targetEmails: prev.targetEmails.filter((_, i) => i !== index)
    }));
  };

  const addTargetUserId = () => {
    const userId = prompt('사용자 ID를 입력하세요:');
    if (userId && userId.trim()) {
      setForm(prev => ({
        ...prev,
        targetUserIds: [...prev.targetUserIds, userId.trim()]
      }));
    }
  };

  const removeTargetUserId = (index: number) => {
    setForm(prev => ({
      ...prev,
      targetUserIds: prev.targetUserIds.filter((_, i) => i !== index)
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">완료</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">대기중</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">실패</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className={commonClasses.container + " py-8"}>
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">접근 권한 없음</h2>
              <p className="text-gray-600 mb-4">관리자 권한이 필요합니다.</p>
              <Button asChild>
                <Link href="/admin/login">관리자 로그인</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className={commonClasses.container}>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  뒤로
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">푸시 알림 관리</h1>
                <p className="text-gray-600">사용자들에게 중요한 알림을 전송하세요</p>
              </div>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className={commonClasses.container}>
          <div className="flex space-x-8">
            <Link 
              href="/admin"
              className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300"
            >
              견적 관리
            </Link>
            <Link 
              href="/admin/payments"
              className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300"
            >
              결제 관리
            </Link>
            <Link 
              href="/admin/notifications"
              className="px-6 py-4 text-sm font-medium text-gray-900 border-b-2 border-blue-600"
            >
              푸시 알림 관리
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={commonClasses.container + " py-8"}>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 알림 전송 폼 */}
          <Card className="bg-white shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                푸시 알림 전송
              </CardTitle>
              <CardDescription>
                사용자들에게 중요한 알림을 전송할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 기본 정보 */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">알림 제목 *</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="알림 제목을 입력하세요"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">알림 내용 *</Label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="알림 내용을 입력하세요"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tag">알림 태그</Label>
                    <Input
                      id="tag"
                      value={form.tag}
                      onChange={(e) => setForm(prev => ({ ...prev, tag: e.target.value }))}
                      placeholder="알림을 그룹화할 태그 (선택사항)"
                    />
                  </div>
                </div>

                {/* 대상 설정 */}
                <div className="space-y-4">
                  <Label>대상 설정</Label>
                  <Select
                    value={form.targetType}
                    onValueChange={(value: 'all' | 'specific' | 'filtered') => 
                      setForm(prev => ({ ...prev, targetType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">모든 사용자</SelectItem>
                      <SelectItem value="specific">특정 이메일</SelectItem>
                      <SelectItem value="filtered">사용자 ID로 필터</SelectItem>
                    </SelectContent>
                  </Select>

                  {form.targetType === 'specific' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label>대상 이메일</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addTargetEmail}>
                          <Users className="w-4 h-4 mr-1" />
                          추가
                        </Button>
                      </div>
                      {form.targetEmails.map((email, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={email} disabled />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTargetEmail(index)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {form.targetType === 'filtered' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label>대상 사용자 ID</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addTargetUserId}>
                          <Users className="w-4 h-4 mr-1" />
                          추가
                        </Button>
                      </div>
                      {form.targetUserIds.map((userId, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={userId} disabled />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTargetUserId(index)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 고급 설정 */}
                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2"
                  >
                    <Info className="w-4 h-4" />
                    고급 설정
                  </Button>
                  
                  {showAdvanced && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="requireInteraction">사용자 상호작용 필요</Label>
                        <Switch
                          id="requireInteraction"
                          checked={form.requireInteraction}
                          onCheckedChange={(checked) => 
                            setForm(prev => ({ ...prev, requireInteraction: checked }))
                          }
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="scheduleAt">예약 전송 (선택사항)</Label>
                        <Input
                          id="scheduleAt"
                          type="datetime-local"
                          value={form.scheduleAt || ''}
                          onChange={(e) => setForm(prev => ({ ...prev, scheduleAt: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 커스텀 액션 */}
                <div className="space-y-4">
                  <Label>커스텀 액션 (선택사항)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="액션 키"
                      value={customAction.action}
                      onChange={(e) => setCustomAction(prev => ({ ...prev, action: e.target.value }))}
                    />
                    <Input
                      placeholder="액션 제목"
                      value={customAction.title}
                      onChange={(e) => setCustomAction(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Button type="button" variant="outline" onClick={addCustomAction}>
                      추가
                    </Button>
                  </div>
                  
                  {form.actions.length > 0 && (
                    <div className="space-y-2">
                      {form.actions.map((action, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium">{action.action}</span>
                          <span className="text-sm text-gray-600">-</span>
                          <span className="text-sm">{action.title}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAction(index)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 전송 버튼 */}
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      전송 중...
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      푸시 알림 전송
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* 알림 로그 */}
          <Card className="bg-white shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                전송 로그
              </CardTitle>
              <CardDescription>
                전송된 알림의 상태와 결과를 확인할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationLogs.length > 0 ? (
                  notificationLogs.map((log) => (
                    <div key={log.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{log.title}</h4>
                        {getStatusBadge(log.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{log.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>대상: {log.targetCount}명</span>
                        <span>성공: {log.successfulSends}명</span>
                        <span>실패: {log.failedSends}명</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        {new Date(log.sentAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>전송된 알림이 없습니다.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
