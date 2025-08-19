import "./globals.css";
import { Noto_Sans_KR } from "next/font/google";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: "K-BIZ TRAVEL",
  description: "현지 전문가와 함께하는 맞춤 여행",
  // !!! viewport는 metadata 안에 넣지 마세요
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSansKr.className}>
      <body className={`${notoSansKr.className} min-h-dvh bg-white text-slate-900 antialiased`}>{children}</body>
    </html>
  );
}