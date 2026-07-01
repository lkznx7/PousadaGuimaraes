import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apartamentos | Pousada Guimarães",
  description:
    "Conheça nossos apartamentos na Pousada Guimarães. Acomodações confortáveis com Wi-Fi, ar-condicionado e todas as comodidades para uma estadia tranquila.",
  openGraph: {
    title: "Apartamentos | Pousada Guimarães",
    description:
      "Conheça nossos apartamentos na Pousada Guimarães. Acomodações confortáveis para sua estadia.",
    url: "/apartamentos",
  },
  alternates: {
    canonical: "/apartamentos",
  },
};

export default function ApartamentosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
