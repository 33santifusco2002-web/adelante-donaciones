import type { Metadata } from "next";
import StatusPage from "@/components/StatusPage";
import { AlertIcon } from "@/components/Icons";
import { failed } from "@/content/site";

export const metadata: Metadata = { title: "No se pudo completar el pago | Adelante", robots: { index: false } };

export default async function PagoFallidoPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { f, monto } = await searchParams;
  // Vuelve al formulario con la frecuencia y el monto preseleccionados (el resto se recupera del borrador)
  const params = new URLSearchParams();
  if (f === "mensual" || f === "unica") params.set("frecuencia", f);
  if (monto && /^\d+$/.test(monto)) params.set("monto", monto);
  const href = `/${params.size ? `?${params}` : ""}#donar`;
  return (
    <StatusPage icon={<AlertIcon />} eyebrow="No se realizó ningún cobro" title={failed.title} body={failed.body} cta={{ label: failed.retry, href }} />
  );
}
