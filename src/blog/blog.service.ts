import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertBlogPostDto } from './dto/blog.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  private parseJson<T>(value: string | null): T | undefined {
    if (!value) return undefined;
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  }

  private map(row: any) {
    return {
      ...row,
      excerpt: row.excerpt ?? '',
      featuredImage: this.parseJson(row.featuredImage) ?? { url: '', alt: '' },
      gallery: this.parseJson(row.gallery) ?? [],
      author: this.parseJson(row.author) ?? { name: '' },
      category: this.parseJson(row.category) ?? {
        id: 'articles',
        name: 'Статьи',
        slug: 'articles',
        color: '#06b6d4',
      },
      tags: this.parseJson(row.tags) ?? [],
      seo: this.parseJson(row.seo),
      publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    };
  }

  async findAll() {
    const rows = await this.prisma.blogPost.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map((row) => this.map(row));
  }

  async findOne(id: string) {
    const row = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException(`Пост ${id} не найден`);
    }
    return this.map(row);
  }

  async create(dto: UpsertBlogPostDto) {
    const row = await this.prisma.blogPost.create({
      data: {
        slug: dto.slug,
        title: dto.title,
        excerpt: dto.excerpt,
        content: dto.content,
        featuredImage: dto.featuredImage ? JSON.stringify(dto.featuredImage) : null,
        gallery: dto.gallery ? JSON.stringify(dto.gallery) : null,
        author: dto.author ? JSON.stringify(dto.author) : null,
        category: dto.category ? JSON.stringify(dto.category) : null,
        tags: dto.tags ? JSON.stringify(dto.tags) : null,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
        readTime: dto.readTime,
        views: dto.views ?? 0,
        isFeatured: dto.isFeatured ?? false,
        isPinned: dto.isPinned ?? false,
        seo: dto.seo ? JSON.stringify(dto.seo) : null,
        published: dto.published ?? true,
      },
    });
    return this.map(row);
  }

  async update(id: string, dto: UpsertBlogPostDto) {
    await this.findOne(id);
    const row = await this.prisma.blogPost.update({
      where: { id },
      data: {
        slug: dto.slug,
        title: dto.title,
        excerpt: dto.excerpt,
        content: dto.content,
        featuredImage: dto.featuredImage ? JSON.stringify(dto.featuredImage) : null,
        gallery: dto.gallery ? JSON.stringify(dto.gallery) : null,
        author: dto.author ? JSON.stringify(dto.author) : null,
        category: dto.category ? JSON.stringify(dto.category) : null,
        tags: dto.tags ? JSON.stringify(dto.tags) : null,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
        readTime: dto.readTime,
        views: dto.views ?? 0,
        isFeatured: dto.isFeatured ?? false,
        isPinned: dto.isPinned ?? false,
        seo: dto.seo ? JSON.stringify(dto.seo) : null,
        published: dto.published ?? true,
      },
    });
    return this.map(row);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.blogPost.delete({ where: { id } });
  }
}
