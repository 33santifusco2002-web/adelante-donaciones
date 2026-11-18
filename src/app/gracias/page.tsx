import type { Metadata } from "next";
import Header from "@/components/Header";
import ThanksContent from "./ThanksContent";

export const metadata: Metadata = { title: "¡Gracias por tu aporte! | Adelante", robots: { index: false } };

export default function GraciasPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://adelante.org.ar";
  return (
    <>
      <Header />
      <main>
        <ThanksContent siteUrl={siteUrl} />
      </main>
    </>
  );
}
