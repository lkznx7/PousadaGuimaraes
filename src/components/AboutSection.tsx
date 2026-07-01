import Image from "next/image";
import { site } from "@/data/site";
import { SectionTitle } from "./SectionTitle";

export function AboutSection() {
  return (
    <section id="a-pousada" className="bg-linen py-20 sm:py-24">
      <div className="section-shell grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <SectionTitle
            eyebrow="A pousada"
            title="Um lugar para desacelerar e aproveitar"
            description="Na Pousada Guimarães, cada detalhe é pensado para proporcionar uma estadia confortável, tranquila e acolhedora. Um espaço ideal para descansar, recarregar as energias e criar boas lembranças."
          />
          <div className="mt-8 h-px w-28 bg-gold" />
        </div>

        <div className="relative min-h-[560px] sm:min-h-[620px]">
          <div className="absolute right-0 top-0 h-[72%] w-[72%] overflow-hidden rounded-[8px] shadow-soft">
            <Image
              src={site.aboutImages[0].src}
              alt={site.aboutImages[0].alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 42vw, 72vw"
            />
          </div>
          <div className="absolute bottom-0 left-0 h-[56%] w-[52%] overflow-hidden rounded-[8px] border-[10px] border-linen shadow-soft">
            <Image
              src={site.aboutImages[1].src}
              alt={site.aboutImages[1].alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 28vw, 52vw"
            />
          </div>
          <div className="absolute left-[44%] top-[78%] hidden h-16 w-16 -translate-y-1/2 rounded-full border border-gold/60 sm:block" />
        </div>
      </div>
    </section>
  );
}
