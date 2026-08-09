import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto, FilterReservationsDto } from './dto/reservation.dto';
import { Apartment } from '../apartments/entities/apartment.entity';
import { User } from '../users/entities/user.entity';
import { ReservationStatus, UserRole } from '../common/enums';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userId: string, dto: CreateReservationDto): Promise<Reservation> {
    const apartment = await this.apartmentsRepository.findOne({
      where: { id: dto.apartamentoId, ativo: true },
    });
    if (!apartment) {
      throw new NotFoundException('Apartamento não encontrado ou inativo');
    }

    const checkInDate = new Date(dto.checkIn);
    const checkOutDate = new Date(dto.checkOut);
    const today = new Date(new Date().toDateString());

    if (checkOutDate <= checkInDate) {
      throw new BadRequestException('Data de check-out deve ser posterior ao check-in');
    }

    if (checkInDate < today) {
      throw new BadRequestException('Não é possível reservar no passado');
    }

    if (dto.hospedes > apartment.capacidade) {
      throw new BadRequestException(
        `Capacidade máxima do apartamento é ${apartment.capacidade} hóspedes`,
      );
    }

    const hasConflict = await this.reservationsRepository.findOne({
      where: {
        apartamentoId: dto.apartamentoId,
        status: Not(ReservationStatus.CANCELADA),
        checkIn: LessThanOrEqual(dto.checkOut),
        checkOut: MoreThanOrEqual(dto.checkIn),
      },
    });

    if (hasConflict) {
      throw new BadRequestException('Apartamento não disponível para o período selecionado');
    }

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const valorTotal = nights * Number(apartment.precoDiaria);

    const reservation = this.reservationsRepository.create({
      usuarioId: userId,
      apartamentoId: dto.apartamentoId,
      checkIn: dto.checkIn,
      checkOut: dto.checkOut,
      hospedes: dto.hospedes,
      valorTotal,
      status: ReservationStatus.CONFIRMADA,
    });

    return this.reservationsRepository.save(reservation);
  }

  async findAll(filters?: FilterReservationsDto): Promise<Reservation[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.apartamentoId) {
      where.apartamentoId = filters.apartamentoId;
    }
    if (filters?.usuarioId) {
      where.usuarioId = filters.usuarioId;
    }
    if (filters?.checkIn && filters?.checkOut) {
      where.checkIn = LessThanOrEqual(filters.checkOut);
      where.checkOut = MoreThanOrEqual(filters.checkIn);
    }

    return this.reservationsRepository.find({
      where,
      relations: ['usuario', 'apartamento'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      where: { usuarioId: userId },
      relations: ['apartamento'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Reservation | null> {
    return this.reservationsRepository.findOne({
      where: { id },
      relations: ['usuario', 'apartamento'],
    });
  }

  async cancel(id: string, userId: string, userRole: UserRole): Promise<Reservation> {
    const reservation = await this.findById(id);
    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada');
    }

    if (userRole !== UserRole.ADMIN && reservation.usuarioId !== userId) {
      throw new ForbiddenException('Sem permissão para cancelar esta reserva');
    }

    const checkInDate = new Date(reservation.checkIn);
    const today = new Date(new Date().toDateString());

    if (checkInDate <= today) {
      throw new BadRequestException('Não é possível cancelar reserva já iniciada');
    }

    reservation.status = ReservationStatus.CANCELADA;
    return this.reservationsRepository.save(reservation);
  }

  async updateStatus(id: string, status: ReservationStatus): Promise<Reservation> {
    const reservation = await this.findById(id);
    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada');
    }

    reservation.status = status;
    return this.reservationsRepository.save(reservation);
  }

  async getDashboard() {
    const today = new Date().toISOString().split('T')[0];

    const [reservasHoje, reservasFuturas, reservasCanceladas, apartamentos, totalClientes, reservasConfirmadas] =
      await Promise.all([
        this.reservationsRepository.find({
          where: { checkIn: LessThanOrEqual(today), checkOut: MoreThanOrEqual(today), status: Not(ReservationStatus.CANCELADA) },
          relations: ['usuario', 'apartamento'],
        }),
        this.reservationsRepository.find({
          where: { checkIn: MoreThanOrEqual(today), status: Not(ReservationStatus.CANCELADA) },
          relations: ['usuario', 'apartamento'],
        }),
        this.reservationsRepository.find({
          where: { status: ReservationStatus.CANCELADA },
          relations: ['usuario', 'apartamento'],
        }),
        this.apartmentsRepository.find(),
        this.usersRepository.count({ where: { role: UserRole.CLIENTE } }),
        this.reservationsRepository.find({
          where: { status: Not(ReservationStatus.CANCELADA) },
          relations: ['apartamento'],
        }),
      ]);

    const apartamentosOcupados = new Set(
      reservasHoje.map((r) => r.apartamentoId),
    );

    const receitaPrevista = reservasConfirmadas.reduce(
      (sum, r) => sum + Number(r.valorTotal),
      0,
    );

    return {
      reservasHoje,
      reservasFuturas,
      reservasCanceladas,
      totalApartamentos: apartamentos.length,
      apartamentosOcupados: apartamentosOcupados.size,
      apartamentosLivres: apartamentos.filter((a) => a.ativo).length - apartamentosOcupados.size,
      receitaPrevista,
      totalClientes,
    };
  }

  async remove(id: string): Promise<void> {
    const reservation = await this.findById(id);
    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada');
    }
    await this.reservationsRepository.remove(reservation);
  }
}
