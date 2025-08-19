export const siteConfig = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || "K-BIZ TRAVEL CORP",
  description: process.env.NEXT_PUBLIC_BRAND_TAGLINE || "Business Travel. Better.",
  url: (process.env.SITE_URL || "https://www.tourguider.biz").replace(/\/$/, ""),
  logo: process.env.NEXT_PUBLIC_BRAND_LOGO || "/brand/logo.png",
  ogImage: "/brand/og.png",
} as const;

export function abs(u: string) {
  const base = (siteConfig.url || "").replace(/\/$/, "");
  return /^https?:\/\//.test(u) ? u : `${base}${u.startsWith("/") ? "" : "/"}${u}`;
}


