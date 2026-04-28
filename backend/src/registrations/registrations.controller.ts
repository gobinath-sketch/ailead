import { Body, Controller, Post } from '@nestjs/common';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { RegistrationsService } from './registrations.service';

@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post()
  create(@Body() dto: CreateRegistrationDto) {
    return this.registrationsService.create(dto);
  }
}
