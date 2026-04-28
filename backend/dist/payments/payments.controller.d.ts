import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    getFee(): {
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
    verify(dto: VerifyPaymentDto): Promise<{
        success: boolean;
        paymentId: string;
    }>;
    getPayment(paymentId: string): Promise<{
        amount: number;
        currency: string;
        email: string;
        fullName: string;
        phone: string;
        id: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        razorpayOrderId: string;
        razorpayPaymentId: string | null;
        razorpaySignature: string | null;
        paidAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
