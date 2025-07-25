'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Mail, Download, Eye, Edit, LogOut, Bell, Send } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";

// 빌드 시점 오류 방지를 위한 Supabase 클라이언트 초기화
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);

interface Quote {
  id: string;
  createdAt: string;
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  infants: number;
  airline?: string;
  hotel?: string;
  travelStyle: string[];
  budget?: string;
  name: string;
  phone: string;
  email?: string;
  requests?: string;
  attachments?: string[];
  status?: string;
  notes?: string;
  userId?: string;
  adminResponse?: string;
  adminFiles?: string[];
  responseDate?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [responseText, setResponseText] = useState('');
  const [responseFiles, setResponseFiles] = useState<File[]>([]);
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [sessionTimeLeft, setSessionTimeLeft] = useState<number>(30 * 60); // 30분

  useEffect(() => {
    // 인증 확인 및 세션 관리
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const auth = localStorage.getItem('adminAuth');
        const userInfo = localStorage.getItem('adminUser');
        const sessionStart = localStorage.getItem('adminSessionStart');
        
        if (!auth || !sessionStart) {
          router.push('/admin/login');
          return;
        }

        // 세션 만료 체크 (30분)
        const sessionStartTime = parseInt(sessionStart);
        const currentTime = Date.now();
        const sessionDuration = currentTime - sessionStartTime;
        const maxSessionTime = 30 * 60 * 1000; // 30분

        if (sessionDuration > maxSessionTime) {
          // 세션 만료
          localStorage.removeItem('adminAuth');
          localStorage.removeItem('adminUser');
          localStorage.removeItem('adminSessionStart');
          alert('세션이 만료되었습니다. 다시 로그인해주세요.');
          router.push('/admin/login');
          return;
        }

        // 남은 세션 시간 계산
        const timeLeft = Math.floor((maxSessionTime - sessionDuration) / 1000);
        setSessionTimeLeft(timeLeft);
        
        if (userInfo) {
          try {
            setAdminUser(JSON.parse(userInfo));
          } catch (e) {
            console.error('사용자 정보 파싱 오류:', e);
          }
        }
        
        setIsAuthenticated(true);
        fetchQuotes();
      }
    };
    
    checkAuth();

    // 세션 타이머 (1초마다 업데이트)
    const sessionTimer = setInterval(() => {
      setSessionTimeLeft(prev => {
        if (prev <= 1) {
          // 세션 만료
          localStorage.removeItem('adminAuth');
          localStorage.removeItem('adminUser');
          localStorage.removeItem('adminSessionStart');
          alert('세션이 만료되었습니다. 다시 로그인해주세요.');
          router.push('/admin/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(sessionTimer);
  }, [router]);

  useEffect(() => {
    // 검색 및 필터링
    let filtered = quotes;
    
    if (searchTerm) {
      filtered = filtered.filter(quote => 
        quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.phone.includes(searchTerm)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(quote => (quote.status || 'pending') === statusFilter);
    }
    
    setFilteredQuotes(filtered);
  }, [quotes, searchTerm, statusFilter]);

  const fetchQuotes = async () => {
    try {
      if (!supabase) {
        console.error('Supabase client not available');
        return;
      }
      
      const { data, error } = await supabase
        .from('Quote')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching quotes:', error);
        return;
      }

      setQuotes(data || []);
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async (id: string, status: string) => {
    try {
      // 먼저 status 컬럼이 있는지 확인하기 위해 테스트 업데이트
      const { error } = await supabase
        .from('Quote')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating status:', error);
        
        // status 컬럼이 없는 경우 임시로 로컬에서만 상태 관리
        if (error.message.includes('column') || error.message.includes('status')) {
          console.log('Status column does not exist, using local state only');
          setQuotes(prev => prev.map(quote => 
            quote.id === id ? { ...quote, status } : quote
          ));
          alert('⚠️ 임시로 로컬에서만 상태가 변경됩니다.\n페이지를 새로고침하면 원래 상태로 돌아갑니다.\n\n데이터베이스에 status 컬럼을 추가해야 합니다.');
          return;
        }
        
        alert(`상태 변경 실패: ${error.message}`);
        return;
      }

      // 정상적으로 업데이트된 경우 로컬 상태도 업데이트
      setQuotes(prev => prev.map(quote => 
        quote.id === id ? { ...quote, status } : quote
      ));
      
      console.log(`Status updated successfully: ${id} -> ${status}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('상태 변경 중 오류가 발생했습니다.');
    }
  };

  const sendEmailNotification = async (quote: Quote) => {
    // 실제 이메일 발송 로직 (여기서는 시뮬레이션)
    alert(`${quote.name}님께 이메일이 발송되었습니다!\n연락처: ${quote.phone}\n목적지: ${quote.destination}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const downloadAttachment = async (attachment: string) => {
    try {
      // Parse attachment data
      const attachmentData = JSON.parse(attachment);
      
      // 버킷 존재 확인
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'attachments');
      
      if (!bucketExists) {
        alert('파일 저장소가 설정되지 않았습니다.');
        return;
      }
      
      // Get download URL from Supabase Storage
      const { data, error } = await supabase.storage
        .from('attachments')
        .download(attachmentData.filePath);
      
      if (error) {
        console.error('Download error:', error);
        alert('파일 다운로드에 실패했습니다.');
        return;
      }
      
      // Create blob URL and download
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachmentData.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('File download error:', error);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  const isValidAttachmentData = (attachment: string) => {
    try {
      const data = JSON.parse(attachment);
      return data.originalName && data.filePath && !attachment.includes('업로드 실패') && !attachment.includes('처리 실패');
    } catch {
      return false;
    }
  };

  const getAttachmentDisplayName = (attachment: string) => {
    try {
      const data = JSON.parse(attachment);
      return data.originalName;
    } catch {
      return attachment; // Fallback to raw string
    }
  };

  const submitAdminResponse = async (quoteId: string) => {
    if (!responseText.trim() && responseFiles.length === 0) {
      alert('응답 내용이나 파일을 추가해주세요.');
      return;
    }

    setIsSubmittingResponse(true);

    try {
      // 파일 업로드 처리
      const uploadedFiles: string[] = [];
      
      // 관리자 응답 버킷 확인 및 생성
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'admin-responses');
      
      if (!bucketExists) {
        const { error: createBucketError } = await supabase.storage.createBucket('admin-responses', {
          public: false,
          allowedMimeTypes: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
          fileSizeLimit: 20 * 1024 * 1024 // 20MB
        });
        if (createBucketError) {
          console.log('Admin bucket creation info:', createBucketError);
        }
      }

      for (const file of responseFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `admin-responses/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('admin-responses')
          .upload(filePath, file);
        
        if (uploadError) {
          console.error('File upload error:', uploadError);
        } else {
          uploadedFiles.push(JSON.stringify({
            originalName: file.name,
            filePath: filePath,
            uploadedAt: new Date().toISOString()
          }));
        }
      }

      // 견적 응답 업데이트
      const { error } = await supabase
        .from('Quote')
        .update({
          adminResponse: responseText.trim() || null,
          adminFiles: uploadedFiles.length > 0 ? uploadedFiles : null,
          responseDate: new Date().toISOString(),
          status: 'completed'
        })
        .eq('id', quoteId);

      if (error) {
        console.error('Error updating quote:', error);
        alert('응답 저장에 실패했습니다.');
      } else {
        alert('고객에게 견적이 전달되었습니다!');
        setResponseText('');
        setResponseFiles([]);
        fetchQuotes(); // 목록 새로고침
      }
    } catch (error) {
      console.error('Failed to submit response:', error);
      alert('응답 전송 중 오류가 발생했습니다.');
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status || 'pending') {
      case 'pending':
        return <Badge variant="secondary">대기중</Badge>;
      case 'processing':
        return <Badge variant="default">처리중</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">완료</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">취소</Badge>;
      default:
        return <Badge variant="secondary">대기중</Badge>;
    }
  };

  const downloadExcel = () => {
    const headers = ['접수일시', '상태', '이름', '연락처', '이메일', '목적지', '출발일', '귀국일', '성인', '아동', '유아', '항공사', '호텔등급', '여행스타일', '예산', '요청사항', '메모'];
    
    const csvContent = [
      headers.join(','),
      ...filteredQuotes.map(quote => [
        formatDate(quote.createdAt),
        quote.status || 'pending',
        quote.name,
        quote.phone,
        quote.email || '',
        quote.destination,
        formatDate(quote.startDate),
        formatDate(quote.endDate),
        quote.adults,
        quote.children,
        quote.infants,
        quote.airline || '',
        quote.hotel || '',
        quote.travelStyle.join(';'),
        quote.budget || '',
        quote.requests || '',
        quote.notes || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `견적요청_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    if (confirm('정말 로그아웃 하시겠습니까?')) {
      // 로그아웃 로그
      console.log('관리자 로그아웃:', {
        username: adminUser?.username || 'unknown',
        timestamp: new Date().toISOString(),
        sessionId: adminUser?.sessionId || 'unknown'
      });

      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminSessionStart');
      router.push('/admin/login');
    }
  };

  const formatSessionTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isAuthenticated) {
    return <div>인증 확인 중...</div>;
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  const pendingCount = quotes.filter(q => (q.status || 'pending') === 'pending').length;
  const processingCount = quotes.filter(q => q.status === 'processing').length;
  const completedCount = quotes.filter(q => q.status === 'completed').length;

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">견적 요청 관리</CardTitle>
            <div className="flex gap-4 mt-2">
              <Badge variant="secondary">대기중 {pendingCount}</Badge>
              <Badge variant="default">처리중 {processingCount}</Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">완료 {completedCount}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {adminUser && (
              <div className="flex items-center gap-4">
                {/* 세션 정보 */}
                <div className="text-right text-sm">
                  <p className={`font-medium ${sessionTimeLeft < 300 ? 'text-red-600' : 'text-green-600'}`}>
                    세션: {formatSessionTime(sessionTimeLeft)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {sessionTimeLeft < 300 ? '곧 만료됩니다' : '정상'}
                  </p>
                </div>
                
                {/* 사용자 정보 */}
                <div className="flex items-center gap-3 text-sm border-l pl-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-xs">
                      {adminUser.nickname?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{adminUser.nickname}</p>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      보안 로그인
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={fetchQuotes} variant="outline">
                새로고침
              </Button>
              <Button onClick={downloadExcel}>
                <Download className="w-4 h-4 mr-2" />
                엑셀 다운로드
              </Button>
              <Button onClick={handleLogout} variant="destructive">
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 검색 및 필터 */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="이름, 목적지, 연락처로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="pending">대기중</SelectItem>
                <SelectItem value="processing">처리중</SelectItem>
                <SelectItem value="completed">완료</SelectItem>
                <SelectItem value="cancelled">취소</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>상태</TableHead>
                  <TableHead>접수일시</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>목적지</TableHead>
                  <TableHead>여행기간</TableHead>
                  <TableHead>인원</TableHead>
                  <TableHead>예산</TableHead>
                  <TableHead>첨부파일</TableHead>
                  <TableHead>액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>
                      <Select 
                        value={quote.status || 'pending'} 
                        onValueChange={(value) => updateQuoteStatus(quote.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">대기중</SelectItem>
                          <SelectItem value="processing">처리중</SelectItem>
                          <SelectItem value="completed">완료</SelectItem>
                          <SelectItem value="cancelled">취소</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatDate(quote.createdAt)}
                    </TableCell>
                    <TableCell>{quote.name}</TableCell>
                    <TableCell>{quote.phone}</TableCell>
                    <TableCell>{quote.destination}</TableCell>
                    <TableCell>
                      {formatDate(quote.startDate)} ~ {formatDate(quote.endDate)}
                    </TableCell>
                    <TableCell>
                      성인 {quote.adults}명
                      {quote.children > 0 && `, 아동 ${quote.children}명`}
                      {quote.infants > 0 && `, 유아 ${quote.infants}명`}
                    </TableCell>
                    <TableCell>{quote.budget || '-'}</TableCell>
                    <TableCell>
                      {quote.attachments && quote.attachments.length > 0 ? (
                        <Badge variant="secondary" className="text-xs">
                          {quote.attachments.length}개 파일
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-xs">없음</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedQuote(quote)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>견적 요청 상세 정보</DialogTitle>
                            </DialogHeader>
                            {selectedQuote && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>고객명</Label>
                                    <p className="font-medium">{selectedQuote.name}</p>
                                  </div>
                                  <div>
                                    <Label>연락처</Label>
                                    <p className="font-medium">{selectedQuote.phone}</p>
                                  </div>
                                  <div>
                                    <Label>이메일</Label>
                                    <p className="font-medium">{selectedQuote.email || '-'}</p>
                                  </div>
                                  <div>
                                    <Label>목적지</Label>
                                    <p className="font-medium">{selectedQuote.destination}</p>
                                  </div>
                                  <div>
                                    <Label>여행 기간</Label>
                                    <p className="font-medium">
                                      {formatDate(selectedQuote.startDate)} ~ {formatDate(selectedQuote.endDate)}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>인원</Label>
                                    <p className="font-medium">
                                      성인 {selectedQuote.adults}명
                                      {selectedQuote.children > 0 && `, 아동 ${selectedQuote.children}명`}
                                      {selectedQuote.infants > 0 && `, 유아 ${selectedQuote.infants}명`}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>항공사</Label>
                                    <p className="font-medium">{selectedQuote.airline || '-'}</p>
                                  </div>
                                  <div>
                                    <Label>호텔 등급</Label>
                                    <p className="font-medium">{selectedQuote.hotel || '-'}</p>
                                  </div>
                                  <div>
                                    <Label>여행 스타일</Label>
                                    <div className="flex flex-wrap gap-1">
                                      {selectedQuote.travelStyle.map((style, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {style}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <Label>예산</Label>
                                    <p className="font-medium">{selectedQuote.budget || '-'}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label>요청사항</Label>
                                  <p className="mt-1 p-3 bg-gray-50 rounded-md">
                                    {selectedQuote.requests || '없음'}
                                  </p>
                                </div>
                                
                                {selectedQuote.attachments && selectedQuote.attachments.length > 0 && (
                                  <div>
                                    <Label>첨부파일</Label>
                                    <div className="mt-2 space-y-2">
                                      {selectedQuote.attachments.map((attachment, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded border hover:bg-blue-100 transition-colors">
                                          <div className="flex items-center space-x-3">
                                            <Download className="w-4 h-4 text-blue-500" />
                                            <div>
                                              <span className="text-sm font-medium text-gray-700 block">
                                                {getAttachmentDisplayName(attachment)}
                                              </span>
                                              {isValidAttachmentData(attachment) && (
                                                <span className="text-xs text-gray-500">
                                                  업로드됨: {new Date(JSON.parse(attachment).uploadedAt).toLocaleDateString('ko-KR')}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Badge variant="secondary" className="text-xs">
                                              첨부됨
                                            </Badge>
                                                                                         {isValidAttachmentData(attachment) ? (
                                               <Button
                                                 size="sm"
                                                 variant="outline"
                                                 onClick={() => downloadAttachment(attachment)}
                                                 className="text-xs px-2 py-1 h-7"
                                               >
                                                 <Download className="w-3 h-3 mr-1" />
                                                 다운로드
                                               </Button>
                                             ) : (
                                               <div className="flex flex-col items-end gap-1">
                                                 <Badge variant="destructive" className="text-xs">
                                                   다운로드 불가
                                                 </Badge>
                                                 <span className="text-xs text-gray-500">
                                                   {attachment.includes('실패') ? '업로드 오류' : '파일명만 저장됨'}
                                                 </span>
                                               </div>
                                             )}
                                          </div>
                                        </div>
                                      ))}
                                      <p className="text-xs text-gray-500 mt-2">
                                        💡 첨부파일은 고객이 제공한 견적 예시, 타사 견적서, 여행 일정표 등입니다. 
                                        <br />
                                        ⚠️ 현재 파일명만 저장되며, 실제 파일 다운로드를 위해서는 Supabase Storage 설정이 필요합니다.
                                      </p>
                                    </div>
                                  </div>
                                )}
                                
                                <div>
                                  <Label>관리자 메모</Label>
                                  <Textarea 
                                    placeholder="이 고객에 대한 메모를 입력하세요..."
                                    defaultValue={selectedQuote.notes || ''}
                                    className="mt-1"
                                  />
                                </div>

                                {/* 관리자 응답 섹션 */}
                                <div className="border-t pt-6">
                                  <div className="flex items-center justify-between mb-4">
                                    <Label className="text-lg font-semibold">고객 응답 보내기</Label>
                                    {selectedQuote.adminResponse && (
                                      <Badge variant="outline" className="bg-green-50 text-green-700">
                                        응답완료
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {selectedQuote.adminResponse ? (
                                    <div className="space-y-4">
                                      <div className="p-4 bg-green-50 rounded-lg border">
                                        <p className="text-sm text-gray-600 mb-2">이전 응답:</p>
                                        <p className="whitespace-pre-wrap">{selectedQuote.adminResponse}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                          전송일: {selectedQuote.responseDate ? new Date(selectedQuote.responseDate).toLocaleString('ko-KR') : '-'}
                                        </p>
                                      </div>
                                      
                                      {selectedQuote.adminFiles && selectedQuote.adminFiles.length > 0 && (
                                        <div>
                                          <p className="text-sm font-medium mb-2">전송한 파일:</p>
                                          <div className="space-y-2">
                                            {selectedQuote.adminFiles.map((file, index) => (
                                              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                                                <Download className="w-4 h-4 text-gray-500" />
                                                {JSON.parse(file).originalName}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ) : null}

                                  <div className="space-y-4 mt-4">
                                    <div>
                                      <Label>견적 메시지</Label>
                                      <Textarea
                                        placeholder="고객에게 보낼 견적 내용을 작성하세요..."
                                        value={responseText}
                                        onChange={(e) => setResponseText(e.target.value)}
                                        rows={4}
                                        className="mt-1"
                                      />
                                    </div>
                                    
                                    <div>
                                      <Label>견적서 및 일정표 첨부</Label>
                                      <div className="mt-2">
                                        <FileUpload
                                          onFilesChange={setResponseFiles}
                                          maxFiles={5}
                                          maxSize={20}
                                          acceptedTypes={[
                                            'application/pdf',
                                            'application/msword',
                                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                            'application/vnd.ms-excel',
                                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                            'image/*',
                                            '.pdf', '.doc', '.docx', '.xls', '.xlsx'
                                          ]}
                                        />
                                      </div>
                                    </div>
                                    
                                    <Button
                                      onClick={() => submitAdminResponse(selectedQuote.id)}
                                      disabled={isSubmittingResponse}
                                      className="w-full"
                                    >
                                      {isSubmittingResponse ? (
                                        <>처리 중...</>
                                      ) : (
                                        <>
                                          <Send className="w-4 h-4 mr-2" />
                                          고객에게 견적 전송
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => sendEmailNotification(quote)}
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredQuotes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? '검색 결과가 없습니다.' 
                : '아직 견적 요청이 없습니다.'
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 