'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { pageview, GA_TRACKING_ID } from '@/lib/analytics'
import Script from 'next/script'

function AnalyticsContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + searchParams.toString()
    pageview(url)
  }, [pathname, searchParams])

  return null
}

export function Analytics() {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsContent />
      </Suspense>
      
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_location: window.location.href,
              page_title: document.title,
              send_page_view: true
            });
          `,
        }}
      />

      {/* Facebook Pixel */}
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'YOUR_PIXEL_ID');
            fbq('track', 'PageView');
          `,
        }}
      />

      {/* Naver Analytics */}
      <Script
        id="naver-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(window, document, "script", "//wcs.naver.net/wcslog.js", "wcs") {
              if (!window.wcs) {
                window.wcs = {};
                window.wcs.inflow = function(a,b,c) { window.wcs.inflow.q=window.wcs.inflow.q||[]; window.wcs.inflow.q.push([a,b,c]); };
                window.wcs_add = {}; window.wcs_do = {}; window.wcs.ready = function(a) { window.wcs.ready.q=window.wcs.ready.q||[]; window.wcs.ready.q.push(a); };
                var g=document.createElement("script"); g.type="text/javascript"; g.async=true; g.src="//wcs.naver.net/wcslog.js";
                var a=document.getElementsByTagName("script")[0]; a.parentNode.insertBefore(g,a);
              }
              if(window.wcs) {
                window.wcs.inflow("tourguider.co.kr");
                window.wcs.ready(function() {
                  window.wcs.setDomain("wcs.naver.net");
                  window.wcs.setConversion("YOUR_CONVERSION_ID");
                  window.wcs.send();
                });
              }
            })(window, document);
          `,
        }}
      />

      {/* Hotjar */}
      <Script
        id="hotjar"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `,
        }}
      />
    </>
  )
} 