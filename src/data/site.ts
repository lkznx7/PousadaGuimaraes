import {
  BedDouble,
  HeartHandshake,
  Leaf,
  MapPin,
  Sparkles,
} from "lucide-react";

export type NavLink = {
  label: string;
  href: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  category: "externas" | "acomodacoes" | "apoio" | "banheiros";
  featured?: boolean;
};

export type ContactConfig = {
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  hours: string | null;
  instagram: string | null;
  mapUrl: string | null;
  reservationUrl: string | null;
};

export const site = {
  name: "Pousada Guimarães",
  monogram: "PG",
  slogan: "Conforto, acolhimento e tranquilidade em um só lugar.",
  intro:
    "Um ambiente pensado para quem deseja descansar, aproveitar bons momentos e se sentir verdadeiramente acolhido.",
  seo: {
    title: "Pousada Guimarães | Conforto, acolhimento e tranquilidade",
    description:
      "Conheça a Pousada Guimarães, um ambiente acolhedor e tranquilo, pensado para proporcionar conforto e momentos inesquecíveis.",
    keywords: [
      "pousada",
      "hospedagem",
      "hotel",
      "turismo",
      "descanso",
      "acolhimento",
      "tranquilidade",
      "conforto",
      "reserva",
      "diária",
      "apartamento",
      "hóspedes",
    ],
    siteUrl: "https://pousadaguimaraes.com.br",
  },
  nav: [
    { label: "Início", href: "#inicio" },
    { label: "A pousada", href: "#a-pousada" },
    { label: "Acomodações", href: "#acomodacoes" },
    { label: "Galeria", href: "#galeria" },
    { label: "Contato", href: "#contato" },
  ] satisfies NavLink[],
  contact: {
    whatsapp: null,
    phone: null,
    email: "Contatopousadaguimaraesmuriqui@gmail.com",
    address: null,
    hours: null,
    instagram: null,
    mapUrl: null,
    reservationUrl: null,
  } satisfies ContactConfig,
  skyCode: {
    label: "Desenvolvido pela SkyCode",
    url: null as string | null,
  },
  heroImage: {
    src: "/images/pousada/2332afec-abd7-4421-86ce-e9b199780386.jpg",
    alt: "Área externa ajardinada da Pousada Guimarães",
    width: 960,
    height: 1280,
  },
  aboutImages: [
    {
      src: "/images/pousada/a3c424e0-6d30-4a14-a2b1-b234d7c0c539.jpg",
      alt: "Jardim com fonte e fachada da Pousada Guimarães",
      width: 960,
      height: 1280,
    },
    {
      src: "/images/pousada/217622cb-e3c9-497c-8948-a1e18b0b247c.jpg",
      alt: "Acomodação organizada da Pousada Guimarães",
      width: 960,
      height: 1280,
    },
  ],
  highlights: [
    {
      title: "Acomodações confortáveis",
      description:
        "Espaços preparados para oferecer descanso, comodidade e bem-estar durante toda a estadia.",
      icon: BedDouble,
    },
    {
      title: "Localização privilegiada",
      description:
        "Mais praticidade para aproveitar a região e acessar os principais pontos ao redor.",
      icon: MapPin,
    },
    {
      title: "Atendimento personalizado",
      description:
        "Uma experiência mais próxima, cuidadosa e atenta às necessidades de cada hóspede.",
      icon: HeartHandshake,
    },
    {
      title: "Ambiente tranquilo",
      description:
        "O cenário ideal para desacelerar, descansar e aproveitar momentos de paz.",
      icon: Leaf,
    },
    {
      title: "Experiências inesquecíveis",
      description:
        "Uma estadia marcada por conforto, acolhimento e boas lembranças.",
      icon: Sparkles,
    },
  ],
  accommodations: [
    {
      title: "Conforto em cada detalhe",
      description:
        "Ambientes cuidados para receber com simplicidade, organização e uma atmosfera acolhedora.",
      image: "/images/pousada/217622cb-e3c9-497c-8948-a1e18b0b247c.jpg",
      alt: "Quarto com cama arrumada na Pousada Guimarães",
    },
    {
      title: "Ambientes acolhedores",
      description:
        "Espaços pensados para que cada hóspede tenha uma estadia mais leve e agradável.",
      image: "/images/pousada/2f834116-aeb2-4712-97b4-ec97c79e361f.jpg",
      alt: "Acomodação com decoração acolhedora na Pousada Guimarães",
    },
    {
      title: "Tranquilidade para descansar",
      description:
        "Uma proposta visualmente serena, pronta para ser atualizada com dados reais das acomodações.",
      image: "/images/pousada/f8c02bd8-f2da-4233-bce9-73f2c62a34a5.jpg",
      alt: "Acomodação clara e organizada da Pousada Guimarães",
    },
  ],
};

type GalleryImageSeed = [
  file: string,
  alt: string,
  width: number,
  height: number,
  category: GalleryImage["category"],
  featured?: boolean,
];

const galleryImageSeeds: GalleryImageSeed[] = [
  ["2332afec-abd7-4421-86ce-e9b199780386.jpg", "Área externa ajardinada da Pousada Guimarães", 960, 1280, "externas", true],
  ["a3c424e0-6d30-4a14-a2b1-b234d7c0c539.jpg", "Jardim com fonte e fachada da Pousada Guimarães", 960, 1280, "externas", true],
  ["274c297b-baa7-496a-ac84-cd57eebcf29f.jpg", "Jardim com fonte decorativa na Pousada Guimarães", 1032, 1280, "externas"],
  ["5f959714-821e-4683-ad44-c21522bcf48a.jpg", "Fachada interna e jardim da Pousada Guimarães", 960, 1280, "externas"],
  ["86b1c29f-6407-4192-91bd-b1d8b318e638.jpg", "Caminho externo com jardim na Pousada Guimarães", 960, 1280, "externas"],
  ["90c0c3bd-cd8d-45dd-afdd-9fcc4e6dcea2.jpg", "Jardim com escultura na Pousada Guimarães", 960, 1280, "externas"],
  ["a20dda0d-0a39-45a5-87b6-f6860f28d337.jpg", "Fonte decorativa no jardim da Pousada Guimarães", 960, 1280, "externas"],
  ["949f6dec-6653-40b9-b313-2a43331acc4b.jpg", "Corredor externo da Pousada Guimarães", 960, 1280, "externas"],
  ["eab774cd-6025-4b7d-a07b-0a993800d61a.jpg", "Área externa iluminada da Pousada Guimarães", 1600, 900, "externas", true],
  ["217622cb-e3c9-497c-8948-a1e18b0b247c.jpg", "Quarto organizado da Pousada Guimarães", 960, 1280, "acomodacoes", true],
  ["2f834116-aeb2-4712-97b4-ec97c79e361f.jpg", "Quarto com decoração da Pousada Guimarães", 896, 1600, "acomodacoes"],
  ["59b01983-7f6b-4c8d-80d0-3392c2fc015d.jpg", "Acomodação com duas camas na Pousada Guimarães", 1204, 1600, "acomodacoes"],
  ["6c2093a9-5856-4aad-b76e-9a20aa3ca011.jpg", "Cama arrumada na Pousada Guimarães", 960, 1280, "acomodacoes"],
  ["9066e00c-1a4c-4cbd-a388-2c64132f635f.jpg", "Acomodação com beliche na Pousada Guimarães", 1200, 1600, "acomodacoes"],
  ["aecfe070-6e5f-4c3f-9651-c8fc06c197a4.jpg", "Cama com decoração na Pousada Guimarães", 960, 1280, "acomodacoes"],
  ["b8ffdd27-b49b-451a-a067-fbfe5219750d.jpg", "Ambiente interno da Pousada Guimarães", 960, 1280, "acomodacoes"],
  ["c0793446-5589-432e-8db0-443438d4844e.jpg", "Quarto com beliche na Pousada Guimarães", 896, 1600, "acomodacoes"],
  ["f8c02bd8-f2da-4233-bce9-73f2c62a34a5.jpg", "Acomodação clara da Pousada Guimarães", 1200, 1600, "acomodacoes"],
  ["11202583-122d-4cd7-a5a1-81602635f79e.jpg", "Mesa preparada com frutas e alimentos na Pousada Guimarães", 716, 1280, "apoio"],
  ["5dd835fc-453d-4af3-9a29-f7ae82cb3029.jpg", "Cozinha de apoio da Pousada Guimarães", 1200, 1600, "apoio"],
  ["b64aa225-810d-4fb8-bf0d-d8de701eb393.jpg", "Área coberta da Pousada Guimarães", 1600, 1200, "apoio", true],
  ["f058cbf9-00a0-4d11-8468-5d7c8d6c8551.jpg", "Área de cozinha da Pousada Guimarães", 960, 1280, "apoio"],
  ["11a6bcec-e635-4f85-8656-a536019eb530.jpg", "Banheiro da Pousada Guimarães", 1200, 1600, "banheiros"],
  ["29285df1-190f-4d3d-a08e-e17da5032ae6.jpg", "Banheiro claro da Pousada Guimarães", 1200, 1600, "banheiros"],
  ["aa966c81-0256-493c-b86a-dc589db21ca1.jpg", "Banheiro da Pousada Guimarães", 960, 1280, "banheiros"],
  ["cfe9575d-7348-49ec-8859-bdd41ed8c243.jpg", "Banheiro com box na Pousada Guimarães", 1200, 1600, "banheiros"],
];

export const galleryImages: GalleryImage[] = galleryImageSeeds.map(
  ([file, alt, width, height, category, featured]) => ({
    src: `/images/pousada/${file}`,
    alt,
    width,
    height,
    category,
    featured: Boolean(featured),
  })
);
