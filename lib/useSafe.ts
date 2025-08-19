"use client";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export function useSafe(){
  const sp = useSearchParams();
  return useMemo(() => {
    try {
      const v = sp?.get("safe");
      return v === "1" || v === "true";
    } catch { return false; }
  }, [sp]);
}

