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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import {
  CreateReservationDto,
  UpdateReservationStatusDto,
  FilterReservationsDto,
} from './dto/reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole, ReservationStatus } from '../common/enums';
import { CurrentUser } from '../common/decorators';

@ApiTags('Reservas')
@Controller('reservations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova reserva' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateReservationDto,
  ) {
    return this.reservationsService.create(userId, dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar todas as reservas (Admin)' })
  async findAll(@Query() filters: FilterReservationsDto) {
    return this.reservationsService.findAll(filters);
  }

  @Get('my')
  @ApiOperation({ summary: 'Listar minhas reservas' })
  async findMyReservations(@CurrentUser('id') userId: string) {
    return this.reservationsService.findByUser(userId);
  }

  @Get('dashboard')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Dashboard administrativo (Admin)' })
  async getDashboard() {
    return this.reservationsService.getDashboard();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter reserva por ID' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservationsService.findById(id);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancelar reserva' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return this.reservationsService.cancel(id, userId, userRole);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar status da reserva (Admin)' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReservationStatusDto,
  ) {
    return this.reservationsService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Excluir reserva (Admin)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.reservationsService.remove(id);
    return { message: 'Reserva excluída com sucesso' };
  }
}
