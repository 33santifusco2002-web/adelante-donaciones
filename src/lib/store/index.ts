import "server-only";
import { JsonStore } from "./json-store";
import type { DonationStore } from "./types";

// Cambiar esta línea para usar otra implementación de DonationStore.
export const store: DonationStore = new JsonStore();
export type * from "./types";
