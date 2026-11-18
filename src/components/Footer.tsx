import Link from "next/link";
import { footer, org } from "@/content/site";

export default function Footer() {
  const link = "transition-colors hover:text-white";
  return (
    <footer className="bg-forest pb-28 text-sm text-white/65 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-xl font-bold text-white">{org.legalName}</p>
            <p className="mt-3 max-w-xs leading-relaxed">{org.tagline}</p>
          </div>
          <div>
            <p className="eyebrow !text-white/60">Contacto</p>
            <address className="mt-4 space-y-2 not-italic">
              <p>{org.address}</p>
              <p>
                <a className={link} href={org.whatsappLink}>
                  WhatsApp {org.whatsapp}
                </a>
              </p>
              <p>
                <a className={link} href={org.instagramLink}>
                  Instagram {org.instagram}
                </a>
              </p>
            </address>
          </div>
          <div>
            <p className="eyebrow !text-white/60">Información</p>
            <ul className="mt-2">
              {footer.links.map((l) => (
                <li key={l.label}>
                  <Link className={`inline-flex min-h-10 items-center ${link}`} href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap gap-x-6 gap-y-1 border-t border-white/10 pt-6 text-xs text-white/60">
          <span>CUIT {org.cuit}</span>
          <span>Personería jurídica {org.personeria}</span>
        </div>
      </div>
    </footer>
  );
}
