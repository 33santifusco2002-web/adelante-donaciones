import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { seo } from "@/content/site";
import Analytics from "@/components/Analytics";
import DemoBanner from "@/components/DemoBanner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-montserrat", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: seo.title,
  description: seo.description,
  openGraph: {
    title: seo.title,
    description: seo.description,
    type: "website",
    locale: "es_AR",
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: seo.title }],
  },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: [seo.ogImage] },
  icons: { icon: "/logo.png" },
};

export const viewport: Viewport = { themeColor: "#FAF7F1", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased">
        <DemoBanner />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
