'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      await register({ nome, email, senha, telefone: telefone || undefined });
      router.push('/minha-conta');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-[8px] bg-white p-7 shadow-soft sm:p-8">
      <p className="eyebrow text-center">Cadastro</p>
      <h1 className="mt-3 text-center text-2xl font-semibold text-forest">
        Crie sua conta
      </h1>
      <p className="mt-3 text-center text-sm leading-7 text-ink/68">
        Cadastre-se para realizar reservas e acompanhar suas estadias.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error && (
          <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-forest">Nome completo</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-gold"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-forest">E-mail</label>
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
          <label htmlFor="telefone" className="mb-1.5 block text-sm font-medium text-forest">Telefone (opcional)</label>
          <input
            id="telefone"
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-gold"
            placeholder="(11) 99999-9999"
          />
        </div>

        <div>
          <label htmlFor="senha" className="mb-1.5 block text-sm font-medium text-forest">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            minLength={6}
            className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-gold"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div>
          <label htmlFor="confirmarSenha" className="mb-1.5 block text-sm font-medium text-forest">Confirmar senha</label>
          <input
            id="confirmarSenha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-gold"
            placeholder="Repita a senha"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50"
        >
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/68">
        Já tem conta?{' '}
        <Link href="/login" className="font-semibold text-forest transition hover:text-gold">
          Entrar
        </Link>
      </p>
    </div>
  );
}
