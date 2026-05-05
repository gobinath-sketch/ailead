/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  async createLead(data: any) {
    return await (this.prisma as any).communityLead.create({
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
