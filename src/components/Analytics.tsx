"use client";

import Script from "next/script";
import { useEffect } from "react";
import { ensureFbq, GTM_ID, PIXEL_ID } from "@/lib/analytics";

/** Meta Pixel y GTM cargados de forma diferida, solo si están configurados. */
export default function Analytics() {
  useEffect(() => {
    ensureFbq();
    if (GTM_ID) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    }
  }, []);

  return (
    <>
      {PIXEL_ID && <Script id="meta-pixel" src="https://connect.facebook.net/en_US/fbevents.js" strategy="lazyOnload" />}
      {GTM_ID && <Script id="gtm" src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`} strategy="lazyOnload" />}
    </>
  );
}
