import Image from "next/image";
import { programs } from "@/content/site";

export default function Programs() {
  return (
    <section aria-labelledby="programas" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="max-w-2xl">
        <p className="eyebrow">{programs.eyebrow}</p>
        <h2 id="programas" className="mt-3 font-display text-3xl font-bold md:text-4xl">
          {programs.title}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted">{programs.intro}</p>
      </div>
      <ul className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-3">
        {programs.items.map((p, i) => (
          <li key={p.id}>
            <Image
              src={p.image}
              alt={p.imageAlt}
              width={900}
              height={675}
              sizes="(min-width: 768px) 33vw, 100vw"
              className="aspect-[4/3] w-full rounded-md object-cover"
            />
            <div className="mt-6 flex items-baseline gap-3 border-t border-line pt-5">
              <span className="tabular text-sm font-medium text-muted">0{i + 1}</span>
              <h3 className="font-display text-xl font-bold">{p.name}</h3>
            </div>
            <p className="mt-3 leading-relaxed text-muted">{p.description}</p>
            <p className="mt-4 text-[15px] leading-relaxed">
              <span className="font-semibold text-brand">Qué financia tu aporte. </span>
              {p.funds}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
