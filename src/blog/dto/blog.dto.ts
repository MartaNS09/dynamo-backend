import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpsertBlogPostDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsString()
  content: string;

  @IsOptional()
  featuredImage?: unknown;

  @IsOptional()
  gallery?: unknown;

  @IsOptional()
  author?: unknown;

  @IsOptional()
  category?: unknown;

  @IsOptional()
  tags?: unknown;

  @IsOptional()
  @IsString()
  publishedAt?: string;

  @IsOptional()
  readTime?: number;

  @IsOptional()
  views?: number;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @IsOptional()
  seo?: unknown;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
