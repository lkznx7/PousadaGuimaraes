import { site } from "@/data/site";
import { SectionTitle } from "./SectionTitle";

export function HighlightsSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="section-shell">
        <SectionTitle
          align="center"
          eyebrow="Diferenciais"
          title="Tudo o que você precisa para uma estadia especial"
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {site.highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-[8px] border border-forest/10 bg-linen/55 p-5 transition hover:border-gold/80 hover:bg-linen"
              >
                <Icon className="text-gold" size={26} strokeWidth={1.8} />
                <h3 className="mt-5 text-xl font-semibold text-forest">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-ink/68">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
