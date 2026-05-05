import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from '@prisma/client';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import { PrismaService } from '../common/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

const REGISTRATION_FEE_PAISE = 49900;

@Injectable()
export class PaymentsService {
  private readonly razorpay: Razorpay;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    if (!keyId || !keySecret) {
      throw new Error('Missing Razorpay credentials in environment variables.');
    }

    this.razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }

  registrationFee() {
    return {
      amountPaise: REGISTRATION_FEE_PAISE,
      amountInr: REGISTRATION_FEE_PAISE / 100,
    };
  }

  async createOrder(dto: CreateOrderDto) {
    const order = await this.razorpay.orders.create({
      amount: REGISTRATION_FEE_PAISE,
      currency: 'INR',
      receipt: `reg_${Date.now()}`,
      notes: {
        email: dto.email,
        fullName: dto.fullName,
        phone: dto.phone,
      },
    });

    const payment = await this.prisma.payment.create({
      data: {
        amount: REGISTRATION_FEE_PAISE,
        currency: 'INR',
        status: PaymentStatus.PENDING,
        razorpayOrderId: order.id,
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
      },
    });

    return {
      keyId: this.configService.get<string>('RAZORPAY_KEY_ID'),
      amount: REGISTRATION_FEE_PAISE,
      currency: 'INR',
      orderId: order.id,
      paymentId: payment.id,
      description: 'Global Knowledge Technologies - Event Registration',
    };
  }

  async verifyPayment(dto: VerifyPaymentDto) {
    const secret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    if (!secret) {
      throw new InternalServerErrorException(
        'Razorpay secret is not configured.',
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== dto.razorpaySignature) {
      throw new BadRequestException('Payment signature verification failed.');
    }

    const payment = await this.prisma.payment.findUnique({
      where: { razorpayOrderId: dto.razorpayOrderId },
    });
    if (!payment) {
      throw new BadRequestException('Payment order was not found.');
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.PAID,
        razorpayPaymentId: dto.razorpayPaymentId,
        razorpaySignature: dto.razorpaySignature,
        paidAt: new Date(),
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
      },
    });

    return { success: true, paymentId: payment.id };
  }

  async getPayment(paymentId: string) {
    return this.prisma.payment.findUnique({ where: { id: paymentId } });
  }
}
