import { transparency } from "@/content/site";
import { ArrowUpRightIcon } from "./Icons";

/** Barra horizontal apilada en SVG con la distribución de fondos. */
export default function FundsChart() {
  const summary = transparency.items.map((i) => `${i.label} ${i.percent}%`).join(", ");
  const offsets = transparency.items.map((_, idx) => transparency.items.slice(0, idx).reduce((s, i) => s + i.percent, 0));

  return (
    <section aria-labelledby="transparencia" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:gap-16">
        <div>
          <p className="eyebrow">{transparency.eyebrow}</p>
          <h2 id="transparencia" className="mt-3 font-display text-3xl font-bold md:text-4xl">
            {transparency.title}
          </h2>
          <p className="mt-4 leading-relaxed text-muted">{transparency.intro}</p>
          <a
            href={transparency.reportUrl}
            className="group mt-6 inline-flex min-h-12 items-center gap-2 font-semibold text-ink underline decoration-accent decoration-2 underline-offset-[6px] hover:decoration-brand"
          >
            {transparency.reportLabel}
            <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
        <div className="md:pt-10">
          <svg viewBox="0 0 100 4" preserveAspectRatio="none" className="h-4 w-full" role="img" aria-label={summary}>
            {transparency.items.map((i, idx) => (
              <rect key={i.label} x={offsets[idx]} y={0} width={Math.max(i.percent - 0.4, 0)} height={4} fill={i.color} />
            ))}
          </svg>
          <table className="mt-8 w-full text-[15px]">
            <caption className="sr-only">Distribución de fondos</caption>
            <tbody>
              {transparency.items.map((i) => (
                <tr key={i.label} className="border-b border-line last:border-0">
                  <th scope="row" className="py-3.5 text-left font-normal">
                    <span className="mr-3 inline-block h-2.5 w-2.5 rounded-[2px] align-middle" style={{ background: i.color }} />
                    {i.label}
                  </th>
                  <td className="tabular py-3.5 text-right font-display text-lg font-semibold">{i.percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
