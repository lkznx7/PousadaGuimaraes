import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { UploadsController } from './uploads.controller';

const uploadsPath = join(process.cwd(), 'uploads');

@Module({
  imports: [
    MulterModule.register({
      dest: uploadsPath,
    }),
    ConfigModule,
  ],
  controllers: [UploadsController],
})
export class UploadsModule {}
