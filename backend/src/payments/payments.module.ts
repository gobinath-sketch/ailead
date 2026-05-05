import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  controllers: [PaymentsController, WebhookController],
  providers: [PaymentsService, PrismaService, WebhookService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
