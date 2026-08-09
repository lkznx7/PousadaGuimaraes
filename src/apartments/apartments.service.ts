import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Apartment } from './entities/apartment.entity';
import { CreateApartmentDto, UpdateApartmentDto } from './dto/apartment.dto';
import { Reservation } from '../reservations/entities/reservation.entity';
import { ReservationStatus } from '../common/enums';

@Injectable()
export class ApartmentsService {
  constructor(
    @InjectRepository(Apartment)
    private apartmentsRepository: Repository<Apartment>,
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
  ) {}

  async create(dto: CreateApartmentDto): Promise<Apartment> {
    const apartment = this.apartmentsRepository.create(dto);
    return this.apartmentsRepository.save(apartment);
  }

  async findAll(): Promise<Apartment[]> {
    return this.apartmentsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findActive(): Promise<Apartment[]> {
    return this.apartmentsRepository.find({
      where: { ativo: true },
      order: { nome: 'ASC' },
    });
  }

  async findById(id: string): Promise<Apartment | null> {
    return this.apartmentsRepository.findOne({ where: { id } });
  }

  async findAvailable(checkIn: string, checkOut: string, hospedes: number): Promise<Apartment[]> {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      throw new BadRequestException('Data de check-out deve ser posterior ao check-in');
    }

    if (checkInDate < new Date(new Date().toDateString())) {
      throw new BadRequestException('Não é possível reservar no passado');
    }

    const apartments = await this.apartmentsRepository.find({
      where: { ativo: true, capacidade: MoreThanOrEqual(hospedes) },
    });

    const availableApartments: Apartment[] = [];

    for (const apartment of apartments) {
      const hasConflict = await this.reservationsRepository.findOne({
        where: {
          apartamentoId: apartment.id,
          status: Not(ReservationStatus.CANCELADA),
          checkIn: LessThanOrEqual(checkOut),
          checkOut: MoreThanOrEqual(checkIn),
        },
      });

      if (!hasConflict) {
        availableApartments.push(apartment);
      }
    }

    return availableApartments;
  }

  async update(id: string, dto: UpdateApartmentDto): Promise<Apartment> {
    const apartment = await this.findById(id);
    if (!apartment) {
      throw new NotFoundException('Apartamento não encontrado');
    }

    Object.assign(apartment, dto);
    const saved = await this.apartmentsRepository.save(apartment);

    return saved;
  }

  async toggleActive(id: string): Promise<Apartment> {
    const apartment = await this.findById(id);
    if (!apartment) {
      throw new NotFoundException('Apartamento não encontrado');
    }

    apartment.ativo = !apartment.ativo;
    return this.apartmentsRepository.save(apartment);
  }

  async remove(id: string): Promise<void> {
    const apartment = await this.findById(id);
    if (!apartment) {
      throw new NotFoundException('Apartamento não encontrado');
    }
    await this.apartmentsRepository.remove(apartment);
  }

  async updatePhotos(id: string, photos: string[]): Promise<Apartment> {
    const apartment = await this.findById(id);
    if (!apartment) {
      throw new NotFoundException('Apartamento não encontrado');
    }
    apartment.fotos = photos;
    return this.apartmentsRepository.save(apartment);
  }
}
