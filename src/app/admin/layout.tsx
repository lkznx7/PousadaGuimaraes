'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { site } from '@/data/site';
import { BedDouble, CalendarCheck, Users, LogOut, Menu, X, ArrowLeft } from 'lucide-react';

const adminNav = [
  { label: 'Apartamentos', href: '/admin/apartamentos', icon: BedDouble },
  { label: 'Reservas', href: '/admin/reservas', icon: CalendarCheck },
  { label: 'Usuários', href: '/admin/usuarios', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    document.title = `Painel Administrativo | ${site.name}`;
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

  if (loading || !user || user.role !== 'ADMIN') {
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
              <span className="block text-[11px] uppercase tracking-[0.22em] text-linen/80">painel administrativo</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-4 lg:flex">
            <Link href="/minha-conta" className="focus-ring flex items-center gap-1 text-sm text-white/85 transition hover:text-gold">
              <ArrowLeft size={14} />
              Minha conta
            </Link>
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
              {adminNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`focus-ring flex items-center gap-3 rounded-[8px] px-3 py-3 text-base font-medium transition hover:bg-white/10 ${
                      pathname === item.href ? 'bg-white/10 text-gold' : 'text-white/90'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
              <button onClick={() => { logout(); setMobileOpen(false); }} className="focus-ring mt-2 flex items-center gap-3 rounded-[8px] px-3 py-3 text-left text-base font-medium text-white/90 hover:bg-white/10">
                <LogOut size={18} />
                Sair
              </button>
            </nav>
          </div>
        )}
      </header>

      <div className="flex pt-20">
        <aside className="fixed left-0 top-20 hidden h-[calc(100vh-5rem)] w-60 border-r border-forest/10 bg-white p-4 lg:block">
          <nav className="flex flex-col gap-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`focus-ring flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-forest text-white' : 'text-ink/70 hover:bg-linen hover:text-forest'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 px-5 py-8 lg:ml-60 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
