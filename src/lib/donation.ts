import type { Frequency } from "@/content/site";

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

export type Attribution = Partial<Record<(typeof UTM_KEYS)[number], string>> & { landing?: string };

export type CheckoutRequest = {
  frequency: Frequency;
  amount: number;
  name: string;
  email: string;
  phone?: string;
  newsletter?: boolean;
  attribution?: Attribution;
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Claves de sessionStorage compartidas entre la landing y /gracias */
export const STORAGE = {
  draft: "adelante:draft",
  attribution: "adelante:attribution",
  lastDonation: "adelante:last-donation",
  trackedRefs: "adelante:tracked-refs",
} as const;
