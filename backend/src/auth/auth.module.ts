import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, EmailService, PrismaService],
})
export class AuthModule {}
