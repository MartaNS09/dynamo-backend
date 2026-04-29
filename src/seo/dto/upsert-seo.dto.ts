import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpsertSeoDto {
  @IsString()
  path: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  keywords?: string;

  @IsOptional()
  @IsString()
  ogImage?: string;

  @IsOptional()
  @IsString()
  ogTitle?: string;

  @IsOptional()
  @IsString()
  ogDescription?: string;

  @IsOptional()
  @IsString()
  robots?: string;

  @IsOptional()
  @IsString()
  canonical?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
