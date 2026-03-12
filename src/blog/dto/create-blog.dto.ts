import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBlogPostDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  content: string;

  @IsOptional()
  featuredImage?: any; // JSON объект

  @IsArray()
  @IsOptional()
  gallery?: string[];

  @IsOptional()
  author?: any; // JSON объект

  @IsOptional()
  category?: any; // JSON объект

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsDateString()
  @IsOptional()
  publishedAt?: string;

  @IsNumber()
  @IsOptional()
  readTime?: number;

  @IsNumber()
  @IsOptional()
  views?: number;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;

  @IsOptional()
  seo?: any; // JSON объект

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}

export class UpdateBlogPostDto extends PartialType(CreateBlogPostDto) {}
