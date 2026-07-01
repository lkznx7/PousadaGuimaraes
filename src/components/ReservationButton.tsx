"use client";

import { CalendarCheck } from "lucide-react";
import Link from "next/link";
import { site } from "@/data/site";

type ReservationButtonProps = {
  className?: string;
  children?: React.ReactNode;
};

export function ReservationButton({
  className = "btn-primary",
  children = "Consultar disponibilidade",
}: ReservationButtonProps) {
  if (site.contact.reservationUrl) {
    return (
      <a className={className} href={site.contact.reservationUrl}>
        <CalendarCheck size={18} />
        {children}
      </a>
    );
  }

  return (
    <Link className={className} href="/reservar">
      <CalendarCheck size={18} />
      {children}
    </Link>
  );
}
