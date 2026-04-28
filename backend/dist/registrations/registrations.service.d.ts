import { PrismaService } from '../common/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
export declare class RegistrationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateRegistrationDto): Promise<{
        email: string;
        fullName: string;
        phone: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentId: string;
        organization: string | null;
        role: string | null;
        goals: string | null;
    }>;
}
