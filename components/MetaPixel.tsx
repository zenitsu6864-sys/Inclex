
"use client";

import React, { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
  }
}

export default function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const lastPageRef = useRef("");

  useEffect(() => {
    if (!pixelId || !window.fbq) return;

    const currentPage = `${pathname}?${searchParamsString}`;

    if (lastPageRef.current === currentPage) return;

    lastPageRef.current = currentPage;

    // The initial PageView is sent during Pixel initialization.
    // Track subsequent client-side navigation here.
    if (window.fbq && lastPageRef.current !== "") {
      window.fbq("track", "PageView");
    }
  }, [pathname, searchParamsString]);

  if (!pixelId) return null;

  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}
          (window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','${pixelId}');
          fbq('track','PageView');
        `,
      }}
      onError={(error) => {
        console.error("Meta Pixel script failed to load:", error);
      }}
    />
  );
}
