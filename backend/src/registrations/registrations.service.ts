import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class RegistrationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRegistrationDto) {
    const payment = await this.prisma.payment.findUnique({ where: { id: dto.paymentId } });

    if (!payment || payment.status !== PaymentStatus.PAID) {
      throw new BadRequestException('Registration is allowed only after successful payment.');
    }

    if (payment.email !== dto.email || payment.phone !== dto.phone) {
      throw new BadRequestException('Registration details must match paid user details.');
    }

    const existing = await this.prisma.registration.findUnique({ where: { paymentId: dto.paymentId } });
    if (existing) {
      throw new BadRequestException('This payment is already used for registration.');
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
}
