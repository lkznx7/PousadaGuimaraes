import { AboutSection } from "@/components/AboutSection";
import { AccommodationsSection } from "@/components/AccommodationsSection";
import { ContactSection } from "@/components/ContactSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HighlightsSection } from "@/components/HighlightsSection";
import { StructuredData } from "@/components/StructuredData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pousada Guimarães | Conforto, acolhimento e tranquilidade",
  description:
    "Conheça a Pousada Guimarães, um ambiente acolhedor e tranquilo em meio à natureza. Acomodações confortáveis, atendimento personalizado e uma experiência inesquecível.",
  openGraph: {
    title: "Pousada Guimarães | Conforto, acolhimento e tranquilidade",
    description:
      "Conheça a Pousada Guimarães, um ambiente acolhedor e tranquilo em meio à natureza. Acomodações confortáveis e atendimento personalizado.",
    url: "/",
  },
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <StructuredData />
      <Header />
      <main>
        <Hero />
        <AboutSection />
        <HighlightsSection />
        <AccommodationsSection />
        <Gallery />
        <FinalCTA />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
