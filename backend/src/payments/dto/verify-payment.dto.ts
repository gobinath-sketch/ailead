import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  razorpayOrderId!: string;

  @IsString()
  @IsNotEmpty()
  razorpayPaymentId!: string;

  @IsString()
  @IsNotEmpty()
  razorpaySignature!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Matches(/^[0-9]{10}$/)
  phone!: string;
}
