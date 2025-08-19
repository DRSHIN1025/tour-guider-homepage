'use client'
import { useEffect } from 'react';
export default function DevGuard({ label }: { label: string }) {
  useEffect(() => {
    const onErr = (e:any)=>console.error('[GlobalError]', label, e?.message||e, e?.error||e);
    const onRej = (e:any)=>console.error('[UnhandledRejection]', label, e?.reason||e);
    window.addEventListener('error', onErr);
    window.addEventListener('unhandledrejection', onRej);
    return ()=>{ window.removeEventListener('error', onErr); window.removeEventListener('unhandledrejection', onRej); };
  }, [label]);
  return null;
}

