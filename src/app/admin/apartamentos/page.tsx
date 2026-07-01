'use client';

import { useState, useEffect } from 'react';
import { api, API_BASE_URL } from '@/lib/api';
import { Apartment } from '@/types';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Upload, GripVertical, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const AVAILABLE_AMENITIES = ['Wi-Fi', 'TV', 'Ar-condicionado', 'Frigobar', 'Ventilador', 'Varanda', 'Cofre', 'Banheira', 'Chuveiro elétrico', 'Secador de cabelo', 'Toalhas', 'Roupa de cama', 'Escritório', 'Cozinha', 'Máquina de café'];

export default function AdminApartmentsPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Apartment | null>(null);
  const [form, setForm] = useState({
    nome: '', numero: '', descricao: '', capacidade: 2, quantidadeCamas: 1,
    precoDiaria: 0, comodidades: [] as string[], ativo: true,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchApartments = async () => {
    try {
      const data = await api.get<Apartment[]>('/apartments');
      setApartments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApartments(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ nome: '', numero: '', descricao: '', capacidade: 2, quantidadeCamas: 1, precoDiaria: 0, comodidades: [], ativo: true });
    setModalOpen(true);
  };

  const openEdit = (apt: Apartment) => {
    setEditing(apt);
    setForm({
      nome: apt.nome, numero: apt.numero || '', descricao: apt.descricao || '',
      capacidade: apt.capacidade, quantidadeCamas: apt.quantidadeCamas,
      precoDiaria: Number(apt.precoDiaria), comodidades: apt.comodidades || [], ativo: apt.ativo,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/apartments/${editing.id}`, form);
      } else {
        await api.post('/apartments', form);
      }
      setModalOpen(false);
      fetchApartments();
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await api.put(`/apartments/${id}/toggle-active`, {});
      fetchApartments();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este apartamento?')) return;
    try {
      await api.delete(`/apartments/${id}`);
      fetchApartments();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setForm((prev) => ({
      ...prev,
      comodidades: prev.comodidades.includes(amenity)
        ? prev.comodidades.filter((a) => a !== amenity)
        : [...prev.comodidades, amenity],
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !editing) return;
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_BASE_URL}/api/uploads`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push(data.url);
        } else {
          await res.json().catch(() => ({}));
        }
      }
      const newFotos = [...(editing.fotos || []), ...uploadedUrls];
      await api.put(`/apartments/${editing.id}`, { fotos: newFotos });
      fetchApartments();
      setEditing({ ...editing, fotos: newFotos });
    } catch (err: any) {
      alert(err.message || 'Erro no upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (fotoUrl: string) => {
    if (!editing || !confirm('Excluir esta foto?')) return;
    try {
      const token = localStorage.getItem('token');
      const filename = fotoUrl.split('/').pop();
      if (filename) {
        await fetch(`${API_BASE_URL}/api/uploads/${filename}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      const newFotos = editing.fotos.filter((f) => f !== fotoUrl);
      await api.put(`/apartments/${editing.id}`, { fotos: newFotos });
      fetchApartments();
      setEditing({ ...editing, fotos: newFotos });
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir foto');
    }
  };

  const handleSetCover = async (fotoUrl: string) => {
    if (!editing) return;
    try {
      const newFotos = [fotoUrl, ...editing.fotos.filter((f) => f !== fotoUrl)];
      await api.put(`/apartments/${editing.id}`, { fotos: newFotos });
      fetchApartments();
      setEditing({ ...editing, fotos: newFotos });
    } catch (err: any) {
      alert(err.message || 'Erro ao definir capa');
    }
  };

  const handleMovePhoto = async (index: number, direction: 'left' | 'right') => {
    if (!editing) return;
    const newFotos = [...editing.fotos];
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newFotos.length) return;
    [newFotos[index], newFotos[newIndex]] = [newFotos[newIndex], newFotos[index]];
    try {
      await api.put(`/apartments/${editing.id}`, { fotos: newFotos });
      fetchApartments();
      setEditing({ ...editing, fotos: newFotos });
    } catch (err: any) {
      alert(err.message || 'Erro ao reordenar foto');
    }
  };

  if (loading) return <p className="text-sm text-ink/68">Carregando...</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Apartamentos</p>
          <h1 className="mt-3 text-2xl font-semibold text-forest">Gerenciar apartamentos</h1>
        </div>
        <button onClick={openNew} className="btn-primary"><Plus size={16} /> Novo</button>
      </div>

      <div className="mt-8 space-y-3">
        {apartments.map((apt) => (
          <div key={apt.id} className="rounded-[8px] border border-forest/10 bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-forest">{apt.nome} {apt.numero && <span className="text-sm font-normal text-ink/50">#{apt.numero}</span>}</h3>
                <p className="text-sm text-ink/68">{apt.capacidade} hóspedes &middot; {apt.quantidadeCamas} cama{apt.quantidadeCamas > 1 ? 's' : ''} &middot; R$ {Number(apt.precoDiaria).toFixed(2).replace('.', ',')}/diária</p>
                {apt.comodidades?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {apt.comodidades.map((c) => (
                      <span key={c} className="rounded-full bg-linen px-2 py-0.5 text-xs text-forest">{c}</span>
                    ))}
                  </div>
                )}
                <div className="mt-2 flex gap-2">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${apt.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {apt.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                  {apt.fotos?.length > 0 && (
                    <span className="inline-block rounded-full bg-linen px-2 py-0.5 text-xs text-ink/60">{apt.fotos.length} foto{apt.fotos.length > 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => openEdit(apt)} className="focus-ring flex items-center gap-1 rounded-full border border-forest/15 px-3 py-2 text-xs font-semibold text-forest transition hover:bg-linen">
                  <Pencil size={14} /> Editar
                </button>
                <button onClick={() => handleToggle(apt.id)} className="focus-ring flex items-center gap-1 rounded-full border border-forest/15 px-3 py-2 text-xs font-semibold text-forest transition hover:bg-linen">
                  {apt.ativo ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                  {apt.ativo ? 'Desativar' : 'Ativar'}
                </button>
                <button onClick={() => handleDelete(apt.id)} className="focus-ring flex items-center gap-1 rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50">
                  <Trash2 size={14} /> Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/70 px-5 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[8px] bg-white p-7 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-forest">{editing ? 'Editar' : 'Novo'} apartamento</h2>
              <button onClick={() => setModalOpen(false)} className="focus-ring flex size-10 items-center justify-center rounded-full border border-forest/10 text-forest transition hover:border-gold hover:text-ink">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-forest">Nome *</label>
                  <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required
                    className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-gold" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-forest">Número</label>
                  <input value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })}
                    className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-gold"
                    placeholder="Ex: 101" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-forest">Descrição</label>
                <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3}
                  className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-gold" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-forest">Capacidade *</label>
                  <input type="number" value={form.capacidade} onChange={(e) => setForm({ ...form, capacidade: Number(e.target.value) })} min={1}
                    className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-gold" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-forest">Camas *</label>
                  <input type="number" value={form.quantidadeCamas} onChange={(e) => setForm({ ...form, quantidadeCamas: Number(e.target.value) })} min={1}
                    className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-gold" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-forest">Preço/diária *</label>
                  <input type="number" step="0.01" value={form.precoDiaria} onChange={(e) => setForm({ ...form, precoDiaria: Number(e.target.value) })} min={0}
                    className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-gold" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-forest">Comodidades</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_AMENITIES.map((a) => (
                    <button key={a} type="button" onClick={() => toggleAmenity(a)}
                      className={`focus-ring rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        form.comodidades.includes(a)
                          ? 'border-forest bg-forest text-white'
                          : 'border-forest/15 bg-white text-forest hover:bg-linen'
                      }`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              {editing && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-forest">Fotos</label>
                  <div className="flex items-center gap-3">
                    <label className="focus-ring flex cursor-pointer items-center gap-2 rounded-full border border-forest/15 px-4 py-2 text-xs font-semibold text-forest transition hover:bg-linen">
                      <Upload size={14} />
                      {uploading ? 'Enviando...' : 'Adicionar fotos'}
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                    </label>
                    {editing.fotos?.length > 0 && (
                      <span className="text-xs text-ink/60">{editing.fotos.length} foto{editing.fotos.length > 1 ? 's' : ''}</span>
                    )}
                  </div>
                  {editing.fotos?.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-ink/60">Arraste para reordenar, clique na estrela para definir como capa</p>
                      <div className="flex flex-wrap gap-2">
                        {editing.fotos.map((foto, i) => {
                          const imgUrl = `${API_BASE_URL}${foto}`;
                          return (
                            <div key={i} className="group relative size-20 overflow-hidden rounded-[4px] border border-forest/10">
                              <img src={imgUrl} alt={`Foto ${i + 1}`} className="size-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center gap-0.5 bg-black/0 opacity-0 transition group-hover:bg-black/50 group-hover:opacity-100">
                                {i > 0 && (
                                  <button type="button" onClick={() => handleMovePhoto(i, 'left')} className="p-1 text-white hover:text-gold">
                                    <ChevronLeft size={14} />
                                  </button>
                                )}
                                <button type="button" onClick={() => handleSetCover(foto)} className={`p-1 ${i === 0 ? 'text-gold' : 'text-white hover:text-gold'}`}>
                                  <Star size={14} fill={i === 0 ? 'currentColor' : 'none'} />
                                </button>
                                <button type="button" onClick={() => handleDeletePhoto(foto)} className="p-1 text-white hover:text-red-400">
                                  <Trash2 size={14} />
                                </button>
                                {i < editing.fotos.length - 1 && (
                                  <button type="button" onClick={() => handleMovePhoto(i, 'right')} className="p-1 text-white hover:text-gold">
                                    <ChevronRight size={14} />
                                  </button>
                                )}
                              </div>
                              {i === 0 && (
                                <div className="absolute top-0.5 left-0.5 rounded bg-gold px-1 py-0.5 text-[8px] font-bold text-white">CAPA</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
