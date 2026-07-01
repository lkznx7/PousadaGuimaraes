'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, User, Shield } from 'lucide-react';
import { site } from '@/data/site';
import { ReservationButton } from './ReservationButton';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("modal-open", open);
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  const publicNav = site.nav;
  const clientNav = [
    { label: "Início", href: "/" },
    { label: "Acomodações", href: "#acomodacoes" },
    { label: "Apartamentos", href: "/apartamentos" },
    { label: "Minhas Reservas", href: "/minha-conta/reservas" },
    { label: "Contato", href: "#contato" },
  ];
  const adminNav = [
    { label: "Dashboard", href: "/admin" },
    { label: "Apartamentos", href: "/admin/apartamentos" },
    { label: "Reservas", href: "/admin/reservas" },
    { label: "Usuários", href: "/admin/usuarios" },
  ];

  const nav = !loading && user?.role === 'ADMIN' ? adminNav : !loading && user ? clientNav : publicNav;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition ${
        scrolled || open
          ? "bg-forest/95 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div className="section-shell flex h-20 items-center justify-between gap-6">
        <a className="focus-ring flex items-center gap-3" href="#inicio" aria-label="Ir para o início">
          <span className="flex size-11 items-center justify-center rounded-full border border-gold/80 font-display text-lg font-semibold text-linen">
            {site.monogram}
          </span>
          <span className="leading-tight text-white">
            <span className="block font-display text-lg font-semibold">
              {site.name}
            </span>
            <span className="block text-[11px] uppercase tracking-[0.22em] text-linen/80">
              descanso e acolhimento
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Menu principal">
          {nav.map((link) => (
            <a
              key={link.href}
              className="focus-ring text-sm font-medium text-white/85 transition hover:text-gold"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {!loading && user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="focus-ring flex items-center gap-1 text-sm font-medium text-white/85 transition hover:text-gold">
                  <Shield size={14} />
                  Admin
                </Link>
              )}
              <Link href="/minha-conta" className="focus-ring flex items-center gap-1 text-sm font-medium text-white/85 transition hover:text-gold">
                <User size={14} />
                {user.nome}
              </Link>
              <button onClick={logout} className="focus-ring flex items-center gap-1 text-sm text-white/85 transition hover:text-gold">
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="focus-ring text-sm font-medium text-white/85 transition hover:text-gold">
                Entrar
              </Link>
              <ReservationButton className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-forest transition hover:bg-linen active:scale-[0.98]" />
            </>
          )}
        </div>

        <button
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="focus-ring flex size-11 items-center justify-center rounded-full border border-white/25 text-white lg:hidden"
          type="button"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-forest px-5 pb-7 pt-3 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2" aria-label="Menu mobile">
            {nav.map((link) => (
              <a
                key={link.href}
                className="focus-ring rounded-[8px] px-3 py-3 text-base font-medium text-white/90 hover:bg-white/10"
                href={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {!loading && user ? (
              <button onClick={() => { logout(); setOpen(false); }} className="focus-ring mt-2 rounded-[8px] px-3 py-3 text-left text-base font-medium text-white/90 hover:bg-white/10">
                Sair
              </button>
            ) : (
              <>
                <a href="/login" className="focus-ring rounded-[8px] px-3 py-3 text-base font-medium text-white/90 hover:bg-white/10" onClick={() => setOpen(false)}>
                  Entrar
                </a>
                <ReservationButton className="focus-ring mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-forest transition hover:bg-linen active:scale-[0.98]" />
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
