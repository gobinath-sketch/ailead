"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../common/prisma.service");
let RegistrationsService = class RegistrationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: dto.paymentId },
        });
        if (!payment || payment.status !== client_1.PaymentStatus.PAID) {
            throw new common_1.BadRequestException('Registration is allowed only after successful payment.');
        }
        if (payment.email !== dto.email || payment.phone !== dto.phone) {
            throw new common_1.BadRequestException('Registration details must match paid user details.');
        }
        const existing = await this.prisma.registration.findUnique({
            where: { paymentId: dto.paymentId },
        });
        if (existing) {
            throw new common_1.BadRequestException('This payment is already used for registration.');
        }
        return this.prisma.registration.create({
            data: {
                paymentId: dto.paymentId,
                fullName: dto.fullName,
                email: dto.email,
                phone: dto.phone,
                organization: dto.organization,
                role: dto.role,
                goals: dto.goals,
            },
        });
    }
};
exports.RegistrationsService = RegistrationsService;
exports.RegistrationsService = RegistrationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RegistrationsService);
//# sourceMappingURL=registrations.service.js.map