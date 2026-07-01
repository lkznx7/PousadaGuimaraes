'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { site } from '@/data/site';
import { CalendarCheck, LogOut, Menu, X } from 'lucide-react';

const clientNav = [
  { label: 'Início', href: '/' },
  { label: 'Apartamentos', href: '/apartamentos' },
  { label: 'Minhas Reservas', href: '/minha-conta/reservas' },
  { label: 'Nova Reserva', href: '/reservar' },
  { label: 'Meu Perfil', href: '/minha-conta' },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user?.role === 'ADMIN') {
      router.push('/admin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    document.title = `Minha Conta | ${site.name}`;
    const meta = document.querySelector('meta[name="robots"]');
    if (meta) {
      meta.setAttribute("content", "noindex, nofollow");
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "robots";
      newMeta.content = "noindex, nofollow";
      document.head.appendChild(newMeta);
    }
  }, []);

  if (loading || !user || user.role === 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f3ea]">
        <p className="text-sm text-ink/68">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f3ea]">
      <header className="fixed inset-x-0 top-0 z-50 bg-forest/95 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur">
        <div className="section-shell flex h-20 items-center justify-between">
          <Link className="focus-ring flex items-center gap-3" href="/" aria-label="Ir para o início">
            <span className="flex size-11 items-center justify-center rounded-full border border-gold/80 font-display text-lg font-semibold text-linen">
              {site.monogram}
            </span>
            <span className="leading-tight text-white">
              <span className="block font-display text-lg font-semibold">{site.name}</span>
              <span className="block text-[11px] uppercase tracking-[0.22em] text-linen/80">descanso e acolhimento</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-4 lg:flex">
            <span className="text-sm text-white/60">{user.nome}</span>
            <button onClick={logout} className="focus-ring flex items-center gap-2 text-sm text-white/85 transition hover:text-gold">
              <LogOut size={16} />
              Sair
            </button>
          </nav>

          <button
            className="focus-ring flex size-11 items-center justify-center rounded-full border border-white/25 text-white lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 bg-forest px-5 pb-7 pt-3 lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-2">
              {clientNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`focus-ring rounded-[8px] px-3 py-3 text-base font-medium transition hover:bg-white/10 ${
                    pathname === item.href ? 'bg-white/10 text-gold' : 'text-white/90'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button onClick={() => { logout(); setMobileOpen(false); }} className="focus-ring mt-2 rounded-[8px] px-3 py-3 text-left text-base font-medium text-white/90 hover:bg-white/10">
                Sair
              </button>
            </nav>
          </div>
        )}
      </header>

      <div className="pt-24">
        <div className="section-shell py-8">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="hidden lg:block">
              <nav className="flex flex-col gap-1">
                {clientNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`focus-ring flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-medium transition ${
                      pathname === item.href
                        ? 'bg-forest text-white'
                        : 'text-ink/70 hover:bg-linen hover:text-forest'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </aside>

            <div className="min-h-[60vh]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
