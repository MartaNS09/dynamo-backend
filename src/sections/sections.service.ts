import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto, UpdateSectionDto } from './dto/create-section.dto';

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  private mapTrainerFromDb(trainer: any) {
    return {
      ...trainer,
      paymentAccounts: trainer.paymentAccounts
        ? JSON.parse(trainer.paymentAccounts)
        : [],
    };
  }

  private mapTrainerToDb(trainer: any, sectionId: string, order: number) {
    const normalizedAccounts = (trainer.paymentAccounts || [])
      .map((item: any) => ({
        sessions: item.sessions,
        accountNumber: item.accountNumber,
      }))
      .filter((item: any) => item.sessions && item.accountNumber);

    return {
      name: trainer.name,
      position: trainer.position,
      photo: trainer.photo || null,
      description: trainer.description || null,
      paymentAccounts:
        normalizedAccounts.length > 0 ? JSON.stringify(normalizedAccounts) : null,
      order,
      sectionId,
    };
  }

  async create(createSectionDto: CreateSectionDto) {
    const { abonements = [], trainers = [], ...sectionData } = createSectionDto;

    const data = {
      ...sectionData,
      heroImages: createSectionDto.heroImages
        ? JSON.stringify(createSectionDto.heroImages)
        : null,
      gallery: createSectionDto.gallery
        ? JSON.stringify(createSectionDto.gallery)
        : null,
    };

    const created = await this.prisma.sportSection.create({
      data,
    });

    if (abonements.length > 0) {
      await this.prisma.abonement.createMany({
        data: abonements.map((a) => ({
          name: a.name,
          description: a.description || null,
          price: a.price,
          currency: a.currency || 'BYN',
          duration: a.duration,
          features: a.features ? JSON.stringify(a.features) : null,
          isPopular: a.isPopular ?? false,
          sectionId: created.id,
        })),
      });
    }

    if (trainers.length > 0) {
      await this.prisma.trainer.createMany({
        data: trainers.map((t, index) => this.mapTrainerToDb(t, created.id, index)),
      });
    }

    return this.findOne(created.id);
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
      trainers: section.trainers?.map((t) => this.mapTrainerFromDb(t)) || [],
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
      trainers: section.trainers?.map((t) => this.mapTrainerFromDb(t)) || [],
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
      trainers: section.trainers?.map((t) => this.mapTrainerFromDb(t)) || [],
    };
  }

  async update(id: string, updateSectionDto: UpdateSectionDto) {
    const section = await this.prisma.sportSection.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException(`Секция с ID ${id} не найдена`);
    }

    const { abonements = [], trainers = [], ...sectionData } = updateSectionDto;

    const data = {
      ...sectionData,
      heroImages: sectionData.heroImages
        ? JSON.stringify(sectionData.heroImages)
        : undefined,
      gallery: sectionData.gallery
        ? JSON.stringify(sectionData.gallery)
        : undefined,
    };

    await this.prisma.sportSection.update({
      where: { id },
      data,
    });

    await this.prisma.abonement.deleteMany({ where: { sectionId: id } });
    await this.prisma.trainer.deleteMany({ where: { sectionId: id } });

    if (abonements.length > 0) {
      await this.prisma.abonement.createMany({
        data: abonements.map((a) => ({
          name: a.name,
          description: a.description || null,
          price: a.price,
          currency: a.currency || 'BYN',
          duration: a.duration,
          features: a.features ? JSON.stringify(a.features) : null,
          isPopular: a.isPopular ?? false,
          sectionId: id,
        })),
      });
    }

    if (trainers.length > 0) {
      await this.prisma.trainer.createMany({
        data: trainers.map((t, index) => this.mapTrainerToDb(t, id, index)),
      });
    }

    return this.findOne(id);
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
