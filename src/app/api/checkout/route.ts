import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { donation as copy, org, type Frequency } from "@/content/site";
import { EMAIL_RE, UTM_KEYS, type Attribution, type CheckoutRequest } from "@/lib/donation";
import { isPaymentSimulated, isPublicUrl, serverEnv } from "@/lib/env";
import { formatARS } from "@/lib/format";
import { store } from "@/lib/store";

export const runtime = "nodejs";

function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function cleanAttribution(a: unknown): Attribution {
  const out: Attribution = {};
  if (!a || typeof a !== "object") return out;
  for (const key of [...UTM_KEYS, "landing"] as const) {
    const v = (a as Record<string, unknown>)[key];
    if (typeof v === "string" && v) out[key] = v.slice(0, 200);
  }
  return out;
}

export async function POST(req: Request) {
  let body: CheckoutRequest;
  try {
    body = await req.json();
  } catch {
    return fail(copy.errors.generic);
  }

  const frequency: Frequency = body.frequency === "unica" ? "unica" : "mensual";
  const amount = Math.round(Number(body.amount));
  const name = String(body.name ?? "").trim().slice(0, 80);
  const email = String(body.email ?? "").trim().toLowerCase().slice(0, 120);
  const phone = String(body.phone ?? "").replace(/[^\d+]/g, "").slice(0, 20) || undefined;

  if (!Number.isFinite(amount) || amount < copy.minAmount) return fail(copy.errors.minAmount(formatARS(copy.minAmount)));
  if (!name) return fail(copy.errors.nameRequired);
  if (!EMAIL_RE.test(email)) return fail(copy.errors.emailInvalid);

  const id = randomUUID();
  const now = new Date().toISOString();
  await store.create({
    id,
    createdAt: now,
    updatedAt: now,
    frequency,
    amount,
    name,
    email,
    phone,
    newsletter: Boolean(body.newsletter),
    attribution: cleanAttribution(body.attribution),
    status: isPaymentSimulated() ? "simulated" : "created",
    events: [{ at: now, type: "checkout_created" }],
  });

  const query = `ref=${id}&monto=${amount}&f=${frequency}`;

  // MODO DEMO: sin credenciales de Mercado Pago, simulamos el pago.
  if (isPaymentSimulated()) {
    return NextResponse.json({ redirect: `/gracias?${query}&demo=1`, simulated: true });
  }

  const site = serverEnv.siteUrl;
  const publicSite = isPublicUrl(site);
  const reason = `Aporte ${frequency === "mensual" ? "mensual" : "único"} a ${org.legalName}`;

  try {
    const { mp } = await import("@/lib/mercadopago");

    if (frequency === "mensual") {
      // Suscripción sin plan asociado: el donante autoriza el débito mensual en Mercado Pago.
      const sub = await mp.preapproval().create({
        body: {
          reason,
          external_reference: id,
          payer_email: email,
          back_url: publicSite ? `${site}/gracias?${query}` : "https://www.mercadopago.com.ar",
          status: "pending",
          auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: amount, currency_id: "ARS" },
        },
      });
      await store.update(id, { status: "pending", mpId: sub.id }, { at: new Date().toISOString(), type: "preapproval_created", mpId: sub.id });
      if (!sub.init_point) throw new Error("preapproval sin init_point");
      return NextResponse.json({ redirect: sub.init_point });
    }

    const pref = await mp.preference().create({
      body: {
        items: [{ id: "donacion-unica", title: reason, quantity: 1, unit_price: amount, currency_id: "ARS", category_id: "donations" }],
        payer: { name, email },
        external_reference: id,
        statement_descriptor: "ADELANTE",
        notification_url: publicSite ? `${site}/api/webhooks/mercadopago` : undefined,
        back_urls: {
          success: `${site}/gracias?${query}`,
          pending: `${site}/pago-pendiente?${query}`,
          failure: `${site}/pago-fallido?${query}`,
        },
        auto_return: publicSite ? "approved" : undefined,
        metadata: { donation_id: id, frequency },
      },
    });
    await store.update(id, { mpId: pref.id }, { at: new Date().toISOString(), type: "preference_created", mpId: pref.id });
    const url = pref.init_point || pref.sandbox_init_point;
    if (!url) throw new Error("preferencia sin init_point");
    return NextResponse.json({ redirect: url });
  } catch (err) {
    console.error("[checkout] Error de Mercado Pago:", err);
    await store.update(id, { status: "error" }, { at: new Date().toISOString(), type: "mp_error" });
    return fail(copy.errors.generic, 502);
  }
}
