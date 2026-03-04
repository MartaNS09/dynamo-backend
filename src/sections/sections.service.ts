import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto, UpdateSectionDto } from './dto/create-section.dto';

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  async create(createSectionDto: CreateSectionDto) {
    // Преобразуем массивы в JSON строки
    const data = {
      ...createSectionDto,
      heroImages: createSectionDto.heroImages
        ? JSON.stringify(createSectionDto.heroImages)
        : null,
      gallery: createSectionDto.gallery
        ? JSON.stringify(createSectionDto.gallery)
        : null,
    };

    return this.prisma.sportSection.create({
      data,
      include: {
        abonements: true,
        trainers: true,
      },
    });
  }

  async findAll() {
    const sections = await this.prisma.sportSection.findMany({
      include: {
        abonements: true,
        trainers: true,
      },
    });

    // Парсим JSON для каждой секции
    return sections.map((section) => ({
      ...section,
      heroImages: section.heroImages ? JSON.parse(section.heroImages) : [],
      gallery: section.gallery ? JSON.parse(section.gallery) : [],
      abonements:
        section.abonements?.map((a) => ({
          ...a,
          features: a.features ? JSON.parse(a.features) : [],
        })) || [],
    }));
  }

  async findOne(id: string) {
    const section = await this.prisma.sportSection.findUnique({
      where: { id },
      include: {
        abonements: true,
        trainers: true,
      },
    });

    if (!section) {
      throw new NotFoundException(`Секция с ID ${id} не найдена`);
    }

    // Парсим JSON обратно в массивы
    return {
      ...section,
      heroImages: section.heroImages ? JSON.parse(section.heroImages) : [],
      gallery: section.gallery ? JSON.parse(section.gallery) : [],
      abonements:
        section.abonements?.map((a) => ({
          ...a,
          features: a.features ? JSON.parse(a.features) : [],
        })) || [],
    };
  }

  async findBySlug(slug: string) {
    const section = await this.prisma.sportSection.findUnique({
      where: { slug },
      include: {
        abonements: true,
        trainers: true,
      },
    });

    if (!section) {
      throw new NotFoundException(`Секция с slug ${slug} не найдена`);
    }

    return {
      ...section,
      heroImages: section.heroImages ? JSON.parse(section.heroImages) : [],
      gallery: section.gallery ? JSON.parse(section.gallery) : [],
      abonements:
        section.abonements?.map((a) => ({
          ...a,
          features: a.features ? JSON.parse(a.features) : [],
        })) || [],
    };
  }

  async update(id: string, updateSectionDto: UpdateSectionDto) {
    const section = await this.prisma.sportSection.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException(`Секция с ID ${id} не найдена`);
    }

    // Убираем abonements и trainers из данных - их будем обновлять отдельно
    const { abonements, trainers, ...sectionData } = updateSectionDto;

    const data = {
      ...sectionData,
      heroImages: sectionData.heroImages
        ? JSON.stringify(sectionData.heroImages)
        : undefined,
      gallery: sectionData.gallery
        ? JSON.stringify(sectionData.gallery)
        : undefined,
    };

    // Обновляем только секцию, без связанных записей
    const updatedSection = await this.prisma.sportSection.update({
      where: { id },
      data,
      // Убираем include - не нужно подгружать abonements и trainers
    });

    // Возвращаем обновленную секцию (без abonements и trainers)
    return {
      ...updatedSection,
      heroImages: updatedSection.heroImages
        ? JSON.parse(updatedSection.heroImages)
        : [],
      gallery: updatedSection.gallery ? JSON.parse(updatedSection.gallery) : [],
      // Не возвращаем abonements и trainers
    };
  }

  async remove(id: string) {
    const section = await this.prisma.sportSection.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException(`Секция с ID ${id} не найдена`);
    }

    return this.prisma.sportSection.delete({
      where: { id },
    });
  }
}
