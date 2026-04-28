import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RegistrationsController } from './registrations.controller';
import { RegistrationsService } from './registrations.service';

@Module({
  controllers: [RegistrationsController],
  providers: [RegistrationsService, PrismaService],
})
export class RegistrationsModule {}
