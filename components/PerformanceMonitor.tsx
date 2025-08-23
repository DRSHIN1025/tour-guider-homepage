'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  HardDrive,
  Network,
  Zap
} from 'lucide-react';
import { startPerformanceMonitoring, exportPerformanceData } from '@/lib/performance-monitoring';

interface PerformanceMetrics {
  LCP?: number;
  FID?: number;
  CLS?: number;
  pageLoad?: {
    dnsLookup: number;
    tcpConnection: number;
    serverResponse: number;
    domLoad: number;
    totalLoad: number;
    firstPaint: number;
    firstContentfulPaint: number;
  };
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
    usagePercentage: number;
  };
  resources?: Array<{
    name: string;
    type: string;
    size: number;
    duration: number;
    startTime: number;
  }>;
  timestamp?: number;
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
  }
};

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    // 성능 모니터링 시작
    if (!isMonitoring) {
      startPerformanceMonitoring();
      setIsMonitoring(true);
    }

    // 주기적으로 성능 데이터 업데이트
    const interval = setInterval(() => {
      try {
        const data = safeLocalStorage.getItem('performanceMetrics');
        if (data) {
          const parsedMetrics = JSON.parse(data);
          setMetrics(parsedMetrics);
          
          // 경고 체크
          checkWarnings(parsedMetrics);
        }
      } catch (error) {
        console.error('성능 데이터 파싱 실패:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const checkWarnings = (metrics: PerformanceMetrics) => {
    const newWarnings: string[] = [];

    // LCP 경고
    if (metrics.LCP && metrics.LCP > 2500) {
      newWarnings.push(`LCP가 2.5초를 초과했습니다: ${metrics.LCP.toFixed(0)}ms`);
    }

    // FID 경고
    if (metrics.FID && metrics.FID > 100) {
      newWarnings.push(`FID가 100ms를 초과했습니다: ${metrics.FID.toFixed(0)}ms`);
    }

    // CLS 경고
    if (metrics.CLS && metrics.CLS > 0.1) {
      newWarnings.push(`CLS가 0.1을 초과했습니다: ${metrics.CLS.toFixed(3)}`);
    }

    // 페이지 로드 경고
    if (metrics.pageLoad) {
      if (metrics.pageLoad.totalLoad > 3000) {
        newWarnings.push(`페이지 로드 시간이 3초를 초과했습니다: ${metrics.pageLoad.totalLoad.toFixed(0)}ms`);
      }
      if (metrics.pageLoad.domLoad > 2000) {
        newWarnings.push(`DOM 로드 시간이 2초를 초과했습니다: ${metrics.pageLoad.domLoad.toFixed(0)}ms`);
      }
    }

    // 메모리 경고
    if (metrics.memory && metrics.memory.usagePercentage > 80) {
      newWarnings.push(`메모리 사용량이 80%를 초과했습니다: ${metrics.memory.usagePercentage.toFixed(1)}%`);
    }

    setWarnings(newWarnings);
  };

  const getPerformanceScore = (): number => {
    let score = 100;
    
    // LCP 점수
    if (metrics.LCP) {
      if (metrics.LCP > 4000) score -= 30;
      else if (metrics.LCP > 2500) score -= 20;
      else if (metrics.LCP > 1500) score -= 10;
    }

    // FID 점수
    if (metrics.FID) {
      if (metrics.FID > 300) score -= 30;
      else if (metrics.FID > 100) score -= 20;
      else if (metrics.FID > 50) score -= 10;
    }

    // CLS 점수
    if (metrics.CLS) {
      if (metrics.CLS > 0.25) score -= 30;
      else if (metrics.CLS > 0.1) score -= 20;
      else if (metrics.CLS > 0.05) score -= 10;
    }

    return Math.max(0, score);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 50) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 90) return '우수';
    if (score >= 70) return '양호';
    if (score >= 50) return '보통';
    return '개선 필요';
  };

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleExport = () => {
    exportPerformanceData();
  };

  return (
    <div className="space-y-6">
      {/* 성능 점수 */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            성능 점수
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-2xl font-bold ${getScoreColor(getPerformanceScore())}`}>
              {getPerformanceScore()}점
            </div>
            <p className="mt-2 text-gray-600">{getScoreLabel(getPerformanceScore())}</p>
          </div>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Core Web Vitals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {metrics.LCP ? formatTime(metrics.LCP) : '-'}
              </div>
              <div className="text-sm text-gray-600">LCP</div>
              <Badge 
                variant={metrics.LCP && metrics.LCP > 2500 ? 'destructive' : 'default'}
                className="mt-2"
              >
                {metrics.LCP && metrics.LCP > 2500 ? '느림' : '빠름'}
              </Badge>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {metrics.FID ? formatTime(metrics.FID) : '-'}
              </div>
              <div className="text-sm text-gray-600">FID</div>
              <Badge 
                variant={metrics.FID && metrics.FID > 100 ? 'destructive' : 'default'}
                className="mt-2"
              >
                {metrics.FID && metrics.FID > 100 ? '느림' : '빠름'}
              </Badge>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {metrics.CLS ? metrics.CLS.toFixed(3) : '-'}
              </div>
              <div className="text-sm text-gray-600">CLS</div>
              <Badge 
                variant={metrics.CLS && metrics.CLS > 0.1 ? 'destructive' : 'default'}
                className="mt-2"
              >
                {metrics.CLS && metrics.CLS > 0.1 ? '불안정' : '안정'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 페이지 로드 성능 */}
      {metrics.pageLoad && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              페이지 로드 성능
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {formatTime(metrics.pageLoad.dnsLookup)}
                </div>
                <div className="text-xs text-gray-600">DNS 조회</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {formatTime(metrics.pageLoad.tcpConnection)}
                </div>
                <div className="text-xs text-gray-600">TCP 연결</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">
                  {formatTime(metrics.pageLoad.domLoad)}
                </div>
                <div className="text-xs text-gray-600">DOM 로드</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">
                  {formatTime(metrics.pageLoad.totalLoad)}
                </div>
                <div className="text-xs text-gray-600">전체 로드</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 메모리 사용량 */}
      {metrics.memory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-red-600" />
              메모리 사용량
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">사용 중</span>
                <span className="font-medium">{formatBytes(metrics.memory.usedJSHeapSize)}</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    metrics.memory.usagePercentage > 80 ? 'bg-red-500' : 
                    metrics.memory.usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(metrics.memory.usagePercentage, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>{metrics.memory.usagePercentage.toFixed(1)}%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 리소스 성능 */}
      {metrics.resources && metrics.resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5 text-teal-600" />
              리소스 로딩 성능
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {metrics.resources.slice(-5).map((resource, index) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{resource.name}</div>
                    <div className="text-xs text-gray-500">{resource.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatTime(resource.duration)}</div>
                    <div className="text-xs text-gray-500">{formatBytes(resource.size)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 경고 */}
      {warnings.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              성능 경고
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {warnings.map((warning, index) => (
                <div key={index} className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">{warning}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 액션 버튼 */}
      <div className="flex justify-center">
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          성능 데이터 내보내기
        </Button>
      </div>
    </div>
  );
}
