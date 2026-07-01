"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

type ReservationModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ReservationModal({ open, onClose }: ReservationModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("modal-open");
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      aria-labelledby="reservation-title"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/70 px-5 backdrop-blur-sm"
      role="dialog"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-[8px] bg-white p-7 text-center shadow-soft">
        <button
          ref={closeButtonRef}
          aria-label="Fechar aviso de reserva"
          className="focus-ring ml-auto flex size-10 items-center justify-center rounded-full border border-forest/10 text-forest transition hover:border-gold hover:text-ink"
          type="button"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <p className="eyebrow mt-2">Reservas</p>
        <h2
          id="reservation-title"
          className="mt-3 text-2xl font-semibold text-forest"
        >
          Os canais de reserva serão disponibilizados em breve.
        </h2>
        <p className="mt-4 text-sm leading-7 text-ink/65">
          A estrutura já está preparada para receber WhatsApp, telefone, e-mail
          ou link de reserva quando a cliente enviar os dados oficiais.
        </p>
        <button className="btn-primary mt-6 w-full" type="button" onClick={onClose}>
          Entendi
        </button>
      </div>
    </div>
  );
}
