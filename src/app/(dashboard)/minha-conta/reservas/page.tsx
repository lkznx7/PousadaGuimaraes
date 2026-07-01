'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Reservation } from '@/types';
import { CalendarCheck, XCircle } from 'lucide-react';

const statusColors: Record<string, string> = {
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  CONFIRMADA: 'bg-green-100 text-green-800',
  CANCELADA: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  PENDENTE: 'Pendente',
  CONFIRMADA: 'Confirmada',
  CANCELADA: 'Cancelada',
};

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      const data = await api.get<Reservation[]>('/reservations/my');
      setReservations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReservations(); }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta reserva?')) return;
    setCancellingId(id);
    try {
      await api.put(`/reservations/${id}/cancel`, {});
      fetchReservations();
    } catch (err: any) {
      alert(err.message || 'Erro ao cancelar reserva');
    } finally {
      setCancellingId(null);
    }
  };

  const canCancel = (reservation: Reservation) => {
    if (reservation.status === 'CANCELADA') return false;
    const checkIn = new Date(reservation.checkIn);
    const today = new Date(new Date().toDateString());
    return checkIn > today;
  };

  if (loading) {
    return <p className="text-sm text-ink/68">Carregando reservas...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Reservas</p>
          <h1 className="mt-3 text-2xl font-semibold text-forest">Minhas reservas</h1>
        </div>
        <Link href="/reservar" className="btn-primary text-sm">
          <CalendarCheck size={16} />
          Nova reserva
        </Link>
      </div>

      {reservations.length === 0 ? (
        <div className="mt-12 rounded-[8px] border border-dashed border-gold/60 bg-linen/55 p-8 text-center">
          <p className="text-sm text-ink/68">Você ainda não possui reservas.</p>
          <Link href="/reservar" className="btn-primary mt-4 inline-flex">
            Fazer primeira reserva
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {reservations.map((r) => (
            <div key={r.id} className="rounded-[8px] border border-forest/10 bg-white p-5 shadow-soft sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-forest">{r.apartamento?.nome || 'Apartamento'}</h3>
                  <p className="mt-1 text-sm text-ink/68">
                    Check-in: {new Date(r.checkIn).toLocaleDateString('pt-BR')} &mdash; Check-out: {new Date(r.checkOut).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="mt-1 text-sm text-ink/68">{r.hospedes} hóspede{r.hospedes > 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusColors[r.status]}`}>
                      {statusLabels[r.status]}
                    </span>
                    <p className="mt-2 text-lg font-semibold text-forest">
                      R$ {Number(r.valorTotal).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  {canCancel(r) && (
                    <button
                      onClick={() => handleCancel(r.id)}
                      disabled={cancellingId === r.id}
                      className="focus-ring flex items-center gap-1 rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <XCircle size={14} />
                      {cancellingId === r.id ? 'Cancelando...' : 'Cancelar'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
