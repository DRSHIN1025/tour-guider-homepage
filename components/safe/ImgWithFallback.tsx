"use client";
import Image from "next/image";
import { useState } from "react";

export default function ImgWithFallback({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  fallback = "/og.png",
  ...props
}: any) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  
  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };
  
  return (
    <Image
      src={imgSrc}
      alt={alt || ""}
      width={width || 1200}
      height={height || 630}
      className={className}
      onError={handleError}
      unoptimized
      {...props}
    />
  );
}



