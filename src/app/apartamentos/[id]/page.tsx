'use client';

import { Suspense, useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api, API_BASE_URL } from '@/lib/api';
import { Apartment } from '@/types';
import { BedDouble, Users, ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';

function ApartmentDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [hospedes, setHospedes] = useState(Number(searchParams.get('hospedes')) || 1);
  const [availability, setAvailability] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const data = await api.get<Apartment>(`/apartments/${id}`);
        setApartment(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApartment();
  }, [id]);

  useEffect(() => {
    if (!checkIn || !checkOut || !apartment) {
      setAvailability('idle');
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      setAvailability('unavailable');
      return;
    }

    const timer = setTimeout(async () => {
      setAvailability('checking');
      try {
        const params = new URLSearchParams({ checkIn, checkOut, hospedes: String(hospedes) });
        const available = await api.get<Apartment[]>(`/apartments/available?${params}`);
        const isAvailable = available.some((a) => a.id === apartment.id);
        setAvailability(isAvailable ? 'available' : 'unavailable');
      } catch {
        setAvailability('unavailable');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [checkIn, checkOut, hospedes, apartment]);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleReserve = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      const redirectUrl = encodeURIComponent(`/apartamentos/${id}?checkIn=${checkIn}&checkOut=${checkOut}&hospedes=${hospedes}`);
      router.push(`/login?redirect=${redirectUrl}`);
      return;
    }

    setReserving(true);
    setError('');
    try {
      await api.post('/reservations', {
        apartamentoId: apartment!.id,
        checkIn,
        checkOut,
        hospedes,
      });
      router.push('/minha-conta/reservas');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar reserva');
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f3ea]">
        <p className="text-sm text-ink/68">Carregando...</p>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f3ea]">
        <div className="text-center">
          <p className="text-lg font-semibold text-forest">Apartamento nao encontrado</p>
          <Link href="/apartamentos" className="btn-primary mt-4 inline-flex">
            <ArrowLeft size={16} /> Voltar
          </Link>
        </div>
      </div>
    );
  }

  const nights = calculateNights();
  const total = nights * Number(apartment.precoDiaria);
  const hasPhotos = apartment.fotos && apartment.fotos.length > 0;

  return (
    <div className="min-h-screen bg-[#f8f3ea]">
      <div className="section-shell py-8">
        <Link href="/apartamentos" className="focus-ring mb-6 inline-flex items-center gap-2 text-sm font-medium text-forest transition hover:text-gold">
          <ArrowLeft size={16} /> Voltar para apartamentos
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left: Gallery + Info */}
          <div>
            {/* Gallery */}
            {hasPhotos ? (
              <div>
                <div className="relative overflow-hidden rounded-[8px] bg-white shadow-soft">
                  <div className="aspect-[16/10]">
                    <img
                      src={`${API_BASE_URL}${apartment.fotos[activeImage]}`}
                      alt={`${apartment.nome} - Foto ${activeImage + 1}`}
                      className="size-full object-cover"
                    />
                  </div>
                  {apartment.fotos.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImage((prev) => (prev === 0 ? apartment.fotos.length - 1 : prev - 1))}
                        className="focus-ring absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-forest shadow transition hover:bg-white"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => setActiveImage((prev) => (prev === apartment.fotos.length - 1 ? 0 : prev + 1))}
                        className="focus-ring absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-forest shadow transition hover:bg-white"
                      >
                        <ChevronRight size={20} />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-forest/80 px-3 py-1 text-xs font-medium text-white">
                        {activeImage + 1} / {apartment.fotos.length}
                      </div>
                    </>
                  )}
                </div>

                {apartment.fotos.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {apartment.fotos.map((foto, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`focus-ring shrink-0 overflow-hidden rounded-[4px] transition ${
                          i === activeImage ? 'ring-2 ring-gold' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={`${API_BASE_URL}${foto}`}
                          alt={`Miniatura ${i + 1}`}
                          className="size-16 object-cover sm:size-20"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center rounded-[8px] bg-white shadow-soft">
                <BedDouble size={64} className="text-forest/20" />
              </div>
            )}

            {/* Info */}
            <div className="mt-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-forest sm:text-4xl">{apartment.nome}</h1>
                  {apartment.numero && <p className="mt-1 text-sm text-ink/50">Apartamento #{apartment.numero}</p>}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-forest">R$ {Number(apartment.precoDiaria).toFixed(2).replace('.', ',')}</p>
                  <p className="text-sm text-ink/60">por diaria</p>
                </div>
              </div>

              {apartment.descricao && (
                <p className="mt-6 text-base leading-8 text-ink/70">{apartment.descricao}</p>
              )}

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-[8px] border border-forest/10 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">Capacidade</p>
                  <p className="mt-1 text-lg font-semibold text-forest">{apartment.capacidade} hospedes</p>
                </div>
                <div className="rounded-[8px] border border-forest/10 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">Camas</p>
                  <p className="mt-1 text-lg font-semibold text-forest">{apartment.quantidadeCamas}</p>
                </div>
                <div className="rounded-[8px] border border-forest/10 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">Diaria</p>
                  <p className="mt-1 text-lg font-semibold text-forest">R$ {Number(apartment.precoDiaria).toFixed(2).replace('.', ',')}</p>
                </div>
              </div>

              {apartment.comodidades && apartment.comodidades.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-forest">Comodidades</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {apartment.comodidades.map((c) => (
                      <span key={c} className="flex items-center gap-1.5 rounded-full border border-forest/10 bg-white px-4 py-2 text-sm font-medium text-forest">
                        <CheckCircle size={14} className="text-forest" />
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Reservation Panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[8px] border border-forest/10 bg-white p-6 shadow-soft">
              <p className="eyebrow">Reserva</p>
              <h2 className="mt-3 text-xl font-semibold text-forest">Faça sua reserva</h2>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-forest">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={today}
                    className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-gold"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-forest">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || today}
                    className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-gold"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-forest">Hospedes</label>
                  <input
                    type="number"
                    value={hospedes}
                    onChange={(e) => setHospedes(Number(e.target.value))}
                    min={1}
                    max={apartment.capacidade}
                    className="focus-ring w-full rounded-[8px] border border-forest/15 bg-linen/55 px-4 py-3 text-sm text-ink outline-none transition focus:border-gold"
                  />
                </div>
              </div>

              {/* Availability Status */}
              {checkIn && checkOut && (
                <div className="mt-4">
                  {availability === 'checking' && (
                    <p className="text-sm text-ink/68">Verificando disponibilidade...</p>
                  )}
                  {availability === 'available' && (
                    <div className="flex items-center gap-2 rounded-[8px] border border-green-200 bg-green-50 p-3">
                      <CheckCircle size={16} className="shrink-0 text-green-600" />
                      <p className="text-sm font-medium text-green-800">Apartamento disponivel</p>
                    </div>
                  )}
                  {availability === 'unavailable' && (
                    <div className="flex items-center gap-2 rounded-[8px] border border-red-200 bg-red-50 p-3">
                      <AlertCircle size={16} className="shrink-0 text-red-600" />
                      <p className="text-sm font-medium text-red-800">Apartamento indisponivel para essas datas</p>
                    </div>
                  )}
                </div>
              )}

              {/* Price Summary */}
              {nights > 0 && (
                <div className="mt-6 space-y-2 border-t border-forest/10 pt-4">
                  <div className="flex justify-between text-sm text-ink/70">
                    <span>R$ {Number(apartment.precoDiaria).toFixed(2).replace('.', ',')} x {nights} diaria{nights > 1 ? 's' : ''}</span>
                    <span className="font-medium text-forest">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between border-t border-forest/10 pt-2">
                    <span className="text-base font-semibold text-forest">Total</span>
                    <span className="text-base font-semibold text-forest">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
              )}

              <button
                onClick={handleReserve}
                disabled={!checkIn || !checkOut || availability !== 'available' || reserving}
                className="btn-primary mt-6 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reserving ? 'Reservando...' : 'Reservar agora'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApartmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#f8f3ea]">
        <p className="text-sm text-ink/68">Carregando...</p>
      </div>
    }>
      <ApartmentDetailContent id={id} />
    </Suspense>
  );
}
