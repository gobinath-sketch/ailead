/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  async createLead(data: any) {
    const existingLead = await this.prisma.communityLead.findFirst({
      where: {
        OR: [{ email: data.email }, { whatsapp: data.whatsapp }],
      },
    });

    if (existingLead) {
      const field =
        existingLead.email === data.email ? 'Email' : 'WhatsApp number';
      throw new Error(`${field} is already registered in our community.`);
    }

    return await this.prisma.communityLead.create({
      data: {
        fullName: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        role: data.role,
        experience: data.experience,
        joinMastermind: data.joinMastermind,
        joinNewsletter: data.joinNewsletter,
      },
    });
  }
}
