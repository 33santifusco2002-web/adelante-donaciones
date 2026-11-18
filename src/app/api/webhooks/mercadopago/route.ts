import { NextResponse } from "next/server";
import { WebhookSignatureValidator, InvalidWebhookSignatureError } from "mercadopago";
import { serverEnv } from "@/lib/env";
import { store } from "@/lib/store";

export const runtime = "nodejs";

/**
 * Webhook de Mercado Pago (tópicos: payment y subscription_preapproval).
 * 1) Valida la firma x-signature con MP_WEBHOOK_SECRET.
 * 2) Consulta el recurso en la API de MP (no confiamos en el body).
 * 3) Actualiza el estado de la donación usando external_reference.
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const body = (await req.json().catch(() => ({}))) as { type?: string; topic?: string; data?: { id?: string } };
  const type = body.type || url.searchParams.get("type") || url.searchParams.get("topic") || "";
  const dataId = url.searchParams.get("data.id") || body.data?.id || url.searchParams.get("id") || "";

  if (serverEnv.mpWebhookSecret) {
    try {
      WebhookSignatureValidator.validate({
        xSignature: req.headers.get("x-signature"),
        xRequestId: req.headers.get("x-request-id"),
        dataId,
        secret: serverEnv.mpWebhookSecret,
        toleranceSeconds: 600,
      });
    } catch (err) {
      const reason = err instanceof InvalidWebhookSignatureError ? err.reason : "unknown";
      console.warn("[webhook] firma inválida:", reason);
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    console.error("[webhook] Falta MP_WEBHOOK_SECRET: se rechaza la notificación.");
    return NextResponse.json({ error: "webhook secret not configured" }, { status: 500 });
  }

  if (!dataId || !serverEnv.mpAccessToken) return NextResponse.json({ ok: true });

  try {
    const { mp } = await import("@/lib/mercadopago");
    let ref: string | undefined;
    let status: string | undefined;

    if (type === "payment") {
      const p = await mp.payment().get({ id: dataId });
      ref = p.external_reference ?? undefined;
      status = p.status ?? undefined;
    } else if (type.includes("preapproval")) {
      const s = await mp.preapproval().get({ id: dataId });
      ref = s.external_reference ?? undefined;
      status = s.status ?? undefined;
    }

    if (ref) {
      await store.update(ref, status ? { status } : {}, { at: new Date().toISOString(), type: `webhook_${type}`, status, mpId: dataId });
    }
  } catch (err) {
    console.error("[webhook] error procesando", type, dataId, err);
    return NextResponse.json({ error: "processing error" }, { status: 500 }); // MP reintenta
  }

  return NextResponse.json({ ok: true });
}
