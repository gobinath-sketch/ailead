import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class RegistrationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRegistrationDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: dto.paymentId },
    });

    if (!payment || payment.status !== PaymentStatus.PAID) {
      throw new BadRequestException(
        'Registration is allowed only after successful payment.',
      );
    }

    const existing = await this.prisma.registration.findUnique({
      where: { paymentId: dto.paymentId },
    });
    if (existing) {
      throw new BadRequestException('This payment is already used for registration.');
    }

    const duplicateUser = await this.prisma.registration.findFirst({
      where: { OR: [{ email: dto.email }, { phone: dto.phone }] }
    });
    if (duplicateUser) {
      const field = duplicateUser.email === dto.email ? 'Email' : 'Phone number';
      throw new BadRequestException(`${field} is already associated with another registration.`);
    }

    return this.prisma.registration.create({
      data: {
        paymentId: dto.paymentId,
        userType: dto.userType,
        fullName: dto.fullName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        password: dto.password,
        
        // Student
        collegeName: dto.collegeName,
        courseName: dto.courseName,
        studyYear: dto.studyYear,
        
        // Pro
        organization: dto.organization,
        role_title: dto.role_title,
        experience: dto.experience,
        domain: dto.domain,
        
        goals: dto.goals,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.registration.findFirst({
      where: { email },
      include: { payment: true }
    });
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
  }
}
