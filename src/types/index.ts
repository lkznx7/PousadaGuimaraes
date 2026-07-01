export type UserRole = 'ADMIN' | 'CLIENTE';

export type ReservationStatus = 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA';

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  role: UserRole;
  createdAt: string;
}

export interface Apartment {
  id: string;
  nome: string;
  numero?: string;
  descricao?: string;
  capacidade: number;
  quantidadeCamas: number;
  precoDiaria: number;
  fotos: string[];
  comodidades: string[];
  ativo: boolean;
  createdAt: string;
}

export interface Reservation {
  id: string;
  usuarioId: string;
  usuario?: User;
  apartamentoId: string;
  apartamento?: Apartment;
  checkIn: string;
  checkOut: string;
  hospedes: number;
  valorTotal: number;
  status: ReservationStatus;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface DashboardData {
  reservasHoje: Reservation[];
  reservasFuturas: Reservation[];
  reservasCanceladas: Reservation[];
  totalApartamentos: number;
  apartamentosOcupados: number;
  apartamentosLivres: number;
  receitaPrevista: number;
  totalClientes: number;
}
