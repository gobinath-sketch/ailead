import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './common/prisma.service';
import { PaymentsModule } from './payments/payments.module';
import { RegistrationsModule } from './registrations/registrations.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PaymentsModule, RegistrationsModule],
  providers: [PrismaService],
})
export class AppModule {}
