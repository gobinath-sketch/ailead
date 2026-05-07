import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { EmailService } from './email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async sendOtp(email: string, name: string, phone: string) {
    // Check if email or phone already registered
    const existingRegistration = await this.prisma.registration.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingRegistration) {
      const field =
        existingRegistration.email === email ? 'Email' : 'Phone number';
      throw new BadRequestException(
        `${field} is already registered. Please check your dashboard.`,
      );
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Set expiration to 10 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Upsert the OTP verification record
    await this.prisma.otpVerification.upsert({
      where: { email },
      update: {
        otp,
        expiresAt,
        createdAt: new Date(),
      },
      create: {
        email,
        otp,
        expiresAt,
      },
    });

    // Send the email
    await this.emailService.sendOtpEmail(email, name, otp);

    return { success: true, message: 'OTP sent successfully to email' };
  }

  async verifyOtp(email: string, otp: string) {
    const record = await this.prisma.otpVerification.findUnique({
      where: { email },
    });

    if (!record) {
      throw new BadRequestException('OTP record not found for this email');
    }

    if (record.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (new Date() > record.expiresAt) {
      throw new BadRequestException('OTP has expired');
    }

    // OTP verified successfully, we can optionally delete it
    await this.prisma.otpVerification.delete({
      where: { email },
    });

    return { success: true, message: 'OTP verified successfully' };
  }

  async loginOtp(email: string) {
    // Check if user is registered
    const user = await this.prisma.registration.findFirst({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException(
        'No registration found for this email. Please register first.',
      );
    }

    // Generate a 4-digit numeric OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Set expiration to 10 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Upsert the OTP verification record
    await this.prisma.otpVerification.upsert({
      where: { email },
      update: { otp, expiresAt, createdAt: new Date() },
      create: { email, otp, expiresAt },
    });

    // Send the email
    await this.emailService.sendOtpEmail(email, user.fullName, otp);

    return { success: true, message: 'Login OTP sent to your email.' };
  }

  async loginWithPassword(email: string, password: string) {
    const user = await this.prisma.registration.findFirst({
      where: { email },
      include: { payment: true },
    });

    if (!user) {
      throw new BadRequestException(
        "Looks like you haven't registered yet — secure your access first!",
      );
    }

    if (user.password !== password) {
      throw new BadRequestException(
        'Incorrect password. Please try again or use "Forgot?" to reset it.',
      );
    }

    return { success: true, user };
  }

  async updatePassword(email: string, password: string) {
    await this.prisma.registration.updateMany({
      where: { email },
      data: { password },
    });
    return { success: true, message: 'Password updated successfully.' };
  }
}
