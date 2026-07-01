'use client';

import Link from 'next/link';
import { site } from '@/data/site';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
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
          <Link className="focus-ring btn-light text-sm" href="/">
            Voltar ao site
          </Link>
        </div>
      </header>
      <main className="flex min-h-screen items-center justify-center px-5 pt-20">
        {children}
      </main>
    </div>
  );
}
