"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { donation as copy, org, type Frequency } from "@/content/site";
import { track } from "@/lib/analytics";
import { EMAIL_RE, STORAGE, UTM_KEYS, type Attribution } from "@/lib/donation";
import { formatARS, formatThousands, parseAmount } from "@/lib/format";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, CopyIcon, LockIcon } from "./Icons";
import PaymentLogos from "./PaymentLogos";

type Selection = number | "otro";

type Draft = {
  frequency: Frequency;
  selection: Selection;
  other: string;
  name: string;
  email: string;
  phone: string;
  newsletter: boolean;
};

const featuredOf = (f: Frequency) => (copy.amounts[f].find((a) => a.featured) ?? copy.amounts[f][0]).value;

function readSession<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeSession(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* modo privado: seguimos sin guardar */
  }
}

const initialDraft: Draft = {
  frequency: "mensual",
  selection: featuredOf("mensual"),
  other: "",
  name: "",
  email: "",
  phone: "",
  newsletter: false,
};

const primaryButton =
  "group flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 text-[17px] font-semibold text-ink " +
  "shadow-[inset_0_-2px_0_rgba(0,0,0,0.08)] transition-colors hover:bg-accent-dark disabled:opacity-60";

export default function DonationForm() {
  const [d, setD] = useState<Draft>(initialDraft);
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<Partial<Record<"amount" | "name" | "email" | "phone", string>>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState<false | "mp" | "demo">(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [copied, setCopied] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const step2Heading = useRef<HTMLHeadingElement>(null);
  const step1Heading = useRef<HTMLHeadingElement>(null);
  const otherInput = useRef<HTMLInputElement>(null);

  // Estado inicial: borrador guardado + parámetros de URL de los anuncios + atribución UTM
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let next: Draft = { ...initialDraft, ...(readSession<Draft>(STORAGE.draft) ?? {}) };

    const f = params.get("frecuencia");
    if (f === "mensual" || f === "unica") next = { ...next, frequency: f, selection: featuredOf(f), other: "" };
    const monto = parseAmount(params.get("monto") ?? "");
    if (monto > 0) {
      const preset = copy.amounts[next.frequency].some((a) => a.value === monto);
      next = preset ? { ...next, selection: monto, other: "" } : { ...next, selection: "otro", other: formatThousands(monto) };
    }
    setD(next);

    const attribution: Attribution = {};
    UTM_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) attribution[k] = v;
    });
    if (Object.keys(attribution).length) {
      attribution.landing = window.location.pathname + window.location.search;
      writeSession(STORAGE.attribution, attribution);
    }

    setHydrated(true);
    track("ViewContent", { content_name: "donacion", frequency: next.frequency });
  }, []);

  useEffect(() => {
    if (hydrated) writeSession(STORAGE.draft, d);
  }, [d, hydrated]);

  const options = copy.amounts[d.frequency];
  const amount = d.selection === "otro" ? parseAmount(d.other) : d.selection;
  const amountLabel = formatARS(amount);
  const perMonth = d.frequency === "mensual";
  const impactText = useMemo(() => {
    if (d.selection !== "otro") return options.find((o) => o.value === d.selection)?.impactLong ?? "";
    return copy.otherImpactLong;
  }, [d.selection, options]);

  const update = (patch: Partial<Draft>) => setD((prev) => ({ ...prev, ...patch }));

  function selectFrequency(f: Frequency) {
    if (f === d.frequency) return;
    const keepOther = d.selection === "otro" && parseAmount(d.other) > 0;
    update({ frequency: f, selection: keepOther ? "otro" : featuredOf(f) });
    setErrors({});
    track("select_frequency", { frequency: f });
  }

  function selectAmount(s: Selection) {
    update({ selection: s });
    setErrors((e) => ({ ...e, amount: undefined }));
    if (s === "otro") setTimeout(() => otherInput.current?.focus(), 0);
    else track("select_amount", { value: s, currency: "ARS", frequency: d.frequency });
  }

  function validateAmount() {
    if (!amount) return copy.errors.amountRequired;
    if (amount < copy.minAmount) return copy.errors.minAmount(formatARS(copy.minAmount));
    return undefined;
  }

  function goToStep2(e: React.FormEvent) {
    e.preventDefault();
    const err = validateAmount();
    if (err) {
      setErrors({ amount: err });
      otherInput.current?.focus();
      return;
    }
    if (d.selection === "otro") track("select_amount", { value: amount, currency: "ARS", frequency: d.frequency, custom: true });
    setStep(2);
    track("step_2_view", { value: amount, currency: "ARS", frequency: d.frequency });
  }

  function goBack() {
    setStep(1);
    setServerError("");
  }

  // Al cambiar de paso: foco en el título (lectores de pantalla) y bloque visible
  const prevStep = useRef(step);
  useEffect(() => {
    if (prevStep.current === step) return;
    prevStep.current = step;
    (step === 1 ? step1Heading : step2Heading).current?.focus({ preventScroll: true });
    document.getElementById("donar")?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [step]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!d.name.trim()) nextErrors.name = copy.errors.nameRequired;
    if (!EMAIL_RE.test(d.email.trim())) nextErrors.email = copy.errors.emailInvalid;
    if (d.phone && d.phone.replace(/\D/g, "").length < 8) nextErrors.phone = copy.errors.phoneInvalid;
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      document.getElementById(`donor-${firstError}`)?.focus();
      return;
    }

    setServerError("");
    setSubmitting("mp");
    track("InitiateCheckout", { value: amount, currency: "ARS", frequency: d.frequency });

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frequency: d.frequency,
          amount,
          name: d.name.trim(),
          email: d.email.trim(),
          phone: d.phone.trim() || undefined,
          newsletter: d.newsletter,
          attribution: readSession<Attribution>(STORAGE.attribution) ?? {},
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { redirect?: string; error?: string; simulated?: boolean };
      if (!res.ok || !data.redirect) throw new Error(data.error || copy.errors.generic);

      writeSession(STORAGE.lastDonation, { name: d.name.trim().split(" ")[0], amount, frequency: d.frequency });
      if (data.simulated) {
        setSubmitting("demo");
        await new Promise((r) => setTimeout(r, 1400));
      }
      window.location.assign(data.redirect);
    } catch (err) {
      setSubmitting(false);
      setServerError(err instanceof Error && err.message ? err.message : copy.errors.generic);
      track("checkout_error", { value: amount, frequency: d.frequency });
    }
  }

  async function copyValue(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      /* el usuario puede copiar a mano */
    }
  }

  const option =
    "relative flex h-full cursor-pointer rounded-lg border bg-white transition-[border-color,box-shadow,background-color] duration-150 " +
    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand";
  const optionOn = "border-forest bg-brand-50/50 shadow-[0_0_0_1px_var(--color-forest)]";
  const optionOff = "border-line-strong hover:border-muted";

  const SelectedMark = ({ on }: { on: boolean }) => (
    <span
      aria-hidden="true"
      className={`absolute top-3 right-3 flex h-[18px] w-[18px] items-center justify-center rounded-full border transition-colors ${
        on ? "border-forest bg-forest text-white" : "border-line bg-white text-transparent"
      }`}
    >
      <CheckIcon className="h-3 w-3" />
    </span>
  );

  return (
    <div className="relative">
      {submitting && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-white/95 text-center" role="status" aria-live="assertive">
          <span className="h-9 w-9 animate-spin rounded-full border-2 border-line border-t-forest motion-reduce:animate-none" aria-hidden="true" />
          <p className="font-medium">{submitting === "demo" ? copy.processingDemo : copy.processing}</p>
        </div>
      )}

      <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-muted">
        <span className="tabular">{copy.stepLabel(step)}</span>
        <span className="flex flex-1 gap-1" aria-hidden="true">
          <span className="h-0.5 flex-1 rounded-full bg-forest" />
          <span className={`h-0.5 flex-1 rounded-full transition-colors ${step === 2 ? "bg-forest" : "bg-line"}`} />
        </span>
      </div>

      {step === 1 ? (
        <form onSubmit={goToStep2} noValidate className="animate-fade-up">
          <h2 ref={step1Heading} tabIndex={-1} className="mt-5 font-display text-2xl font-bold outline-none">
            {copy.step1Title}
          </h2>

          <fieldset className="mt-5">
            <legend className="sr-only">{copy.frequencyLegend}</legend>
            <div className="grid grid-cols-2 rounded-lg border border-line bg-paper p-1">
              {(["mensual", "unica"] as Frequency[]).map((f) => (
                <label key={f} className="relative">
                  <input type="radio" name="frequency" value={f} checked={d.frequency === f} onChange={() => selectFrequency(f)} className="peer sr-only" />
                  <span className="flex min-h-12 cursor-pointer flex-col items-center justify-center rounded-md px-2 text-center text-[15px] font-semibold text-muted transition-colors peer-checked:bg-forest peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand hover:text-ink peer-checked:hover:text-white">
                    {copy.frequencyLabels[f]}
                    {f === "mensual" && <span className="text-[11px] font-medium tracking-wide opacity-75">{copy.frequencyHint}</span>}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="mb-3 text-sm font-semibold">{copy.amountLegend}</legend>
            <div className="grid grid-cols-2 gap-2">
              {options.map((o) => {
                const on = d.selection === o.value;
                return (
                  <label key={`${d.frequency}-${o.value}`} className="relative">
                    <input type="radio" name="amount" value={o.value} checked={on} onChange={() => selectAmount(o.value)} className="peer sr-only" />
                    <span className={`${option} min-h-[92px] flex-col justify-end px-3.5 pt-3 pb-3 ${on ? optionOn : optionOff}`}>
                      <SelectedMark on={on} />
                      {o.featured && <span className="mb-auto text-[10px] font-bold tracking-[0.12em] text-brand uppercase">{copy.featuredBadge}</span>}
                      <span className="tabular mt-3 font-display text-[22px] leading-none font-bold tracking-tight">{formatARS(o.value)}</span>
                      <span className="mt-1.5 text-[13px] leading-snug text-muted">{o.impact}</span>
                    </span>
                  </label>
                );
              })}
              <label className="relative col-span-2">
                <input type="radio" name="amount" value="otro" checked={d.selection === "otro"} onChange={() => selectAmount("otro")} className="peer sr-only" />
                <span className={`${option} min-h-12 items-center px-3.5 text-[15px] font-semibold ${d.selection === "otro" ? optionOn : optionOff}`}>
                  <SelectedMark on={d.selection === "otro"} />
                  {copy.otherAmountLabel}
                </span>
              </label>
            </div>

            {d.selection === "otro" && (
              <div className="animate-fade-up mt-3">
                <label htmlFor="other-amount" className="sr-only">
                  {copy.otherAmountLabel}
                </label>
                <div
                  className={`flex min-h-14 items-center rounded-lg border bg-white px-4 transition-shadow focus-within:border-forest focus-within:shadow-[0_0_0_3px_rgba(11,122,30,0.15)] ${
                    errors.amount ? "border-danger" : "border-line-strong"
                  }`}
                >
                  <span className="mr-1.5 font-display text-xl font-bold text-muted" aria-hidden="true">
                    $
                  </span>
                  <input
                    ref={otherInput}
                    id="other-amount"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={copy.otherAmountPlaceholder}
                    value={d.other}
                    onChange={(e) => {
                      const n = parseAmount(e.target.value);
                      update({ other: n ? formatThousands(Math.min(n, 99_999_999)) : "" });
                      setErrors((er) => ({ ...er, amount: undefined }));
                    }}
                    onBlur={() => amount > 0 && setErrors((er) => ({ ...er, amount: validateAmount() }))}
                    aria-invalid={Boolean(errors.amount)}
                    aria-describedby="other-amount-help"
                    className="tabular w-full bg-transparent py-3 font-display text-xl font-bold outline-none placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-muted/70 focus-visible:outline-none"
                  />
                  {perMonth && <span className="ml-2 text-sm whitespace-nowrap text-muted">por mes</span>}
                </div>
                <p id="other-amount-help" className={`mt-2 text-[13px] ${errors.amount ? "font-medium text-danger" : "text-muted"}`}>
                  {errors.amount ?? `Mínimo ${formatARS(copy.minAmount)}`}
                </p>
              </div>
            )}
          </fieldset>

          <p className="mt-5 border-l-2 border-accent pl-4 text-[15px] leading-relaxed" aria-live="polite">
            {impactText}
          </p>

          <button type="submit" className={`${primaryButton} mt-6`}>
            {copy.continueButton(amount ? amountLabel : "tu aporte", d.frequency)}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <p className="mt-4 flex items-start justify-center gap-1.5 text-center text-[13px] leading-snug text-muted">
            <LockIcon className="mt-px h-3.5 w-3.5 shrink-0" />
            <span>
              {copy.security}
              {perMonth && `. ${copy.cancelAnytime}.`}
            </span>
          </p>
        </form>
      ) : (
        <form onSubmit={submit} noValidate className="animate-fade-up">
          <button
            type="button"
            onClick={goBack}
            className="-ml-2 mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <ArrowLeftIcon /> {copy.backButton}
          </button>
          <h2 ref={step2Heading} tabIndex={-1} className="mt-1 font-display text-2xl font-bold outline-none">
            {copy.step2Title}
          </h2>

          <div className="mt-4 flex items-baseline justify-between gap-3 rounded-lg bg-paper px-4 py-3 text-[15px]">
            <span className="text-muted">Tu aporte</span>
            <span className="tabular font-semibold">
              {amountLabel}
              <span className="font-normal text-muted">{perMonth ? " por mes" : " · una vez"}</span>
            </span>
          </div>

          <div className="mt-6 space-y-5">
            <Field
              id="donor-name"
              label={copy.fields.name}
              error={errors.name}
              input={{ autoComplete: "given-name", value: d.name, onChange: (e) => update({ name: e.target.value }), required: true }}
            />
            <Field
              id="donor-email"
              label={copy.fields.email}
              hint={copy.fields.emailHint}
              error={errors.email}
              input={{
                type: "email",
                inputMode: "email",
                autoComplete: "email",
                autoCapitalize: "none",
                spellCheck: false,
                value: d.email,
                onChange: (e) => update({ email: e.target.value }),
                required: true,
              }}
            />
            <Field
              id="donor-phone"
              label={copy.fields.phone}
              hint={copy.fields.phoneHint}
              error={errors.phone}
              input={{ type: "tel", inputMode: "tel", autoComplete: "tel", value: d.phone, onChange: (e) => update({ phone: e.target.value }) }}
            />
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
              <input
                type="checkbox"
                checked={d.newsletter}
                onChange={(e) => update({ newsletter: e.target.checked })}
                className="h-[18px] w-[18px] shrink-0 rounded accent-forest"
              />
              {copy.fields.newsletter}
            </label>
          </div>

          {serverError && (
            <p role="alert" className="mt-5 border-l-2 border-danger bg-danger/5 py-3 pr-3 pl-4 text-sm leading-relaxed text-danger">
              {serverError}
            </p>
          )}

          <button type="submit" disabled={Boolean(submitting)} className={`${primaryButton} mt-6`}>
            <LockIcon className="h-4 w-4" />
            {copy.donateButton(amountLabel, d.frequency)}
          </button>

          <div className="mt-5 space-y-3 text-center text-[13px] text-muted">
            <PaymentLogos />
            <p>
              {copy.security}
              {perMonth && (
                <>
                  <br />
                  {copy.cancelAnytime}
                </>
              )}
            </p>
          </div>

          <div className="mt-6 border-t border-line pt-2">
            <button
              type="button"
              aria-expanded={showTransfer}
              aria-controls="transfer-panel"
              onClick={() => setShowTransfer((v) => !v)}
              className="flex min-h-12 w-full items-center justify-between text-sm font-medium text-ink"
            >
              {copy.transfer.toggle}
              <span aria-hidden="true" className={`text-lg text-muted transition-transform ${showTransfer ? "rotate-45" : ""}`}>
                +
              </span>
            </button>
            {showTransfer && (
              <div id="transfer-panel" className="animate-fade-up pb-2 text-sm">
                <dl className="divide-y divide-line rounded-lg border border-line">
                  <div className="px-4 py-3">
                    <dt className="text-xs text-muted">Titular</dt>
                    <dd className="mt-0.5 font-medium">{copy.transfer.holder}</dd>
                  </div>
                  {(
                    [
                      ["Alias", copy.transfer.alias],
                      ["CBU", copy.transfer.cbu],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-3 px-4 py-2.5">
                      <div>
                        <dt className="text-xs text-muted">{label}</dt>
                        <dd className="mt-0.5 font-mono font-medium break-all">{value}</dd>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyValue(label, value)}
                        className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-md border border-line px-3 text-[13px] font-medium transition-colors hover:border-ink"
                        aria-label={`Copiar ${label}`}
                      >
                        {copied === label ? <CheckIcon className="h-3.5 w-3.5 text-brand" /> : <CopyIcon className="h-3.5 w-3.5" />}
                        {copied === label ? copy.transfer.copied : copy.transfer.copy}
                      </button>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 leading-relaxed text-muted">
                  {copy.transfer.note}{" "}
                  <a href={org.whatsappLink} className="font-medium text-ink underline underline-offset-2">
                    Escribinos por WhatsApp
                  </a>
                  .
                </p>
                <span className="sr-only" aria-live="polite">
                  {copied && `${copied} copiado`}
                </span>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  input,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  input: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        {...input}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`min-h-12 w-full rounded-lg border bg-white px-4 text-base transition-shadow outline-none focus:border-forest focus:shadow-[0_0_0_3px_rgba(11,122,30,0.15)] ${
          error ? "border-danger" : "border-line-strong"
        }`}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] font-medium text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
