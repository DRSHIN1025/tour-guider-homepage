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
import { Search, Mail, Download, Eye, Edit, LogOut, Bell } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
  status?: string;
  notes?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    // 인증 확인
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const auth = localStorage.getItem('adminAuth');
        const userInfo = localStorage.getItem('adminUser');
        
        if (!auth) {
          router.push('/admin/login');
          return;
        }
        
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
      const { error } = await supabase
        .from('Quote')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating status:', error);
        return;
      }

      // 로컬 상태 업데이트
      setQuotes(prev => prev.map(quote => 
        quote.id === id ? { ...quote, status } : quote
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const sendEmailNotification = async (quote: Quote) => {
    // 실제 이메일 발송 로직 (여기서는 시뮬레이션)
    alert(`${quote.name}님께 이메일이 발송되었습니다!\n연락처: ${quote.phone}\n목적지: ${quote.destination}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
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
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
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
              <div className="flex items-center gap-3 text-sm">
                {adminUser.profileImage && (
                  <img 
                    src={adminUser.profileImage} 
                    alt="프로필" 
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="text-right">
                  <p className="font-medium">{adminUser.nickname}</p>
                  <p className="text-gray-500 text-xs">
                    {adminUser.loginType === 'traditional' ? '관리자' : '카카오 로그인'}
                  </p>
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
                                <div>
                                  <Label>관리자 메모</Label>
                                  <Textarea 
                                    placeholder="이 고객에 대한 메모를 입력하세요..."
                                    defaultValue={selectedQuote.notes || ''}
                                    className="mt-1"
                                  />
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