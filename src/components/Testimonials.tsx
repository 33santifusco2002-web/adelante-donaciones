import Image from "next/image";
import { testimonials } from "@/content/site";

export default function Testimonials() {
  return (
    <section aria-labelledby="testimonios" className="border-y border-line bg-sand">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">{testimonials.eyebrow}</p>
            <h2 id="testimonios" className="mt-3 font-display text-3xl font-bold md:text-4xl">
              {testimonials.title}
            </h2>
          </div>
          <span className="text-xs tracking-wide text-muted uppercase">{testimonials.note}</span>
        </div>
        <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {testimonials.items.map((t) => (
            <li key={t.name}>
              <figure className="flex h-full flex-col border-t-2 border-ink pt-6">
                <blockquote className="flex-1 font-display text-xl leading-snug font-semibold tracking-tight text-pretty">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <Image src={t.image} alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
                  <span className="text-sm">
                    <span className="block font-semibold">{t.name}</span>
                    <span className="block text-muted">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
