import type { Metadata } from "next";
import Header from "@/components/Header";
import { unsubscribe as copy } from "@/content/site";
import UnsubscribeForm from "./UnsubscribeForm";
import { ArrowUpRightIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "Gestionar o dar de baja mi aporte | Adelante" };

export default function BajaPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-20">
        <p className="eyebrow">Tu aporte mensual</p>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{copy.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{copy.intro}</p>

        <section aria-labelledby="baja-mp" className="mt-8 rounded-lg border border-line bg-white p-6">
          <h2 id="baja-mp" className="font-display text-xl font-bold">
            1. {copy.optionMp.title}
          </h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-[15px]">
            {copy.optionMp.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <a
            href={copy.optionMp.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-4 font-semibold text-ink hover:bg-accent-dark"
          >
            {copy.optionMp.linkLabel}
            <ArrowUpRightIcon />
          </a>
        </section>

        <section aria-labelledby="baja-form" className="mt-6 rounded-lg border border-line bg-white p-6">
          <h2 id="baja-form" className="font-display text-xl font-bold">
            2. {copy.optionForm.title}
          </h2>
          <p className="mt-2 mb-5 text-[15px] text-muted">{copy.optionForm.body}</p>
          <UnsubscribeForm />
        </section>
      </main>
    </>
  );
}
