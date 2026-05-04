"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const crypto = __importStar(require("crypto"));
const razorpay_1 = __importDefault(require("razorpay"));
const prisma_service_1 = require("../common/prisma.service");
const REGISTRATION_FEE_PAISE = 49900;
let PaymentsService = class PaymentsService {
    configService;
    prisma;
    razorpay;
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        const keyId = this.configService.get('RAZORPAY_KEY_ID');
        const keySecret = this.configService.get('RAZORPAY_KEY_SECRET');
        if (!keyId || !keySecret) {
            throw new Error('Missing Razorpay credentials in environment variables.');
        }
        this.razorpay = new razorpay_1.default({ key_id: keyId, key_secret: keySecret });
    }
    registrationFee() {
        return { amountPaise: REGISTRATION_FEE_PAISE, amountInr: REGISTRATION_FEE_PAISE / 100 };
    }
    async createOrder(dto) {
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
                status: client_1.PaymentStatus.PENDING,
                razorpayOrderId: order.id,
                fullName: dto.fullName,
                email: dto.email,
                phone: dto.phone,
            },
        });
        return {
            keyId: this.configService.get('RAZORPAY_KEY_ID'),
            amount: REGISTRATION_FEE_PAISE,
            currency: 'INR',
            orderId: order.id,
            paymentId: payment.id,
            description: 'Global Knowledge Technologies - Event Registration',
        };
    }
    async verifyPayment(dto) {
        const secret = this.configService.get('RAZORPAY_KEY_SECRET');
        if (!secret) {
            throw new common_1.InternalServerErrorException('Razorpay secret is not configured.');
        }
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
            .digest('hex');
        if (expectedSignature !== dto.razorpaySignature) {
            throw new common_1.BadRequestException('Payment signature verification failed.');
        }
        const payment = await this.prisma.payment.findUnique({ where: { razorpayOrderId: dto.razorpayOrderId } });
        if (!payment) {
            throw new common_1.BadRequestException('Payment order was not found.');
        }
        await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: client_1.PaymentStatus.PAID,
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
    async getPayment(paymentId) {
        return this.prisma.payment.findUnique({ where: { id: paymentId } });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map