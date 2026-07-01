'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { User } from '@/types';

export default function ProfilePage() {
  const { user } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setNome(user.nome);
      setEmail(user.email);
      setTelefone(user.telefone || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const body: any = { nome, email };
      if (telefone) body.telefone = telefone;
      if (senha) body.senha = senha;

      await api.put('/users/me', body);
      setMessage('Perfil atualizado com sucesso!');
      setSenha('');
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="eyebrow">Perfil</p>
      <h1 className="mt-3 text-2xl font-semibold text-forest">Meus dados</h1>
      <p className="mt-2 text-sm text-ink/68">Atualize suas informações pessoais.</p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-lg space-y-5">
        {message && (
          <div className="rounded-[8px] border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</div>
        )}
        {error && (
          <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <div>
          <label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-forest">Nome</label>
          <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required
            className="focus-ring w-full rounded-[8px] border border-forest/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-gold" />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-forest">E-mail</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="focus-ring w-full rounded-[8px] border border-forest/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-gold" />
        </div>

        <div>
          <label htmlFor="telefone" className="mb-1.5 block text-sm font-medium text-forest">Telefone</label>
          <input id="telefone" type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)}
            className="focus-ring w-full rounded-[8px] border border-forest/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-gold"
            placeholder="(11) 99999-9999" />
        </div>

        <div>
          <label htmlFor="senha" className="mb-1.5 block text-sm font-medium text-forest">Nova senha (deixe vazio para manter)</label>
          <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} minLength={6}
            className="focus-ring w-full rounded-[8px] border border-forest/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-gold"
            placeholder="Mínimo 6 caracteres" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
          {loading ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </form>
    </div>
  );
}
