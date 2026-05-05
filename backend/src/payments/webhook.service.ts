/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentSource, PaymentStatus } from '@prisma/client';
import * as crypto from 'crypto';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async handleEvent(signature: string, rawBody: Buffer, body: any) {
    // 1. Verify webhook authenticity
    const secret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET');
    if (secret) {
      const expectedSig = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (expectedSig !== signature) {
        this.logger.warn('Webhook signature mismatch — rejecting');
        throw new BadRequestException('Invalid webhook signature');
      }
    }

    const event = body.event as string;
    this.logger.log(`Razorpay webhook received: ${event}`);

    switch (event) {
      case 'payment.captured':
        await this.handlePaymentCaptured(body);
        break;
      case 'payment.failed':
        await this.handlePaymentFailed(body);
        break;
      case 'payment_link.paid':
        await this.handlePaymentLinkPaid(body);
        break;
      case 'refund.created':
      case 'refund.processed':
        await this.handleRefund(body);
        break;
      default:
        this.logger.log(`Unhandled event type: ${event}`);
    }

    return { received: true };
  }

  // ─── payment.captured (order-based payments) ───────────────────────────────
  private async handlePaymentCaptured(body: any) {
    const payment = body.payload?.payment?.entity;
    if (!payment) return;

    const {
      id: razorpayPaymentId,
      order_id: razorpayOrderId,
      amount,
      currency,
      method,
      vpa, // UPI VPA
      acquirer_data,
      contact: phone,
      email,
      description,
      notes,
    } = payment;

    const fullName = notes?.fullName || notes?.name || '';
    const rrn =
      acquirer_data?.rrn || acquirer_data?.bank_transaction_id || null;

    await this.upsertPayment({
      razorpayPaymentId,
      razorpayOrderId,
      amount,
      currency,
      status: PaymentStatus.PAID,
      source: PaymentSource.ORDER,
      fullName,
      email: email || notes?.email || '',
      phone: String(phone || notes?.phone || ''),
      paymentMethod: method,
      payerVpa: vpa || null,
      payerAccountType: acquirer_data?.payer_account_type || null,
      bankRrn: rrn,
      description,
      paidAt: new Date(payment.created_at * 1000),
      rawWebhookPayload: body,
    });
  }

  // ─── payment_link.paid (Payment Link payments) ─────────────────────────────
  private async handlePaymentLinkPaid(body: any) {
    const plEntity = body.payload?.payment_link?.entity;
    const payEntity = body.payload?.payment?.entity;
    if (!payEntity) return;

    const {
      id: razorpayPaymentId,
      amount,
      currency,
      method,
      vpa,
      contact: phone,
      email,
      description,
      acquirer_data,
      notes,
    } = payEntity;

    const fullName =
      plEntity?.customer?.name || notes?.fullName || notes?.name || '';
    const rrn =
      acquirer_data?.rrn || acquirer_data?.bank_transaction_id || null;

    await this.upsertPayment({
      razorpayPaymentId,
      razorpayOrderId: null,
      amount,
      currency,
      status: PaymentStatus.PAID,
      source: PaymentSource.PAYMENT_LINK,
      fullName,
      email: email || plEntity?.customer?.email || '',
      phone: String(phone || plEntity?.customer?.contact || ''),
      paymentMethod: method,
      payerVpa: vpa || null,
      payerAccountType: acquirer_data?.payer_account_type || null,
      bankRrn: rrn,
      razorpayPaymentLinkId: plEntity?.id || null,
      description: description || plEntity?.description || null,
      paidAt: new Date(payEntity.created_at * 1000),
      rawWebhookPayload: body,
    });
  }

  // ─── payment.failed ────────────────────────────────────────────────────────
  private async handlePaymentFailed(body: any) {
    const payment = body.payload?.payment?.entity;
    if (!payment) return;

    const { id: razorpayPaymentId, order_id: razorpayOrderId } = payment;

    // Try to update existing record, or create new failed record
    const existing = razorpayOrderId
      ? await this.prisma.payment.findUnique({ where: { razorpayOrderId } })
      : null;

    if (existing) {
      await this.prisma.payment.update({
        where: { id: existing.id },
        data: {
          status: PaymentStatus.FAILED,
          razorpayPaymentId,
          rawWebhookPayload: body,
          updatedAt: new Date(),
        },
      });
    } else {
      await this.upsertPayment({
        razorpayPaymentId,
        razorpayOrderId,
        amount: payment.amount,
        currency: payment.currency || 'INR',
        status: PaymentStatus.FAILED,
        source: PaymentSource.ORDER,
        fullName: payment.notes?.fullName || '',
        email: payment.email || payment.notes?.email || '',
        phone: String(payment.contact || payment.notes?.phone || ''),
        paymentMethod: payment.method || null,
        rawWebhookPayload: body,
      });
    }
  }

  // ─── refund.created / refund.processed ────────────────────────────────────
  private async handleRefund(body: any) {
    const refund = body.payload?.refund?.entity;
    if (!refund) return;

    const razorpayPaymentId = refund.payment_id;
    if (!razorpayPaymentId) return;

    await this.prisma.payment.updateMany({
      where: { razorpayPaymentId },
      data: {
        status: PaymentStatus.REFUNDED,
        razorpayRefundId: refund.id,
        refundedAt: new Date(),
        rawWebhookPayload: body,
      },
    });

    this.logger.log(`Refund recorded for payment ${razorpayPaymentId}`);
  }

  // ─── Upsert helper ─────────────────────────────────────────────────────────
  private async upsertPayment(data: {
    razorpayPaymentId?: string | null;
    razorpayOrderId?: string | null;
    amount: number;
    currency: string;
    status: PaymentStatus;
    source: PaymentSource;
    fullName: string;
    email: string;
    phone: string;
    paymentMethod?: string | null;
    payerVpa?: string | null;
    payerAccountType?: string | null;
    bankRrn?: string | null;
    razorpayPaymentLinkId?: string | null;
    description?: string | null;
    paidAt?: Date;
    rawWebhookPayload?: any;
  }) {
    const where = data.razorpayPaymentId
      ? { razorpayPaymentId: data.razorpayPaymentId }
      : data.razorpayOrderId
        ? { razorpayOrderId: data.razorpayOrderId }
        : null;

    const payload = {
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      source: data.source,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      razorpayPaymentId: data.razorpayPaymentId ?? undefined,
      razorpayOrderId: data.razorpayOrderId ?? undefined,
      paymentMethod: data.paymentMethod ?? undefined,
      payerVpa: data.payerVpa ?? undefined,
      payerAccountType: data.payerAccountType ?? undefined,
      bankRrn: data.bankRrn ?? undefined,
      razorpayPaymentLinkId: data.razorpayPaymentLinkId ?? undefined,
      description: data.description ?? undefined,
      paidAt: data.paidAt,
      rawWebhookPayload: data.rawWebhookPayload,
    };

    if (where) {
      const existing = await this.prisma.payment.findUnique({
        where: where as any,
      });
      if (existing) {
        await this.prisma.payment.update({
          where: { id: existing.id },
          data: payload,
        });
        this.logger.log(`Updated payment: ${existing.id}`);
        return;
      }
    }

    const created = await this.prisma.payment.create({ data: payload as any });
    this.logger.log(`Created payment: ${created.id}`);
  }
}
