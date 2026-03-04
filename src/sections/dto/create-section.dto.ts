import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

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
}

export class UpdateSectionDto extends PartialType(CreateSectionDto) {}
