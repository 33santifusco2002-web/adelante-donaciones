import Image from "next/image";
import Link from "next/link";
import { header, org } from "@/content/site";

export default function Header() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <Link href="/" aria-label={`${org.name} – inicio`} className="shrink-0">
          {/* Reemplazar /public/logo.png por el logo real */}
          <Image src="/logo.png" alt={org.name} width={325} height={52} priority className="h-[22px] w-auto sm:h-6" />
        </Link>
        <Link
          href="/baja"
          className="py-3 text-right text-[13px] leading-tight text-muted decoration-line underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          {header.manageLink}
        </Link>
      </div>
    </header>
  );
}
