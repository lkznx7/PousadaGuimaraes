import Image from "next/image";
import { Images } from "lucide-react";
import { site } from "@/data/site";
import { ReservationButton } from "./ReservationButton";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-forest py-20 text-white sm:py-24">
      <Image
        src="/images/pousada/b64aa225-810d-4fb8-bf0d-d8de701eb393.jpg"
        alt="Área coberta da Pousada Guimarães"
        fill
        className="object-cover opacity-35"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-forest/78" />
      <div className="section-shell relative z-10 text-center">
        <p className="eyebrow text-linen">Reserve seu descanso</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold sm:text-4xl lg:text-5xl">
          Seu próximo momento de descanso começa aqui
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
          Conheça a {site.name} e prepare-se para viver dias de conforto,
          tranquilidade e acolhimento.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ReservationButton className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-forest transition hover:bg-linen active:scale-[0.98]" />
          <a className="btn-secondary" href="#galeria">
            <Images size={18} />
            Ver fotos
          </a>
        </div>
      </div>
    </section>
  );
}
