'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
}

export default function AdminPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const downloadExcel = () => {
    // CSV 형태로 다운로드
    const headers = ['접수일시', '이름', '연락처', '이메일', '목적지', '출발일', '귀국일', '성인', '아동', '유아', '항공사', '호텔등급', '여행스타일', '예산', '요청사항'];
    
    const csvContent = [
      headers.join(','),
      ...quotes.map(quote => [
        formatDate(quote.createdAt),
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
        quote.requests || ''
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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">견적 요청 관리</CardTitle>
          <div className="flex gap-2">
            <Button onClick={fetchQuotes} variant="outline">
              새로고침
            </Button>
            <Button onClick={downloadExcel}>
              엑셀 다운로드
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Badge variant="secondary">총 {quotes.length}건의 요청</Badge>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>접수일시</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>목적지</TableHead>
                  <TableHead>여행기간</TableHead>
                  <TableHead>인원</TableHead>
                  <TableHead>여행스타일</TableHead>
                  <TableHead>예산</TableHead>
                  <TableHead>상세보기</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => (
                  <TableRow key={quote.id}>
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
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {quote.travelStyle.map((style, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {style}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{quote.budget || '-'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        상세보기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {quotes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              아직 견적 요청이 없습니다.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 