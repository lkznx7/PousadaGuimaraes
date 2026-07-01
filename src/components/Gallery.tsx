"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { galleryImages } from "@/data/site";
import { GalleryLightbox } from "./GalleryLightbox";
import { SectionTitle } from "./SectionTitle";

const galleryGroups = [
  {
    key: "externas",
    title: "Áreas externas",
    description: "Jardim, fachada e espaços abertos da pousada.",
  },
  {
    key: "acomodacoes",
    title: "Acomodações",
    description: "Quartos e ambientes preparados para o descanso.",
  },
  {
    key: "apoio",
    title: "Ambientes de apoio",
    description: "Espaços compartilhados e áreas de convivência.",
  },
  {
    key: "banheiros",
    title: "Banheiros",
    description: "Registros dos ambientes de banheiro disponíveis nas fotos.",
  },
] as const;

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const close = useCallback(() => setActiveIndex(null), []);
  const change = useCallback((index: number) => setActiveIndex(index), []);
  const openImage = (src: string) => {
    const index = galleryImages.findIndex((image) => image.src === src);
    if (index >= 0) setActiveIndex(index);
  };

  return (
    <section id="galeria" className="bg-white py-20 sm:py-24">
      <div className="section-shell">
        <SectionTitle
          align="center"
          eyebrow="Galeria"
          title="Conheça cada detalhe"
          description="Explore os ambientes da Pousada Guimarães e imagine como será a sua próxima estadia."
        />

        <div className="mt-12 space-y-12">
          {galleryGroups.map((group) => {
            const images = galleryImages.filter(
              (image) => image.category === group.key
            );
            const lead = images.find((image) => image.featured) ?? images[0];
            const secondary = images.filter((image) => image.src !== lead.src);

            return (
              <div key={group.key} className="border-t border-forest/10 pt-8">
                <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div>
                    <h3 className="text-2xl font-semibold text-forest">
                      {group.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-ink/62">
                      {group.description}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gold">
                    {images.length} fotos
                  </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
                  <button
                    aria-label={`Ampliar foto: ${lead.alt}`}
                    className="focus-ring group relative min-h-[340px] overflow-hidden rounded-[8px] bg-linen sm:min-h-[440px]"
                    type="button"
                    onClick={() => openImage(lead.src)}
                  >
                    <Image
                      src={lead.src}
                      alt={lead.alt}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 54vw, 100vw"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-forest/45 via-transparent to-transparent opacity-85" />
                    <span className="absolute bottom-4 left-4 right-4 text-left text-sm font-semibold text-white">
                      {lead.alt}
                    </span>
                  </button>

                  <div className="grid grid-cols-2 gap-4">
                    {secondary.map((image) => {
                      const isLandscape = image.width > image.height;
                      return (
                        <button
                          key={image.src}
                          aria-label={`Ampliar foto: ${image.alt}`}
                          className={`focus-ring group relative overflow-hidden rounded-[8px] bg-linen ${
                            isLandscape ? "aspect-[4/3]" : "aspect-[3/4]"
                          }`}
                          type="button"
                          onClick={() => openImage(image.src)}
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                            sizes="(min-width: 1024px) 22vw, 50vw"
                          />
                          <span className="absolute inset-0 bg-forest/0 transition group-hover:bg-forest/18" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <GalleryLightbox
        images={galleryImages}
        index={activeIndex}
        onClose={close}
        onChange={change}
      />
    </section>
  );
}
