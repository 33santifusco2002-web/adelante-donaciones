import { demoBanner } from "@/content/site";

export default function DemoBanner() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") return null;
  return (
    <div className="bg-forest px-4 py-1.5 text-center text-[11px] font-medium tracking-[0.12em] text-white/80 uppercase" role="note">
      {demoBanner}
    </div>
  );
}
