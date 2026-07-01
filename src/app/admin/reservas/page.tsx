'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Reservation } from '@/types';
import { Search, XCircle, CheckCircle, Trash2 } from 'lucide-react';

const statusColors: Record<string, string> = {
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  CONFIRMADA: 'bg-green-100 text-green-800',
  CANCELADA: 'bg-red-100 text-red-800',
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterApartamento, setFilterApartamento] = useState('');
  const [filterCliente, setFilterCliente] = useState('');
  const [apartments, setApartments] = useState<{ id: string; nome: string }[]>([]);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set('status', filterStatus);
      if (filterApartamento) params.set('apartamentoId', filterApartamento);
      if (filterDate) {
        params.set('checkIn', filterDate);
        params.set('checkOut', filterDate);
      }
      const data = await api.get<Reservation[]>(`/reservations?${params}`);
      let filtered = data;
      if (filterCliente) {
        const term = filterCliente.toLowerCase();
        filtered = data.filter((r) => r.usuario?.nome?.toLowerCase().includes(term) || r.usuario?.email?.toLowerCase().includes(term));
      }
      setReservations(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterDate, filterApartamento, filterCliente]);

  useEffect(() => {
    const loadApartments = async () => {
      try {
        const data = await api.get<{ id: string; nome: string }[]>('/apartments');
        setApartments(data);
      } catch {}
    };
    loadApartments();
  }, []);

  useEffect(() => { fetchReservations(); }, [fetchReservations]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.put(`/reservations/${id}/status`, { status });
      fetchReservations();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancelar esta reserva?')) return;
    try {
      await api.put(`/reservations/${id}/cancel`, {});
      fetchReservations();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta reserva permanentemente?')) return;
    try {
      await api.delete(`/reservations/${id}`);
      fetchReservations();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <p className="eyebrow">Reservas</p>
      <h1 className="mt-3 text-2xl font-semibold text-forest">Gerenciar reservas</h1>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-2 rounded-[8px] border border-forest/15 bg-white px-3 py-2">
          <Search size={16} className="text-ink/40" />
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
            className="focus-ring bg-transparent text-sm text-ink outline-none" />
        </div>
        <input
          type="text"
          placeholder="Buscar por cliente..."
          value={filterCliente}
          onChange={(e) => setFilterCliente(e.target.value)}
          className="focus-ring rounded-[8px] border border-forest/15 bg-white px-4 py-2 text-sm text-ink outline-none transition focus:border-gold"
        />
        <select value={filterApartamento} onChange={(e) => setFilterApartamento(e.target.value)}
          className="focus-ring rounded-[8px] border border-forest/15 bg-white px-4 py-2 text-sm text-ink outline-none transition focus:border-gold">
          <option value="">Todos apartamentos</option>
          {apartments.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="focus-ring rounded-[8px] border border-forest/15 bg-white px-4 py-2 text-sm text-ink outline-none transition focus:border-gold">
          <option value="">Todos os status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="CONFIRMADA">Confirmada</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-ink/68">Carregando...</p>
      ) : reservations.length === 0 ? (
        <p className="mt-8 text-sm text-ink/68">Nenhuma reserva encontrada.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {reservations.map((r) => (
            <div key={r.id} className="rounded-[8px] border border-forest/10 bg-white p-5 shadow-soft">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-forest">{r.usuario?.nome || 'N/A'} &mdash; {r.apartamento?.nome || 'N/A'}</h3>
                  <p className="text-sm text-ink/68">
                    {new Date(r.checkIn).toLocaleDateString('pt-BR')} a {new Date(r.checkOut).toLocaleDateString('pt-BR')} &middot; {r.hospedes} hóspede{r.hospedes > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm font-semibold text-forest">R$ {Number(r.valorTotal).toFixed(2).replace('.', ',')}</p>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusColors[r.status]}`}>{r.status}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {r.status !== 'CONFIRMADA' && (
                    <button onClick={() => handleStatusChange(r.id, 'CONFIRMADA')} className="focus-ring flex items-center gap-1 rounded-full border border-green-200 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-50">
                      <CheckCircle size={14} /> Confirmar
                    </button>
                  )}
                  {r.status !== 'CANCELADA' && (
                    <button onClick={() => handleCancel(r.id)} className="focus-ring flex items-center gap-1 rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50">
                      <XCircle size={14} /> Cancelar
                    </button>
                  )}
                  <button onClick={() => handleDelete(r.id)} className="focus-ring flex items-center gap-1 rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50">
                    <Trash2 size={14} /> Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
