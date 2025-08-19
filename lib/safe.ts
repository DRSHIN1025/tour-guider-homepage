export function readSafe(searchParams?: any): boolean {
  try {
    if (!searchParams) return false;
    // Next App Router server component: props.searchParams?.safe
    if (typeof searchParams?.get === "function") {
      const v = searchParams.get("safe");
      return v === "1" || v === "true";
    }
    const v = (searchParams as any)?.safe ?? (searchParams as any)?.["safe"];
    if (typeof v === "string") return v === "1" || v === "true";
    return !!v;
  } catch { return false; }
}

