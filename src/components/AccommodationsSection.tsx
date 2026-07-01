import Image from "next/image";
import { site } from "@/data/site";
import { SectionTitle } from "./SectionTitle";

export function AccommodationsSection() {
  return (
    <section id="acomodacoes" className="bg-linen py-20 sm:py-24">
      <div className="section-shell">
        <SectionTitle
          eyebrow="Acomodações"
          title="Acomodações feitas para o seu descanso"
          description="Ambientes organizados, confortáveis e preparados para tornar cada momento da sua estadia ainda mais agradável."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {site.accommodations.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-[8px] bg-white shadow-soft">
              <div className="relative aspect-[4/5]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-forest">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink/68">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
