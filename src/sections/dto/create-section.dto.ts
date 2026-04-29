import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

class TrainerPaymentAccountDto {
  @IsString()
  sessions: string;

  @IsString()
  accountNumber: string;
}

class TrainerDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  position: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrainerPaymentAccountDto)
  paymentAccounts?: TrainerPaymentAccountDto[];
}

class AbonementDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsString()
  currency: string;

  @IsString()
  duration: string;

  @IsOptional()
  @IsArray()
  features?: string[];

  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;
}

export class CreateSectionDto {
  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsString()
  shortDescription: string;

  @IsString()
  fullDescription: string;

  @IsString()
  ageInfo: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsArray()
  @IsOptional()
  heroImages?: string[];

  @IsArray()
  @IsOptional()
  gallery?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsString()
  @IsOptional()
  schedule?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AbonementDto)
  abonements?: AbonementDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrainerDto)
  trainers?: TrainerDto[];
}

export class UpdateSectionDto extends PartialType(CreateSectionDto) {}
