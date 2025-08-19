"use client";
export default function Error(
  { error, reset }: { error: Error & { digest?: string }; reset: () => void; }
) {
  return (
    <div style={{padding:24}}>
      <h2>문제가 발생했습니다.</h2>
      <pre style={{whiteSpace:"pre-wrap"}}>{error?.message}</pre>
      <button onClick={() => reset()} style={{marginTop:12,border:"1px solid #e2e8f0",padding:"8px 12px",borderRadius:8}}>
        다시 시도
      </button>
    </div>
  );
}