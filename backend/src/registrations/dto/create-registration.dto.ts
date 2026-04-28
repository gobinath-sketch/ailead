import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateRegistrationDto {
  @IsString()
  @IsNotEmpty()
  paymentId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Matches(/^[0-9]{10}$/)
  phone!: string;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  organization?: string;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  role?: string;

  @IsString()
  @IsOptional()
  goals?: string;
}
