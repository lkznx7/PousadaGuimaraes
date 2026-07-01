import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pousadaguimaraes.com.br";

  return {
    title: "Apartamento | Pousada Guimarães",
    description:
      "Veja os detalhes deste apartamento na Pousada Guimarães. Fotos, comodidades, preço e disponibilidade para sua reserva.",
    openGraph: {
      title: "Apartamento | Pousada Guimarães",
      description:
        "Veja os detalhes deste apartamento na Pousada Guimarães. Fotos, comodidades e disponibilidade.",
      url: `/apartamentos/${id}`,
    },
    alternates: {
      canonical: `/apartamentos/${id}`,
    },
  };
}

export default function ApartamentoDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
