import Image from "next/image";
import { ArrowDown, Images } from "lucide-react";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[84svh] items-center overflow-hidden bg-forest pt-20 text-white"
    >
      <Image
        priority
        src={site.heroImage.src}
        alt={site.heroImage.alt}
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-forest/90 via-forest/62 to-ink/24" />
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-ink/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink/45 to-transparent" />

      <div className="section-shell relative z-10 py-20">
        <div className="max-w-3xl">
          <p className="eyebrow text-linen">Bem-vindo à Pousada Guimarães</p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            {site.slogan}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/86 sm:text-lg">
            {site.intro}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-white bg-white px-6 py-3 text-sm font-semibold text-forest transition hover:border-gold hover:bg-linen active:scale-[0.98]" href="#a-pousada">
              Conhecer a pousada
            </a>
            <a className="btn-secondary" href="#galeria">
              <Images size={18} />
              Ver galeria
            </a>
          </div>
        </div>
      </div>

      <a
        aria-label="Rolar para a apresentação da pousada"
        className="focus-ring absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:border-gold hover:text-white sm:flex"
        href="#a-pousada"
      >
        <ArrowDown size={15} />
        rolar
      </a>
    </section>
  );
}
