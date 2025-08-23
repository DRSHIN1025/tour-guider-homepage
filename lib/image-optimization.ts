// 이미지 최적화 유틸리티

// WebP 지원 여부 확인
export const supportsWebP = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// 반응형 이미지 소스 생성
export const generateResponsiveImageSrc = (
  basePath: string,
  width: number,
  format: 'webp' | 'jpeg' | 'png' = 'webp'
): string => {
  const extension = format === 'webp' ? 'webp' : format;
  return `${basePath}-${width}w.${extension}`;
};

// 이미지 크기별 소스셋 생성
export const generateImageSrcSet = (
  basePath: string,
  sizes: number[],
  format: 'webp' | 'jpeg' | 'png' = 'webp'
): string => {
  return sizes
    .map(size => `${generateResponsiveImageSrc(basePath, size, format)} ${size}w`)
    .join(', ');
};

// 이미지 지연 로딩을 위한 Intersection Observer 설정
export const createImageObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, defaultOptions);
};

// 이미지 압축 품질 계산
export const calculateImageQuality = (width: number, height: number): number => {
  const totalPixels = width * height;
  
  if (totalPixels > 2000000) return 0.7; // 200만 픽셀 이상: 70%
  if (totalPixels > 1000000) return 0.8; // 100만 픽셀 이상: 80%
  if (totalPixels > 500000) return 0.85;  // 50만 픽셀 이상: 85%
  return 0.9; // 기본: 90%
};

// 이미지 크기 최적화
export const optimizeImageSize = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number = 1920,
  maxHeight: number = 1080
): { width: number; height: number } => {
  let { width, height } = { width: originalWidth, height: originalHeight };
  
  // 최대 크기 제한
  if (width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }
  
  if (height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }
  
  // 8의 배수로 맞춤 (압축 효율성 향상)
  width = Math.round(width / 8) * 8;
  height = Math.round(height / 8) * 8;
  
  return { width, height };
};

// 이미지 포맷별 MIME 타입
export const getImageMimeType = (format: string): string => {
  switch (format.toLowerCase()) {
    case 'webp':
      return 'image/webp';
    case 'jpeg':
    case 'jpg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'avif':
      return 'image/avif';
    default:
      return 'image/jpeg';
  }
};

// 이미지 파일 크기 포맷팅
export const formatImageFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 이미지 지연 로딩 훅을 위한 타입
export interface LazyImageOptions {
  threshold?: number;
  rootMargin?: string;
  fallback?: string;
  placeholder?: string;
}

// 이미지 프리로딩
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// 이미지 배치 프리로딩
export const preloadImages = (srcs: string[]): Promise<void[]> => {
  return Promise.all(srcs.map(preloadImage));
};
