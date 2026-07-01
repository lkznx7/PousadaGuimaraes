import { Mail, Map, MapPin, Phone, Clock, Instagram } from "lucide-react";
import { site } from "@/data/site";
import { SectionTitle } from "./SectionTitle";

const contactItems = [
  { label: "WhatsApp", value: site.contact.whatsapp, icon: Phone },
  { label: "Telefone", value: site.contact.phone, icon: Phone },
  { label: "E-mail", value: site.contact.email, icon: Mail },
  { label: "Endereço", value: site.contact.address, icon: MapPin },
  { label: "Atendimento", value: site.contact.hours, icon: Clock },
  { label: "Instagram", value: site.contact.instagram, icon: Instagram },
  { label: "Mapa", value: site.contact.mapUrl, icon: Map },
].filter((item) => item.value);

export function ContactSection() {
  return (
    <section id="contato" className="bg-linen py-20 sm:py-24">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionTitle
          eyebrow="Contato"
          title="Fale com a Pousada Guimarães"
          description="A estrutura está pronta para exibir os canais oficiais assim que forem definidos."
        />

        <div className="rounded-[8px] border border-forest/10 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex min-h-[100px] items-center justify-center rounded-[8px] border border-dashed border-gold/60 bg-linen/55 p-6 text-center">
            <p className="max-w-md text-sm leading-7 text-ink/68">
              Em breve, todos os nossos canais de atendimento estarão
              disponíveis por aqui.
            </p>
          </div>

          {contactItems.length > 0 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {contactItems.map((item) => {
                const Icon = item.icon;
                const isEmail = item.label === "E-mail";
                return (
                  <div key={item.label} className="flex gap-3">
                    <Icon className="mt-1 shrink-0 text-gold" size={20} />
                    <div>
                      <p className="text-sm font-semibold text-forest">
                        {isEmail ? "E-mail para contato" : item.label}
                      </p>
                      {isEmail ? (
                        <a
                          href={`mailto:${item.value}`}
                          className="mt-1 block text-sm leading-6 text-ink/68 transition hover:text-gold"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm leading-6 text-ink/68">{item.value}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
