import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { Donation, DonationStore, UnsubscribeRequest } from "./types";

type Db = { donations: Record<string, Donation>; unsubscribes: UnsubscribeRequest[] };

/**
 * Guarda todo en un JSON. Sirve para el boceto y pruebas.
 * En Vercel el disco es efímero (/tmp): para producción usar una base real.
 */
export class JsonStore implements DonationStore {
  private file: string;
  private queue: Promise<unknown> = Promise.resolve();

  constructor(dir = process.env.VERCEL ? "/tmp/adelante-data" : path.join(process.cwd(), "data")) {
    this.file = path.join(dir, "donations.json");
  }

  private async read(): Promise<Db> {
    try {
      return JSON.parse(await fs.readFile(this.file, "utf8")) as Db;
    } catch {
      return { donations: {}, unsubscribes: [] };
    }
  }

  private async write(db: Db) {
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    await fs.writeFile(this.file, JSON.stringify(db, null, 2));
  }

  /** Serializa las escrituras para no pisar cambios concurrentes. */
  private mutate<T>(fn: (db: Db) => T): Promise<T> {
    const run = this.queue.then(async () => {
      const db = await this.read();
      const result = fn(db);
      await this.write(db);
      return result;
    });
    this.queue = run.catch(() => undefined);
    return run;
  }

  async create(d: Donation) {
    await this.mutate((db) => {
      db.donations[d.id] = d;
    });
  }

  async get(id: string) {
    return (await this.read()).donations[id] ?? null;
  }

  async update(id: string, patch: Partial<Donation>, event?: Donation["events"][number]) {
    return this.mutate((db) => {
      const current = db.donations[id];
      if (!current) return null;
      const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
      if (event) next.events = [...current.events, event];
      db.donations[id] = next;
      return next;
    });
  }

  async addUnsubscribe(r: UnsubscribeRequest) {
    await this.mutate((db) => {
      db.unsubscribes.push(r);
    });
  }
}
