import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateRegistrationDto {
  @IsString()
  @IsNotEmpty()
  paymentId!: string;

  @IsString()
  @IsNotEmpty()
  userType!: string; // student or professional

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  fullName!: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Matches(/^[0-9]{10}$/)
  phone!: string;

  @IsString()
  @IsOptional()
  password?: string;

  // Student Specific
  @IsString()
  @IsOptional()
  collegeName?: string;

  @IsString()
  @IsOptional()
  courseName?: string;

  @IsString()
  @IsOptional()
  studyYear?: string;

  // Professional Specific
  @IsString()
  @IsOptional()
  organization?: string;

  @IsString()
  @IsOptional()
  role_title?: string;

  @IsString()
  @IsOptional()
  experience?: string;

  @IsString()
  @IsOptional()
  domain?: string;

  @IsString()
  @IsOptional()
  goals?: string;
}
