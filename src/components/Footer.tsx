import { site } from "@/data/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest text-white">
      <div className="section-shell grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full border border-gold/80 font-display text-lg font-semibold text-linen">
              {site.monogram}
            </span>
            <span>
              <span className="block font-display text-xl font-semibold">
                {site.name}
              </span>
              <span className="block text-sm text-linen/75">{site.slogan}</span>
            </span>
          </div>
          <p className="mt-6 text-sm text-white/62">
            © {currentYear} {site.name}. Todos os direitos reservados.
          </p>
          <p className="mt-2 text-sm text-white/62">
            {site.skyCode.url ? (
              <a
                className="focus-ring underline decoration-gold/60 underline-offset-4 hover:text-gold"
                href={site.skyCode.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {site.skyCode.label}
              </a>
            ) : (
              site.skyCode.label
            )}
          </p>
        </div>

        <nav className="md:justify-self-end" aria-label="Links rápidos do rodapé">
          <h2 className="font-display text-lg font-semibold text-linen">
            Links rápidos
          </h2>
          <div className="mt-4 grid gap-2">
            {site.nav.map((link) => (
              <a
                key={link.href}
                className="focus-ring text-sm text-white/70 transition hover:text-gold"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </footer>
  );
}
