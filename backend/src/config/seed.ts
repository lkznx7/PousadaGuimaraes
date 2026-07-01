import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Apartment } from '../apartments/entities/apartment.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { UserRole } from '../common/enums';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER || 'nestuser',
    password: process.env.POSTGRES_PASSWORD || 'nestpassword',
    database: process.env.POSTGRES_DB || 'nestdb',
    entities: [User, Apartment, Reservation],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('Database connected for seeding...');

  const userRepo = dataSource.getRepository(User);
  const apartmentRepo = dataSource.getRepository(Apartment);

  const adminExists = await userRepo.findOne({ where: { email: 'admin@pousada.com' } });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await userRepo.save(
      userRepo.create({
        nome: 'Administrador',
        email: 'admin@pousada.com',
        senha: hashedPassword,
        role: UserRole.ADMIN,
      }),
    );
    console.log('Admin user created: admin@pousada.com / admin123');
  }

  const clienteExists = await userRepo.findOne({ where: { email: 'cliente@email.com' } });
  if (!clienteExists) {
    const hashedPassword = await bcrypt.hash('cliente123', 10);
    await userRepo.save(
      userRepo.create({
        nome: 'Cliente Teste',
        email: 'cliente@email.com',
        senha: hashedPassword,
        telefone: '(11) 99999-9999',
        role: UserRole.CLIENTE,
      }),
    );
    console.log('Client user created: cliente@email.com / cliente123');
  }

  const apartmentCount = await apartmentRepo.count();
  if (apartmentCount === 0) {
    const apartments = [
      {
        nome: 'Suíte Standard',
        numero: '101',
        descricao: 'Acomodação confortável com cama casal, banheiro privativo e vista para o jardim.',
        capacidade: 2,
        quantidadeCamas: 1,
        precoDiaria: 180.0,
        fotos: [],
        comodidades: ['Wi-Fi', 'TV', 'Frigobar', 'Ventilador'],
        ativo: true,
      },
      {
        nome: 'Suíte Luxo',
        numero: '201',
        descricao: 'Espaço amplo com decoração sofisticada, cama queen e varanda com vista panorâmica.',
        capacidade: 3,
        quantidadeCamas: 1,
        precoDiaria: 280.0,
        fotos: [],
        comodidades: ['Wi-Fi', 'TV', 'Ar-condicionado', 'Frigobar', 'Varanda', 'Cofre'],
        ativo: true,
      },
      {
        nome: 'Quarto Família',
        numero: '301',
        descricao: 'Ideal para famílias, com duas camas de casal e espaço para crianças.',
        capacidade: 5,
        quantidadeCamas: 2,
        precoDiaria: 350.0,
        fotos: [],
        comodidades: ['Wi-Fi', 'TV', 'Ar-condicionado', 'Frigobar', 'Banheira'],
        ativo: true,
      },
      {
        nome: 'Quarto Econômico',
        numero: '102',
        descricao: 'Opção simples e aconchegante, perfeita para quem busca praticidade.',
        capacidade: 2,
        quantidadeCamas: 1,
        precoDiaria: 120.0,
        fotos: [],
        comodidades: ['Wi-Fi', 'TV', 'Ventilador'],
        ativo: true,
      },
    ];

    for (const apt of apartments) {
      await apartmentRepo.save(apartmentRepo.create(apt));
    }
    console.log('Sample apartments created with amenities');
  }

  await dataSource.destroy();
  console.log('Seeding completed!');
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
