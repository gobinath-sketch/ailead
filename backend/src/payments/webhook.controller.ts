/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Headers,
  Body,
  Req,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('razorpay')
  @HttpCode(200)
  async handleRazorpayWebhook(
    @Headers('x-razorpay-signature') signature: string,
    @Req() req: any,
    @Body() body: any,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing Razorpay signature header');
    }

    const rawBody = req.rawBody as Buffer | undefined;
    if (!rawBody) {
      throw new BadRequestException('Raw body not available');
    }

    return this.webhookService.handleEvent(signature, rawBody, body);
  }
}
