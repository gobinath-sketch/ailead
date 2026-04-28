import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateOrderDto {
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
