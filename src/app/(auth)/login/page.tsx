'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, senha);
      if (redirect) {
        router.push(decodeURIComponent(redirect));
      } else {
        router.push('/minha-conta');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Credenciais invalidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-[8px] bg-white p-7 shadow-soft sm:p-8">
      <p className="eyebrow text-center">Acesso</p>
      <h1 className="mt-3 text-center text-2xl font-semibold text-forest">
        Entrar na sua conta
      </h1>
      <p className="mt-3 text-center text-sm leading-7 text-ink/68">
        Acesse para gerenciar suas reservas e perfil.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error && (
          <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-forest">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-gold"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label htmlFor="senha" className="mb-1.5 block text-sm font-medium text-forest">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-gold"
            placeholder="Sua senha"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/68">
        Nao tem conta?{' '}
        <Link href="/cadastro" className="font-semibold text-forest transition hover:text-gold">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-ink/68">Carregando...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
