// 통일된 디자인 시스템 - K-BIZ TRAVEL 브랜딩
export const designSystem = {
  colors: {
    // 메인 브랜드 컬러 (네이비 + 그린)
    primary: {
      navy: {
        50: '#f0f9ff',
        100: '#e0f2fe', 
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9', // 메인 네이비
        600: '#0284c7',
        700: '#0369a1', // 다크 네이비
        800: '#075985',
        900: '#0c4a6e',
      },
      green: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0', 
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e', // 메인 그린
        600: '#16a34a',
        700: '#15803d', // 다크 그린
        800: '#166534',
        900: '#14532d',
      }
    },
    // 보조 컬러
    secondary: {
      gray: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
      accent: {
        orange: '#ff6b35',
        yellow: '#ffd23f',
        purple: '#8b5cf6',
        pink: '#f472b6',
      }
    },
    // 상태별 컬러
    status: {
      success: '#10b981',
      warning: '#f59e0b', 
      error: '#ef4444',
      info: '#3b82f6',
    }
  },

  typography: {
    fontFamily: {
      display: ['Pretendard', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      body: ['Pretendard', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    }
  },

  spacing: {
    px: '1px',
    0: '0px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem',
  },

  borderRadius: {
    none: '0px',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    glow: '0 0 20px rgba(34, 197, 94, 0.3)',
  },

  gradients: {
    primary: 'linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%)',
    secondary: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    hero: 'linear-gradient(135deg, #0369a1 0%, #15803d 50%, #0284c7 100%)',
    card: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
    accent: 'linear-gradient(135deg, #ff6b35 0%, #ffd23f 100%)',
  },

  animation: {
    duration: {
      fast: '150ms',
      base: '300ms',
      slow: '500ms',
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },

  components: {
    button: {
      primary: {
        base: 'bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105',
        large: 'bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold px-8 py-4 text-lg rounded-2xl hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105',
      },
      secondary: {
        base: 'bg-white text-gray-700 border-2 border-gray-200 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300',
        large: 'bg-white text-gray-700 border-2 border-gray-200 font-bold px-8 py-4 text-lg rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300',
      }
    },
    card: {
      base: 'bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden',
      elevated: 'bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300',
      glass: 'bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl',
    },
    input: {
      base: 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300',
      large: 'w-full px-6 py-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300',
    }
  },

  layout: {
    container: {
      sm: '640px',
      md: '768px', 
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    header: {
      height: '80px',
      mobileHeight: '64px',
    },
    section: {
      padding: '120px 0',
      mobilePadding: '80px 0',
    }
  }
};

// 공통 클래스 유틸리티
export const commonClasses = {
  container: 'container mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-20 sm:py-24 lg:py-32',
  heading: {
    h1: 'text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight',
    h2: 'text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight',
    h3: 'text-2xl sm:text-3xl font-bold leading-tight',
    h4: 'text-xl sm:text-2xl font-bold leading-tight',
  },
  text: {
    lead: 'text-lg sm:text-xl text-gray-600 leading-relaxed',
    body: 'text-base sm:text-lg text-gray-600 leading-relaxed',
    small: 'text-sm sm:text-base text-gray-500',
  },
  grid: {
    responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8',
    features: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8',
  },
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
  }
};