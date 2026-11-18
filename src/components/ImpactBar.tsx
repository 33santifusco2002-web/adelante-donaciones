import { impactBar } from "@/content/site";

export default function ImpactBar() {
  return (
    <section aria-labelledby="impacto" className="bg-forest text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 id="impacto" className="sr-only">
          {impactBar.title}
        </h2>
        <dl className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:divide-x md:divide-white/15">
          {impactBar.items.map((item, i) => (
            <div key={item.label} className={`flex flex-col-reverse md:px-8 ${i === 0 ? "md:pl-0" : ""} ${i % 2 ? "border-l border-white/15 pl-6 md:border-l-0" : ""}`}>
              <dt className="mt-2 text-sm leading-snug text-white/70">{item.label}</dt>
              <dd className="tabular font-display text-5xl font-semibold tracking-tight md:text-6xl">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
