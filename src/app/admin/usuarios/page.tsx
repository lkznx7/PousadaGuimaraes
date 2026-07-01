'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types';
import { Pencil, Trash2, Shield, X, Eye } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<User | null>(null);
  const [viewing, setViewing] = useState<User | null>(null);
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', role: 'CLIENTE' as string });
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await api.get<User[]>('/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openEdit = (u: User) => {
    setEditing(u);
    setForm({ nome: u.nome, email: u.email, telefone: u.telefone || '', role: u.role });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      await api.put(`/users/${editing.id}`, form);
      setEditing(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este usuário?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePromote = async (id: string, role: string) => {
    try {
      await api.put(`/users/${id}`, { role });
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-sm text-ink/68">Carregando...</p>;

  return (
    <div>
      <p className="eyebrow">Usuários</p>
      <h1 className="mt-3 text-2xl font-semibold text-forest">Gerenciar usuários</h1>

      <div className="mt-8 space-y-3">
        {users.map((u) => (
          <div key={u.id} className="rounded-[8px] border border-forest/10 bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-forest">{u.nome}</h3>
                <p className="text-sm text-ink/68">{u.email}{u.telefone ? ` · ${u.telefone}` : ''}</p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                  u.role === 'ADMIN' ? 'bg-forest text-white' : 'bg-linen text-forest'
                }`}>{u.role}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setViewing(u)} className="focus-ring flex items-center gap-1 rounded-full border border-forest/15 px-3 py-2 text-xs font-semibold text-forest transition hover:bg-linen">
                  <Eye size={14} /> Ver
                </button>
                <button onClick={() => openEdit(u)} className="focus-ring flex items-center gap-1 rounded-full border border-forest/15 px-3 py-2 text-xs font-semibold text-forest transition hover:bg-linen">
                  <Pencil size={14} /> Editar
                </button>
                {u.role !== 'ADMIN' ? (
                  <button onClick={() => handlePromote(u.id, 'ADMIN')} className="focus-ring flex items-center gap-1 rounded-full border border-gold/50 px-3 py-2 text-xs font-semibold text-gold transition hover:bg-gold/10">
                    <Shield size={14} /> Tornar Admin
                  </button>
                ) : (
                  <button onClick={() => handlePromote(u.id, 'CLIENTE')} className="focus-ring flex items-center gap-1 rounded-full border border-forest/15 px-3 py-2 text-xs font-semibold text-forest transition hover:bg-linen">
                    <Shield size={14} /> Rebaixar
                  </button>
                )}
                <button onClick={() => handleDelete(u.id)} className="focus-ring flex items-center gap-1 rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50">
                  <Trash2 size={14} /> Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {viewing && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/70 px-5 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) setViewing(null); }}>
          <div className="w-full max-w-md rounded-[8px] bg-white p-7 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-forest">Perfil do usuário</h2>
              <button onClick={() => setViewing(null)} className="focus-ring flex size-10 items-center justify-center rounded-full border border-forest/10 text-forest transition hover:border-gold hover:text-ink">
                <X size={20} />
              </button>
            </div>
            <div className="mt-6 space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">Nome</p>
                <p className="text-sm text-forest">{viewing.nome}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">E-mail</p>
                <p className="text-sm text-forest">{viewing.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">Telefone</p>
                <p className="text-sm text-forest">{viewing.telefone || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">Função</p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${viewing.role === 'ADMIN' ? 'bg-forest text-white' : 'bg-linen text-forest'}`}>{viewing.role}</span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">Cadastrado em</p>
                <p className="text-sm text-forest">{new Date(viewing.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/70 px-5 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) setEditing(null); }}>
          <div className="w-full max-w-lg rounded-[8px] bg-white p-7 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-forest">Editar usuário</h2>
              <button onClick={() => setEditing(null)} className="focus-ring flex size-10 items-center justify-center rounded-full border border-forest/10 text-forest transition hover:border-gold hover:text-ink">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-forest">Nome</label>
                <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required
                  className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-gold" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-forest">E-mail</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                  className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-gold" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-forest">Telefone</label>
                <input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-gold" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-forest">Função</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-gold">
                  <option value="CLIENTE">Cliente</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-50">
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
