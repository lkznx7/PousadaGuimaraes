import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ApartmentsService } from './apartments.service';
import { CreateApartmentDto, UpdateApartmentDto, CheckAvailabilityDto } from './dto/apartment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Apartamentos')
@Controller('apartments')
export class ApartmentsController {
  constructor(private apartmentsService: ApartmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os apartamentos' })
  async findAll() {
    return this.apartmentsService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Listar apartamentos ativos' })
  async findActive() {
    return this.apartmentsService.findActive();
  }

  @Get('available')
  @ApiOperation({ summary: 'Verificar apartamentos disponíveis' })
  @ApiQuery({ name: 'checkIn', example: '2026-07-15' })
  @ApiQuery({ name: 'checkOut', example: '2026-07-20' })
  @ApiQuery({ name: 'hospedes', example: 2 })
  async findAvailable(
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
    @Query('hospedes') hospedes: number,
  ) {
    return this.apartmentsService.findAvailable(checkIn, checkOut, Number(hospedes));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter apartamento por ID' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.apartmentsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar apartamento (Admin)' })
  async create(@Body() dto: CreateApartmentDto) {
    return this.apartmentsService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Editar apartamento (Admin)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateApartmentDto,
  ) {
    return this.apartmentsService.update(id, dto);
  }

  @Put(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ativar/Desativar apartamento (Admin)' })
  async toggleActive(@Param('id', ParseUUIDPipe) id: string) {
    return this.apartmentsService.toggleActive(id);
  }

  @Put(':id/photos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reordenar fotos do apartamento (Admin)' })
  async updatePhotos(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('fotos') fotos: string[],
  ) {
    return this.apartmentsService.updatePhotos(id, fotos);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir apartamento (Admin)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.apartmentsService.remove(id);
    return { message: 'Apartamento excluído com sucesso' };
  }
}
