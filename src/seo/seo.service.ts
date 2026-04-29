import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertSeoDto } from './dto/upsert-seo.dto';
import { DEFAULT_SEO_SEED } from './seo.defaults';

@Injectable()
export class SeoService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.seoData.findMany({
      orderBy: { page: 'asc' },
    });
  }

  findByPage(page: string) {
    return this.prisma.seoData.findUnique({
      where: { page },
    });
  }

  upsert(page: string, dto: UpsertSeoDto, updatedBy?: string) {
    return this.prisma.seoData.upsert({
      where: { page },
      update: {
        ...dto,
        updatedBy: updatedBy ?? 'system',
      },
      create: {
        page,
        ...dto,
        updatedBy: updatedBy ?? 'system',
      },
    });
  }

  async initializeDefaults(updatedBy = 'system') {
    let created = 0;
    let existed = 0;

    for (const item of DEFAULT_SEO_SEED) {
      const existing = await this.prisma.seoData.findUnique({
        where: { page: item.page },
      });

      if (existing) {
        existed += 1;
        continue;
      }

      await this.prisma.seoData.create({
        data: {
          page: item.page,
          path: item.path,
          title: item.title,
          description: item.description,
          keywords: item.keywords,
          robots: item.robots ?? 'index, follow',
          isActive: item.isActive ?? true,
          updatedBy,
        },
      });

      created += 1;
    }

    return {
      total: DEFAULT_SEO_SEED.length,
      created,
      existed,
    };
  }
}
