import { faq } from "@/content/site";
import { PlusIcon } from "./Icons";

export default function Faq() {
  return (
    <section aria-labelledby="faq" className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-[1fr_1.6fr] md:gap-16">
        <div>
          <p className="eyebrow">{faq.eyebrow}</p>
          <h2 id="faq" className="mt-3 font-display text-3xl font-bold md:text-4xl">
            {faq.title}
          </h2>
        </div>
        <div className="border-t border-ink">
          {faq.items.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-5 text-[17px] font-semibold transition-colors hover:text-brand">
                {item.q}
                <PlusIcon className="h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <p className="max-w-prose pb-6 leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
