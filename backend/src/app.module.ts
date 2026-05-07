import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './common/prisma.service';
import { PaymentsModule } from './payments/payments.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { CommunityModule } from './community/community.module';
import { AuthModule } from './auth/auth.module';
import { LmsModule } from './lms/lms.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PaymentsModule,
    RegistrationsModule,
    CommunityModule,
    AuthModule,
    LmsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
