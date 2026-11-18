import type { Frequency } from "@/content/site";
import type { Attribution } from "@/lib/donation";

export type DonationStatus = "created" | "pending" | "approved" | "authorized" | "rejected" | "cancelled" | "simulated" | string;

export type Donation = {
  id: string; // external_reference
  createdAt: string;
  updatedAt: string;
  frequency: Frequency;
  amount: number;
  name: string;
  email: string;
  phone?: string;
  newsletter: boolean;
  attribution: Attribution;
  status: DonationStatus;
  mpId?: string; // id de preferencia / preapproval / pago
  events: { at: string; type: string; status?: string; mpId?: string }[];
};

export type UnsubscribeRequest = { id: string; createdAt: string; email: string; reason?: string };

/**
 * Interfaz de persistencia. Para pasar a una base real (Postgres, Supabase,
 * Vercel KV, etc.) alcanza con implementar esta interfaz y cambiarla en ./index.ts.
 */
export interface DonationStore {
  create(d: Donation): Promise<void>;
  get(id: string): Promise<Donation | null>;
  update(id: string, patch: Partial<Donation>, event?: Donation["events"][number]): Promise<Donation | null>;
  addUnsubscribe(r: UnsubscribeRequest): Promise<void>;
}
