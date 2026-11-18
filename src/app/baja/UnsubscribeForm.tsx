"use client";

import { useState } from "react";
import { unsubscribe as copy } from "@/content/site";
import { track } from "@/lib/analytics";
import { EMAIL_RE } from "@/lib/donation";

export default function UnsubscribeForm() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [emailError, setEmailError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setEmailError("Revisá el e-mail: parece que falta algo.");
      document.getElementById("baja-email")?.focus();
      return;
    }
    setEmailError("");
    setState("sending");
    try {
      const res = await fetch("/api/baja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), reason }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      track("unsubscribe_request");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p role="status" className="border-l-2 border-brand bg-brand-50 py-4 pr-4 pl-5 font-medium text-brand-dark">
        {copy.optionForm.success}
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div>
        <label htmlFor="baja-email" className="mb-1.5 block text-sm font-medium">
          {copy.optionForm.email}
        </label>
        <input
          id="baja-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "baja-email-error" : undefined}
          className={`min-h-12 w-full rounded-lg border bg-white px-4 outline-none focus:border-forest ${emailError ? "border-danger" : "border-line-strong"}`}
        />
        {emailError && (
          <p id="baja-email-error" className="mt-1 text-sm font-medium text-danger">
            {emailError}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="baja-reason" className="mb-1.5 block text-sm font-medium">
          {copy.optionForm.reason}
        </label>
        <textarea
          id="baja-reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full rounded-lg border border-line-strong bg-white px-4 py-3 outline-none focus:border-forest"
        />
      </div>
      {state === "error" && (
        <p role="alert" className="text-sm font-medium text-danger">
          {copy.optionForm.error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="flex min-h-12 w-full items-center justify-center rounded-lg border border-ink px-4 font-semibold transition-colors hover:bg-ink hover:text-white disabled:opacity-60"
      >
        {state === "sending" ? "Enviando…" : copy.optionForm.submit}
      </button>
    </form>
  );
}
