"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { donation as copy, thanks, type Frequency } from "@/content/site";
import { ArrowRightIcon, CheckIcon, WhatsAppIcon } from "@/components/Icons";
import { track } from "@/lib/analytics";
import { STORAGE } from "@/lib/donation";
import { formatARS, parseAmount } from "@/lib/format";

type Info = { name: string; amount: number; frequency: Frequency; ref: string };

export default function ThanksContent({ siteUrl }: { siteUrl: string }) {
  const [info, setInfo] = useState<Info | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    let last: Partial<Info> = {};
    try {
      last = JSON.parse(sessionStorage.getItem(STORAGE.lastDonation) || "{}");
    } catch {}
    const frequency: Frequency = (p.get("f") ?? last.frequency) === "unica" ? "unica" : "mensual";
    const amount = parseAmount(p.get("monto") ?? "") || last.amount || 0;
    const ref = p.get("ref") || p.get("external_reference") || p.get("preapproval_id") || "";
    setInfo({ name: last.name ?? "", amount, frequency, ref });

    // Evento de conversión, una sola vez por donación (evita duplicar si recarga)
    try {
      const tracked: string[] = JSON.parse(localStorage.getItem(STORAGE.trackedRefs) || "[]");
      if (ref && tracked.includes(ref)) return;
      if (ref) localStorage.setItem(STORAGE.trackedRefs, JSON.stringify([...tracked, ref].slice(-20)));
    } catch {}
    if (amount) {
      const params = { value: amount, currency: "ARS", frequency, transaction_id: ref };
      track("Donate", params);
      track("Purchase", params);
    }
    try {
      sessionStorage.removeItem(STORAGE.draft);
    } catch {}
  }, []);

  if (!info) return <div className="min-h-[70vh]" />;

  const amountLabel = formatARS(info.amount);
  const impact = copy.amounts[info.frequency].find((a) => a.value === info.amount)?.impactLong;
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(thanks.shareText(siteUrl))}`;
  const monthlyAmount = copy.amounts.mensual.find((a) => a.featured)!.value;
  const today = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric" }).format(new Date());

  return (
    <div className="animate-fade-up mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest text-white">
        <CheckIcon className="h-6 w-6" />
      </div>
      <p className="eyebrow mt-8">Aporte confirmado</p>
      <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{thanks.title(info.name)}</h1>
      {info.amount > 0 && <p className="mt-4 text-lg leading-relaxed text-muted">{thanks.body(amountLabel, info.frequency)}</p>}

      {info.amount > 0 && (
        <dl className="mt-8 divide-y divide-line rounded-lg border border-line bg-white text-[15px]">
          <div className="flex justify-between gap-4 px-5 py-3.5">
            <dt className="text-muted">Monto</dt>
            <dd className="tabular font-semibold">{amountLabel}</dd>
          </div>
          <div className="flex justify-between gap-4 px-5 py-3.5">
            <dt className="text-muted">Frecuencia</dt>
            <dd className="font-medium">{info.frequency === "mensual" ? "Todos los meses" : "Una sola vez"}</dd>
          </div>
          <div className="flex justify-between gap-4 px-5 py-3.5">
            <dt className="text-muted">Fecha</dt>
            <dd className="font-medium">{today}</dd>
          </div>
          {info.ref && (
            <div className="flex justify-between gap-4 px-5 py-3.5">
              <dt className="text-muted">Referencia</dt>
              <dd className="tabular font-mono text-sm uppercase">{info.ref.slice(0, 8)}</dd>
            </div>
          )}
        </dl>
      )}

      {impact && <p className="mt-8 border-l-2 border-accent pl-4 text-lg leading-relaxed">{impact}</p>}
      <p className="mt-6 text-sm text-muted">{thanks.receipt}</p>

      <section className="mt-12 border-t border-line pt-10" aria-labelledby="compartir">
        <h2 id="compartir" className="font-display text-2xl font-bold">
          {thanks.shareTitle}
        </h2>
        <p className="mt-2 leading-relaxed text-muted">Un mensaje tuyo vale más que cualquier anuncio.</p>
        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("share_whatsapp", { frequency: info.frequency })}
          className="mt-5 flex min-h-14 items-center justify-center gap-2.5 rounded-lg bg-forest px-5 font-semibold text-white transition-colors hover:bg-[#0a2214]"
        >
          <WhatsAppIcon />
          {thanks.shareButton}
        </a>
      </section>

      {info.frequency === "unica" && (
        <section className="mt-10 rounded-lg bg-sand p-6" aria-labelledby="mensual">
          <h2 id="mensual" className="font-display text-xl font-bold">
            {thanks.monthlyInvite.title}
          </h2>
          <p className="mt-2 leading-relaxed text-muted">{thanks.monthlyInvite.body}</p>
          <Link
            href={`/?frecuencia=mensual&monto=${monthlyAmount}#donar`}
            onClick={() => track("upsell_monthly_click", { value: monthlyAmount })}
            className="group mt-5 inline-flex min-h-12 items-center gap-2 font-semibold underline decoration-accent decoration-2 underline-offset-[6px] hover:decoration-brand"
          >
            {thanks.monthlyInvite.button(formatARS(monthlyAmount))}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>
      )}

      <Link href="/" className="mt-10 inline-flex min-h-12 items-center text-sm font-medium text-muted hover:text-ink">
        {thanks.backHome}
      </Link>
    </div>
  );
}
