"use client";
import Image from "next/image";

export default function BrandLogo({ 
  className, 
  priority = false 
}: { 
  className?: string; 
  priority?: boolean 
}) {
  const src = process.env.NEXT_PUBLIC_BRAND_LOGO || "/brand/logo.png";
  
  return (
    <Image 
      src={src} 
      alt="K-BIZ TRAVEL CORP" 
      width={140} 
      height={32} 
      className={className} 
      priority={priority} 
    />
  );
}


