import { CreateRegistrationDto } from './dto/create-registration.dto';
import { RegistrationsService } from './registrations.service';
export declare class RegistrationsController {
    private readonly registrationsService;
    constructor(registrationsService: RegistrationsService);
    create(dto: CreateRegistrationDto): Promise<{
        fullName: string;
        email: string;
        phone: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentId: string;
        organization: string | null;
        role: string | null;
        goals: string | null;
        experience: string | null;
    }>;
}
