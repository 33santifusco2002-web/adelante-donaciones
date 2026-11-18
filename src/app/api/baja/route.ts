import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { EMAIL_RE } from "@/lib/donation";
import { store } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: string; reason?: string };
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Revisá el e-mail." }, { status: 400 });

  await store.addUnsubscribe({
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    email,
    reason: String(body.reason ?? "").slice(0, 500) || undefined,
  });
  // PENDIENTE: avisar al equipo de Adelante (e-mail) cuando haya un servicio de envío configurado.
  return NextResponse.json({ ok: true });
}
