/**
 * Medición: todo evento va al dataLayer (GTM / GA4) y, si hay Pixel, a Meta.
 * Embudo: ViewContent → select_frequency → select_amount → step_2_view → InitiateCheckout → Donate/Purchase
 */

type Params = Record<string, string | number | boolean | undefined>;

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

/** Stub del Pixel: encola llamadas hasta que fbevents.js se cargue (diferido). */
export function ensureFbq() {
  if (typeof window === "undefined" || !PIXEL_ID || window.fbq) return;
  const n = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue.push(args);
  } as Fbq;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  window.fbq = n;
  window._fbq = n;
  n("init", PIXEL_ID);
  n("track", "PageView");
}

const META_STANDARD: Record<string, string> = {
  ViewContent: "ViewContent",
  InitiateCheckout: "InitiateCheckout",
  Donate: "Donate",
  Purchase: "Purchase",
};

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });

  if (PIXEL_ID) {
    ensureFbq();
    if (META_STANDARD[event]) window.fbq?.("track", META_STANDARD[event], params);
    else window.fbq?.("trackCustom", event, params);
  }

  if (process.env.NODE_ENV !== "production") console.debug("[track]", event, params);
}
