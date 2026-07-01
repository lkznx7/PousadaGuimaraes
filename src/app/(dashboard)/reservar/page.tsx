'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Apartment } from '@/types';
import { CalendarCheck, BedDouble, Users, ArrowRight } from 'lucide-react';

export default function ReservePage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [hospedes, setHospedes] = useState(1);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSearched(true);
    setSelectedApartment(null);
    try {
      const params = new URLSearchParams({ checkIn, checkOut, hospedes: String(hospedes) });
      const data = await api.get<Apartment[]>(`/apartments/available?${params}`);
      setApartments(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar disponibilidade');
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleConfirm = async () => {
    if (!selectedApartment || !token) return;
    setConfirming(true);
    setError('');
    try {
      await api.post('/reservations', {
        apartamentoId: selectedApartment.id,
        checkIn,
        checkOut,
        hospedes,
      });
      router.push('/minha-conta/reservas');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar reserva');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div>
      <p className="eyebrow">Reservas</p>
      <h1 className="mt-3 text-2xl font-semibold text-forest">Nova reserva</h1>
      <p className="mt-2 text-sm text-ink/68">Escolha suas datas e encontre o apartamento perfeito.</p>

      <form onSubmit={handleSearch} className="mt-8 rounded-[8px] border border-forest/10 bg-white p-6 shadow-soft sm:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="checkIn" className="mb-1.5 block text-sm font-medium text-forest">Check-in</label>
            <input
              id="checkIn"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={today}
              required
              className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-gold"
            />
          </div>
          <div>
            <label htmlFor="checkOut" className="mb-1.5 block text-sm font-medium text-forest">Check-out</label>
            <input
              id="checkOut"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || today}
              required
              className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-gold"
            />
          </div>
          <div>
            <label htmlFor="hospedes" className="mb-1.5 block text-sm font-medium text-forest">Hóspedes</label>
            <input
              id="hospedes"
              type="number"
              value={hospedes}
              onChange={(e) => setHospedes(Number(e.target.value))}
              min={1}
              max={10}
              required
              className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-gold"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <button type="submit" disabled={loading} className="btn-primary mt-5 disabled:opacity-50">
          <CalendarCheck size={16} />
          {loading ? 'Buscando...' : 'Verificar disponibilidade'}
        </button>
      </form>

      {searched && !loading && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-forest">
            {apartments.length > 0
              ? `${apartments.length} apartamento${apartments.length > 1 ? 's' : ''} disponível${apartments.length > 1 ? 'is' : ''}`
              : 'Nenhum apartamento disponível'}
          </h2>

          {apartments.length > 0 && (
            <div className="mt-5 space-y-4">
              {apartments.map((apt) => {
                const nights = calculateNights();
                const total = nights * Number(apt.precoDiaria);
                const isSelected = selectedApartment?.id === apt.id;

                return (
                  <button
                    key={apt.id}
                    type="button"
                    onClick={() => setSelectedApartment(isSelected ? null : apt)}
                    className={`focus-ring w-full rounded-[8px] border p-5 text-left transition sm:p-6 ${
                      isSelected
                        ? 'border-gold bg-gold/5 shadow-soft'
                        : 'border-forest/10 bg-white hover:border-gold/50'
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-forest">{apt.nome}</h3>
                        {apt.descricao && (
                          <p className="mt-1 text-sm text-ink/68">{apt.descricao}</p>
                        )}
                        <div className="mt-2 flex gap-4 text-sm text-ink/68">
                          <span className="flex items-center gap-1"><Users size={14} /> {apt.capacidade} hóspedes</span>
                          <span className="flex items-center gap-1"><BedDouble size={14} /> {apt.quantidadeCamas} cama{apt.quantidadeCamas > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-ink/68">R$ {Number(apt.precoDiaria).toFixed(2).replace('.', ',')} / diária</p>
                        {nights > 0 && (
                          <p className="mt-1 text-lg font-semibold text-forest">
                            R$ {total.toFixed(2).replace('.', ',')}
                            <span className="text-xs font-normal text-ink/60"> ({nights} diária{nights > 1 ? 's' : ''})</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {selectedApartment && (
            <div className="mt-6 rounded-[8px] border border-gold/30 bg-gold/5 p-6">
              <h3 className="text-lg font-semibold text-forest">Resumo da reserva</h3>
              <div className="mt-3 space-y-2 text-sm text-ink/70">
                <p><strong>Apartamento:</strong> {selectedApartment.nome}</p>
                <p><strong>Check-in:</strong> {new Date(checkIn).toLocaleDateString('pt-BR')}</p>
                <p><strong>Check-out:</strong> {new Date(checkOut).toLocaleDateString('pt-BR')}</p>
                <p><strong>Hóspedes:</strong> {hospedes}</p>
                <p><strong>Diárias:</strong> {calculateNights()} x R$ {Number(selectedApartment.precoDiaria).toFixed(2).replace('.', ',')}</p>
                <p className="text-lg font-semibold text-forest">
                  Total: R$ {(calculateNights() * Number(selectedApartment.precoDiaria)).toFixed(2).replace('.', ',')}
                </p>
              </div>
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="btn-primary mt-5 w-full disabled:opacity-50"
              >
                <ArrowRight size={16} />
                {confirming ? 'Confirmando...' : 'Confirmar reserva'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
