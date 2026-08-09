import { IsString, IsNumber, IsOptional, IsEnum, Min, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReservationStatus } from '../../common/enums';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @ApiProperty({ example: 'uuid-do-apartamento' })
  @IsString()
  apartamentoId: string;

  @ApiProperty({ example: '2026-07-15' })
  @IsDateString()
  checkIn: string;

  @ApiProperty({ example: '2026-07-20' })
  @IsDateString()
  checkOut: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  hospedes: number;
}

export class UpdateReservationStatusDto {
  @ApiProperty({ enum: ReservationStatus })
  @IsEnum(ReservationStatus)
  status: ReservationStatus;
}

export class FilterReservationsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: ReservationStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  apartamentoId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  usuarioId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  checkIn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  checkOut?: string;
}
