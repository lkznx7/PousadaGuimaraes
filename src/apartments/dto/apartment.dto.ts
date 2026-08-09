import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApartmentDto {
  @ApiProperty({ example: 'Suíte Luxo' })
  @IsString()
  nome: string;

  @ApiPropertyOptional({ example: '101' })
  @IsOptional()
  @IsString()
  numero?: string;

  @ApiPropertyOptional({ example: 'Ampla suíte com vista para o jardim' })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(1)
  capacidade: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantidadeCamas: number;

  @ApiProperty({ example: 250.0 })
  @IsNumber()
  @Min(0)
  precoDiaria: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fotos?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Wi-Fi', 'TV', 'Ar-condicionado'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  comodidades?: string[];

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

export class UpdateApartmentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  numero?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacidade?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantidadeCamas?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  precoDiaria?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fotos?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  comodidades?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

export class CheckAvailabilityDto {
  @ApiProperty({ example: '2026-07-15' })
  @IsString()
  checkIn: string;

  @ApiProperty({ example: '2026-07-20' })
  @IsString()
  checkOut: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  hospedes: number;
}
