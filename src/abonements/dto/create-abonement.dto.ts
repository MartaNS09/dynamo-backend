import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAbonementDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  price: number;

  @IsString()
  currency: string;

  @IsString()
  duration: string;

  @IsArray()
  @IsOptional()
  features?: string[];

  @IsBoolean()
  @IsOptional()
  isPopular?: boolean;

  @IsString()
  sectionId: string;
}

export class UpdateAbonementDto extends PartialType(CreateAbonementDto) {}
