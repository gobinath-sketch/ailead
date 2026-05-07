import { Module } from '@nestjs/common';
import { LmsController } from './lms.controller';
import { LmsService } from './lms.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [LmsController],
  providers: [LmsService, PrismaService],
})
export class LmsModule {}
