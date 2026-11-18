import Link from "next/link";
import Header from "./Header";
import { org } from "@/content/site";

/** Página simple para los retornos de Mercado Pago (pendiente / fallido). */
export default function StatusPage({
  icon,
  eyebrow,
  title,
  body,
  cta,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  cta?: { label: string; href: string };
}) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white text-brand">{icon}</div>
        <p className="eyebrow mt-8">{eyebrow}</p>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{body}</p>
        {cta && (
          <Link
            href={cta.href}
            className="mt-8 flex min-h-14 items-center justify-center rounded-lg bg-accent px-5 text-[17px] font-semibold text-ink shadow-[inset_0_-2px_0_rgba(0,0,0,0.08)] hover:bg-accent-dark"
          >
            {cta.label}
          </Link>
        )}
        <p className="mt-8 border-t border-line pt-6 text-sm text-muted">
          ¿Dudas? Escribinos por{" "}
          <a href={org.whatsappLink} className="font-medium text-ink underline underline-offset-2">
            WhatsApp
          </a>
          .
        </p>
      </main>
    </>
  );
}
