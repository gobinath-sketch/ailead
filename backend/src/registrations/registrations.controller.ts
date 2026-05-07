import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { RegistrationsService } from './registrations.service';

@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post()
  create(@Body() dto: CreateRegistrationDto) {
    return this.registrationsService.create(dto);
  }

  @Post('by-email')
  getByEmail(@Body() body: { email: string }) {
    return this.registrationsService.findByEmail(body.email);
  }

  @Get(':id/notifications')
  getNotifications(@Param('id') userId: string) {
    return this.registrationsService.getNotifications(userId);
  }
}
