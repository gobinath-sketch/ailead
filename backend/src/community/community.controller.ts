/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Post, Body } from '@nestjs/common';
import { CommunityService } from './community.service';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post('lead')
  async createLead(@Body() data: any) {
    return this.communityService.createLead(data);
  }
}
