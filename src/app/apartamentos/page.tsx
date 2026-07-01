'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, API_BASE_URL } from '@/lib/api';
import { Apartment } from '@/types';
import { BedDouble, Users } from 'lucide-react';

export default function ApartmentsPage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const data = await api.get<Apartment[]>('/apartments/active');
        setApartments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApartments();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f3ea]">
      <div className="section-shell py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Acomodacoes</p>
          <h1 className="mt-3 text-3xl font-semibold text-forest sm:text-4xl lg:text-5xl">
            Nossos Apartamentos
          </h1>
          <p className="mt-5 text-base leading-8 text-ink/70 sm:text-lg">
            Conheca nossas opcoes de hospedagem e encontre a perfeita para a sua estadia.
          </p>
        </div>

        {loading ? (
          <p className="mt-12 text-center text-sm text-ink/68">Carregando apartamentos...</p>
        ) : apartments.length === 0 ? (
          <p className="mt-12 text-center text-sm text-ink/68">Nenhum apartamento disponivel no momento.</p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {apartments.map((apt) => {
              const hasFotos = apt.fotos && apt.fotos.length > 0;
              const imgUrl = hasFotos ? `${API_BASE_URL}${apt.fotos[0]}` : '';
              return (
              <Link key={apt.id} href={`/apartamentos/${apt.id}`}>
                <article className="cursor-pointer overflow-hidden rounded-[8px] bg-white shadow-soft transition hover:shadow-[0_18px_60px_rgba(31,61,53,0.18)]">
                  {hasFotos ? (
                    <div className="relative aspect-[4/3]">
                      <img
                        src={imgUrl}
                        alt={apt.nome}
                        className="size-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-linen">
                      <BedDouble size={48} className="text-forest/20" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-forest">{apt.nome}</h2>
                        {apt.numero && <p className="text-sm text-ink/50">#{apt.numero}</p>}
                      </div>
                      <p className="text-right text-lg font-semibold text-forest">
                        R$ {Number(apt.precoDiaria).toFixed(2).replace('.', ',')}
                        <span className="block text-xs font-normal text-ink/60">/ diaria</span>
                      </p>
                    </div>

                    {apt.descricao && (
                      <p className="mt-3 line-clamp-2 text-sm leading-7 text-ink/68">{apt.descricao}</p>
                    )}

                    <div className="mt-4 flex gap-4 text-sm text-ink/68">
                      <span className="flex items-center gap-1"><Users size={14} /> {apt.capacidade} hospedes</span>
                      <span className="flex items-center gap-1"><BedDouble size={14} /> {apt.quantidadeCamas} cama{apt.quantidadeCamas > 1 ? 's' : ''}</span>
                    </div>

                    {apt.comodidades && apt.comodidades.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {apt.comodidades.slice(0, 4).map((c) => (
                          <span key={c} className="rounded-full bg-linen px-3 py-1 text-xs font-medium text-forest">
                            {c}
                          </span>
                        ))}
                        {apt.comodidades.length > 4 && (
                          <span className="rounded-full bg-linen px-3 py-1 text-xs font-medium text-ink/50">
                            +{apt.comodidades.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {apt.fotos && apt.fotos.length > 1 && (
                      <p className="mt-3 text-xs text-ink/50">+{apt.fotos.length - 1} foto{apt.fotos.length - 1 > 1 ? 's' : ''}</p>
                    )}
                  </div>
                </article>
              </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
