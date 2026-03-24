import { IsEmail, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class InitializePaystackPaymentDto {
  @IsEmail()
  email!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount!: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  donationId?: string;

  @IsString()
  @IsOptional()
  causeId?: string;

  @IsString()
  @IsOptional()
  donorId?: string;

  @IsString()
  @IsOptional()
  message?: string;
}
