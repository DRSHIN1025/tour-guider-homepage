// 성능 모니터링 유틸리티

// Core Web Vitals 측정
export const measureCoreWebVitals = () => {
  if (typeof window === 'undefined') return;

  // LCP (Largest Contentful Paint) 측정
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (lastEntry) {
          console.log('LCP:', lastEntry.startTime);
          
          // 성능 데이터 저장
          savePerformanceMetric('LCP', lastEntry.startTime);
          
          // 성능 경고 체크
          if (lastEntry.startTime > 2500) {
            console.warn('LCP가 2.5초를 초과했습니다:', lastEntry.startTime);
          }
        }
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      console.error('LCP 측정 실패:', error);
    }
  }

  // FID (First Input Delay) 측정
  if ('PerformanceObserver' in window) {
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          // FID는 PerformanceEventTiming 타입이므로 타입 캐스팅 필요
          const eventEntry = entry as any;
          if (eventEntry.processingStart && eventEntry.startTime) {
            const fidValue = eventEntry.processingStart - eventEntry.startTime;
            console.log('FID:', fidValue);
            
            // 성능 데이터 저장
            savePerformanceMetric('FID', fidValue);
            
            // 성능 경고 체크
            if (fidValue > 100) {
              console.warn('FID가 100ms를 초과했습니다:', fidValue);
            }
          }
        });
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      console.error('FID 측정 실패:', error);
    }
  }

  // CLS (Cumulative Layout Shift) 측정
  if ('PerformanceObserver' in window) {
    try {
      let clsValue = 0;
      let clsEntries: any[] = [];
      
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push(entry);
          }
        });
        
        console.log('CLS:', clsValue);
        
        // 성능 데이터 저장
        savePerformanceMetric('CLS', clsValue);
        
        // 성능 경고 체크
        if (clsValue > 0.1) {
          console.warn('CLS가 0.1을 초과했습니다:', clsValue);
        }
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.error('CLS 측정 실패:', error);
    }
  }
};

// 페이지 로드 성능 측정
export const measurePageLoadPerformance = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const metrics = {
          // DNS 조회 시간
          dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
          // TCP 연결 시간
          tcpConnection: navigation.connectEnd - navigation.connectStart,
          // 서버 응답 시간
          serverResponse: navigation.responseEnd - navigation.requestStart,
          // DOM 로드 시간
          domLoad: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          // 전체 로드 시간
          totalLoad: navigation.loadEventEnd - navigation.fetchStart,
          // First Paint
          firstPaint: 0,
          // First Contentful Paint
          firstContentfulPaint: 0
        };

        // Paint 시간 측정
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach((entry) => {
          if (entry.name === 'first-paint') {
            metrics.firstPaint = entry.startTime;
          }
          if (entry.name === 'first-contentful-paint') {
            metrics.firstContentfulPaint = entry.startTime;
          }
        });

        console.log('페이지 로드 성능:', metrics);
        
        // 성능 데이터 저장
        savePerformanceMetrics(metrics);
        
        // 성능 경고 체크
        checkPerformanceWarnings(metrics);
      }
    }, 0);
  });
};

// 리소스 로딩 성능 측정
export const measureResourcePerformance = () => {
  if (typeof window === 'undefined') return;

  const resourceObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      const resourceEntry = entry as PerformanceResourceTiming;
      
      // 이미지, 스크립트, CSS 파일만 필터링
      if (resourceEntry.initiatorType === 'img' || 
          resourceEntry.initiatorType === 'script' || 
          resourceEntry.initiatorType === 'css') {
        
        const resourceMetrics = {
          name: resourceEntry.name,
          type: resourceEntry.initiatorType,
          size: resourceEntry.transferSize,
          duration: resourceEntry.duration,
          startTime: resourceEntry.startTime
        };
        
        console.log('리소스 로딩 성능:', resourceMetrics);
        
        // 성능 데이터 저장
        saveResourceMetrics(resourceMetrics);
        
        // 성능 경고 체크
        if (resourceEntry.duration > 1000) {
          console.warn('리소스 로딩이 1초를 초과했습니다:', resourceEntry.name);
        }
      }
    });
  });
  
  resourceObserver.observe({ entryTypes: ['resource'] });
};

// 메모리 사용량 측정
export const measureMemoryUsage = () => {
  if (typeof window === 'undefined') return;
  if (!('memory' in performance)) return;

  const memory = (performance as any).memory;
  
  const memoryMetrics = {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
  };
  
  console.log('메모리 사용량:', memoryMetrics);
  
  // 성능 데이터 저장
  saveMemoryMetrics(memoryMetrics);
  
  // 메모리 경고 체크
  if (memoryMetrics.usagePercentage > 80) {
    console.warn('메모리 사용량이 80%를 초과했습니다:', memoryMetrics.usagePercentage.toFixed(2) + '%');
  }
};

// 성능 데이터 저장
const savePerformanceMetric = (metric: string, value: number) => {
  try {
    const metrics = JSON.parse(localStorage.getItem('performanceMetrics') || '{}');
    metrics[metric] = value;
    metrics.timestamp = Date.now();
    localStorage.setItem('performanceMetrics', JSON.stringify(metrics));
  } catch (error) {
    console.error('성능 데이터 저장 실패:', error);
  }
};

const savePerformanceMetrics = (metrics: any) => {
  try {
    const allMetrics = JSON.parse(localStorage.getItem('performanceMetrics') || '{}');
    allMetrics.pageLoad = metrics;
    allMetrics.timestamp = Date.now();
    localStorage.setItem('performanceMetrics', JSON.stringify(allMetrics));
  } catch (error) {
    console.error('페이지 로드 성능 데이터 저장 실패:', error);
  }
};

const saveResourceMetrics = (metrics: any) => {
  try {
    const allMetrics = JSON.parse(localStorage.getItem('performanceMetrics') || '{}');
    if (!allMetrics.resources) allMetrics.resources = [];
    allMetrics.resources.push(metrics);
    
    // 최근 100개만 유지
    if (allMetrics.resources.length > 100) {
      allMetrics.resources = allMetrics.resources.slice(-100);
    }
    
    allMetrics.timestamp = Date.now();
    localStorage.setItem('performanceMetrics', JSON.stringify(allMetrics));
  } catch (error) {
    console.error('리소스 성능 데이터 저장 실패:', error);
  }
};

const saveMemoryMetrics = (metrics: any) => {
  try {
    const allMetrics = JSON.parse(localStorage.getItem('performanceMetrics') || '{}');
    allMetrics.memory = metrics;
    allMetrics.timestamp = Date.now();
    localStorage.setItem('performanceMetrics', JSON.stringify(allMetrics));
  } catch (error) {
    console.error('메모리 성능 데이터 저장 실패:', error);
  }
};

// 성능 경고 체크
const checkPerformanceWarnings = (metrics: any) => {
  const warnings = [];
  
  if (metrics.dnsLookup > 100) {
    warnings.push(`DNS 조회 시간이 100ms를 초과했습니다: ${metrics.dnsLookup.toFixed(2)}ms`);
  }
  
  if (metrics.tcpConnection > 200) {
    warnings.push(`TCP 연결 시간이 200ms를 초과했습니다: ${metrics.tcpConnection.toFixed(2)}ms`);
  }
  
  if (metrics.serverResponse > 1000) {
    warnings.push(`서버 응답 시간이 1초를 초과했습니다: ${metrics.serverResponse.toFixed(2)}ms`);
  }
  
  if (metrics.domLoad > 2000) {
    warnings.push(`DOM 로드 시간이 2초를 초과했습니다: ${metrics.domLoad.toFixed(2)}ms`);
  }
  
  if (metrics.totalLoad > 3000) {
    warnings.push(`전체 로드 시간이 3초를 초과했습니다: ${metrics.totalLoad.toFixed(2)}ms`);
  }
  
  if (warnings.length > 0) {
    console.warn('성능 경고:', warnings);
  }
};

// 성능 데이터 내보내기
export const exportPerformanceData = (): string => {
  try {
    const data = localStorage.getItem('performanceMetrics');
    if (!data) return '';
    
    const metrics = JSON.parse(data);
    const csv = convertToCSV(metrics);
    
    // CSV 파일 다운로드
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `performance-metrics-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    return csv;
  } catch (error) {
    console.error('성능 데이터 내보내기 실패:', error);
    return '';
  }
};

// 데이터를 CSV로 변환
const convertToCSV = (data: any): string => {
  const flatten = (obj: any, prefix = ''): any[] => {
    return Object.keys(obj).reduce((acc: any[], key) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        acc.push(...flatten(obj[key], pre + key));
      } else {
        acc.push({ key: pre + key, value: obj[key] });
      }
      return acc;
    }, []);
  };
  
  const flattened = flatten(data);
  const headers = ['Metric', 'Value'];
  const rows = flattened.map(item => [item.key, item.value]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

// 성능 모니터링 시작
export const startPerformanceMonitoring = () => {
  measureCoreWebVitals();
  measurePageLoadPerformance();
  measureResourcePerformance();
  
  // 주기적으로 메모리 사용량 측정
  setInterval(measureMemoryUsage, 10000); // 10초마다
  
  console.log('성능 모니터링이 시작되었습니다.');
};
