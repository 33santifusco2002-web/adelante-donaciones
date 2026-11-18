/** Solo server-side. El access token nunca se expone al cliente. */
export const serverEnv = {
  mpAccessToken: process.env.MP_ACCESS_TOKEN?.trim() || "",
  mpWebhookSecret: process.env.MP_WEBHOOK_SECRET?.trim() || "",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
};

/** Sin credenciales de Mercado Pago, el pago se simula. */
export const isPaymentSimulated = () => !serverEnv.mpAccessToken;

/** Mercado Pago no acepta back_url / notification_url en localhost. */
export const isPublicUrl = (url: string) => /^https:\/\//.test(url) && !/localhost|127\.0\.0\.1/.test(url);
