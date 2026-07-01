import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ReservationStatus } from '../../common/enums';
import { User } from '../../users/entities/user.entity';
import { Apartment } from '../../apartments/entities/apartment.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  usuarioId: string;

  @ManyToOne(() => User, (user) => user.reservas, { eager: true })
  @JoinColumn({ name: 'usuarioId' })
  usuario: User;

  @Column({ type: 'uuid' })
  apartamentoId: string;

  @ManyToOne(() => Apartment, (apartment) => apartment.reservas, { eager: true })
  @JoinColumn({ name: 'apartamentoId' })
  apartamento: Apartment;

  @Column({ type: 'date' })
  checkIn: string;

  @Column({ type: 'date' })
  checkOut: string;

  @Column({ type: 'int' })
  hospedes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valorTotal: number;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDENTE,
  })
  status: ReservationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
