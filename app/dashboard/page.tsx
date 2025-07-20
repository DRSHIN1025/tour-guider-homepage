'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Clock, CheckCircle, XCircle, AlertCircle, User, LogOut, Bell } from "lucide-react";

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
  requests?: string;
  attachments?: string[];
  status?: string;
  notes?: string;
  adminResponse?: string;
  adminFiles?: string[];
  responseDate?: string;
}

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  useEffect(() => {
    checkAuth();
    if (user) {
      fetchUserQuotes();
    }
  }, [user]);

  const checkAuth = () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Invalid user data:', error);
      router.push('/login');
    }
  };

  const fetchUserQuotes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('Quote')
        .select('*')
        .eq('email', user.email)
        .order('createdAt', { ascending: false });

      if (error) {
        console.error('Error fetching quotes:', error);
      } else {
        setQuotes(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status?: string) => {
    switch (status || 'pending') {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" />검토중</Badge>;
      case 'processing':
        return <Badge variant="default" className="flex items-center gap-1"><AlertCircle className="w-3 h-3" />처리중</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"><CheckCircle className="w-3 h-3" />견적완료</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="w-3 h-3" />취소됨</Badge>;
      default:
        return <Badge variant="secondary">알 수 없음</Badge>;
    }
  };

  const downloadAdminFile = async (fileData: string) => {
    try {
      const fileInfo = JSON.parse(fileData);
      
      const { data, error } = await supabase.storage
        .from('admin-responses')
        .download(fileInfo.filePath);
      
      if (error) {
        console.error('Download error:', error);
        alert('파일 다운로드에 실패했습니다.');
        return;
      }
      
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileInfo.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('File download error:', error);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <User className="w-6 h-6" />
                  마이페이지
                </CardTitle>
                <p className="text-gray-600 mt-2">견적 요청 현황을 확인하세요</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">{user?.name || user?.email}</p>
                  <p className="text-sm text-gray-500">고객</p>
                </div>
                <Button onClick={handleLogout} variant="outline">
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              나의 견적 요청 ({quotes.length}건)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quotes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">견적 요청이 없습니다</h3>
                <p className="text-gray-500 mb-6">첫 번째 여행 견적을 요청해보세요!</p>
                <Button onClick={() => router.push('/quote')}>
                  견적 요청하기
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>상태</TableHead>
                      <TableHead>요청일시</TableHead>
                      <TableHead>목적지</TableHead>
                      <TableHead>여행기간</TableHead>
                      <TableHead>인원</TableHead>
                      <TableHead>예산</TableHead>
                      <TableHead>관리자 응답</TableHead>
                      <TableHead>상세보기</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell>{getStatusBadge(quote.status)}</TableCell>
                        <TableCell className="font-medium">
                          {formatDate(quote.createdAt)}
                        </TableCell>
                        <TableCell>{quote.destination}</TableCell>
                        <TableCell>
                          {new Date(quote.startDate).toLocaleDateString('ko-KR')} ~ {new Date(quote.endDate).toLocaleDateString('ko-KR')}
                        </TableCell>
                        <TableCell>
                          성인 {quote.adults}명
                          {quote.children > 0 && `, 아동 ${quote.children}명`}
                          {quote.infants > 0 && `, 유아 ${quote.infants}명`}
                        </TableCell>
                        <TableCell>{quote.budget || '-'}</TableCell>
                        <TableCell>
                          {quote.adminResponse || quote.adminFiles ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                              <Bell className="w-3 h-3" />
                              응답있음
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">대기중</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedQuote(quote)}>
                                <FileText className="w-4 h-4 mr-1" />
                                보기
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>견적 요청 상세 정보</DialogTitle>
                              </DialogHeader>
                              {selectedQuote && (
                                <div className="space-y-6">
                                  {/* 요청 정보 */}
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3">📋 요청 정보</h3>
                                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                      <div>
                                        <p className="text-sm text-gray-600">목적지</p>
                                        <p className="font-medium">{selectedQuote.destination}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600">여행기간</p>
                                        <p className="font-medium">
                                          {new Date(selectedQuote.startDate).toLocaleDateString('ko-KR')} ~ {new Date(selectedQuote.endDate).toLocaleDateString('ko-KR')}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600">인원</p>
                                        <p className="font-medium">
                                          성인 {selectedQuote.adults}명
                                          {selectedQuote.children > 0 && `, 아동 ${selectedQuote.children}명`}
                                          {selectedQuote.infants > 0 && `, 유아 ${selectedQuote.infants}명`}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600">예산</p>
                                        <p className="font-medium">{selectedQuote.budget || '-'}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <Separator />

                                  {/* 관리자 응답 */}
                                  <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                      📨 관리자 응답
                                      {selectedQuote.status === 'completed' && (
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                          완료
                                        </Badge>
                                      )}
                                    </h3>
                                    
                                    {selectedQuote.adminResponse || selectedQuote.adminFiles ? (
                                      <div className="space-y-4">
                                        {selectedQuote.adminResponse && (
                                          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                            <p className="text-sm text-gray-600 mb-2">담당자 메시지:</p>
                                            <p className="whitespace-pre-wrap">{selectedQuote.adminResponse}</p>
                                            {selectedQuote.responseDate && (
                                              <p className="text-xs text-gray-500 mt-2">
                                                응답일시: {formatDate(selectedQuote.responseDate)}
                                              </p>
                                            )}
                                          </div>
                                        )}
                                        
                                        {selectedQuote.adminFiles && selectedQuote.adminFiles.length > 0 && (
                                          <div>
                                            <p className="text-sm font-medium mb-3">📎 첨부파일:</p>
                                            <div className="space-y-2">
                                              {selectedQuote.adminFiles.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded border">
                                                  <div className="flex items-center space-x-3">
                                                    <FileText className="w-4 h-4 text-green-600" />
                                                    <div>
                                                      <p className="text-sm font-medium">
                                                        {JSON.parse(file).originalName}
                                                      </p>
                                                      <p className="text-xs text-gray-500">
                                                        견적서 및 일정표
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <Button
                                                    size="sm"
                                                    onClick={() => downloadAdminFile(file)}
                                                    className="bg-green-600 hover:bg-green-700"
                                                  >
                                                    <Download className="w-3 h-3 mr-1" />
                                                    다운로드
                                                  </Button>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="p-6 text-center bg-gray-50 rounded-lg">
                                        <Clock className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-gray-500">관리자 응답을 기다리고 있습니다.</p>
                                        <p className="text-sm text-gray-400 mt-1">
                                          보통 1-2일 내에 답변드립니다.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 