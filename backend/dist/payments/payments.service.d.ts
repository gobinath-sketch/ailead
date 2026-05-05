import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
export declare class PaymentsService {
    private readonly configService;
    private readonly prisma;
    private readonly razorpay;
    constructor(configService: ConfigService, prisma: PrismaService);
    registrationFee(): {
        amountPaise: number;
        amountInr: number;
    };
    createOrder(dto: CreateOrderDto): Promise<{
        keyId: string | undefined;
        amount: number;
        currency: string;
        orderId: string;
        paymentId: string;
        description: string;
    }>;
    verifyPayment(dto: VerifyPaymentDto): Promise<{
        success: boolean;
        paymentId: string;
    }>;
    getPayment(paymentId: string): Promise<{
        fullName: string;
        email: string;
        phone: string;
        razorpayOrderId: string | null;
        razorpayPaymentId: string | null;
        razorpaySignature: string | null;
        amount: number;
        currency: string;
        id: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        source: import("@prisma/client").$Enums.PaymentSource;
        razorpayPaymentLinkId: string | null;
        razorpayRefundId: string | null;
        paymentMethod: string | null;
        payerVpa: string | null;
        payerAccountType: string | null;
        bankRrn: string | null;
        description: string | null;
        paidAt: Date | null;
        refundedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        rawWebhookPayload: import("@prisma/client/runtime/library").JsonValue | null;
    } | null>;
}
