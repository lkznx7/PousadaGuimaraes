import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('apartments')
export class Apartment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ nullable: true })
  numero: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'int' })
  capacidade: number;

  @Column({ type: 'int' })
  quantidadeCamas: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precoDiaria: number;

  @Column('simple-array', { nullable: true })
  fotos: string[];

  @Column('simple-array', { nullable: true })
  comodidades: string[];

  @Column({ default: true })
  ativo: boolean;

  @OneToMany(() => Reservation, (reservation) => reservation.apartamento)
  reservas: Reservation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
