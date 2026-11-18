"use client";

import { useEffect, useState } from "react";
import { sticky } from "@/content/site";
import { ArrowRightIcon } from "./Icons";

/** Botón fijo en mobile; se oculta cuando el bloque de donación está en pantalla. */
export default function StickyDonateButton({ targetId }: { targetId: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [targetId]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <a
        href={`#${targetId}`}
        tabIndex={visible ? 0 : -1}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        className="flex min-h-13 w-full items-center justify-center gap-2 rounded-lg bg-accent py-3.5 text-[17px] font-semibold text-ink shadow-[inset_0_-2px_0_rgba(0,0,0,0.08)] active:bg-accent-dark"
      >
        {sticky.label}
        <ArrowRightIcon />
      </a>
    </div>
  );
}
