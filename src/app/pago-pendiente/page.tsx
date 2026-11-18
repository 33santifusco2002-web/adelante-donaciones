import type { Metadata } from "next";
import StatusPage from "@/components/StatusPage";
import { ClockIcon } from "@/components/Icons";
import { pending } from "@/content/site";

export const metadata: Metadata = { title: "Pago pendiente | Adelante", robots: { index: false } };

export default function PagoPendientePage() {
  return (
    <StatusPage
      icon={<ClockIcon />}
      eyebrow="Pago en proceso"
      title={pending.title}
      body={pending.body}
      cta={{ label: "Volver al inicio", href: "/" }}
    />
  );
}
