'use client';

import { useEffect, useState } from 'react';

export default function Now() {
  const [now, setNow] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setNow(new Date().toLocaleString('ko-KR'));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <span suppressHydrationWarning>
      {now}
    </span>
  );
}
