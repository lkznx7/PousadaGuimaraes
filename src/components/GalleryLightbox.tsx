"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/data/site";

type GalleryLightboxProps = {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
};

export function GalleryLightbox({
  images,
  index,
  onClose,
  onChange,
}: GalleryLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const open = index !== null;
  const image = open ? images[index] : null;

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("modal-open");
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && index !== null) {
        onChange((index + 1) % images.length);
      }
      if (event.key === "ArrowLeft" && index !== null) {
        onChange((index - 1 + images.length) % images.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [images.length, index, onChange, onClose, open]);

  useEffect(() => {
    setZoomed(false);
  }, [index]);

  if (!open || !image || index === null) return null;

  const previous = () => onChange((index - 1 + images.length) % images.length);
  const next = () => onChange((index + 1) % images.length);

  return (
    <div
      aria-label="Galeria de fotos ampliada"
      aria-modal="true"
      className="fixed inset-0 z-[90] bg-ink/90 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex h-full flex-col">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 text-white">
          <p className="text-sm font-medium text-white/80">
            {index + 1} de {images.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              aria-label={zoomed ? "Reduzir imagem" : "Ampliar imagem"}
              className="focus-ring flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white hover:text-forest"
              type="button"
              onClick={() => setZoomed((value) => !value)}
            >
              <Maximize2 size={19} />
            </button>
            <button
              ref={closeButtonRef}
              aria-label="Fechar galeria"
              className="focus-ring flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white hover:text-forest"
              type="button"
              onClick={onClose}
            >
              <X size={21} />
            </button>
          </div>
        </div>

        <div className="relative mx-auto mt-4 flex min-h-0 w-full max-w-6xl flex-1 items-center justify-center">
          <button
            aria-label="Imagem anterior"
            className="focus-ring absolute left-0 z-10 flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white hover:text-forest sm:-left-2"
            type="button"
            onClick={previous}
          >
            <ChevronLeft size={24} />
          </button>
          <div className="relative h-full w-full overflow-auto px-12">
            <div
              className={`relative mx-auto h-full ${
                zoomed ? "min-h-[130%] w-[130%]" : "w-full"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>
          <button
            aria-label="Próxima imagem"
            className="focus-ring absolute right-0 z-10 flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white hover:text-forest sm:-right-2"
            type="button"
            onClick={next}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <p className="mx-auto mt-4 max-w-4xl text-center text-sm text-white/76">
          {image.alt}
        </p>
      </div>
    </div>
  );
}
