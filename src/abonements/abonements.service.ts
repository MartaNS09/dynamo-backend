// const abonement = await this.prisma.abonement.create({
//   data,
// });

// // Возвращаем с распарсенными features
// return {
//   ...abonement,
//   features: abonement.features ? JSON.parse(abonement.features) : [],
// };

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAbonementDto,
  UpdateAbonementDto,
} from './dto/create-abonement.dto';

@Injectable()
export class AbonementsService {
  constructor(private prisma: PrismaService) {}

  async create(createAbonementDto: CreateAbonementDto) {
    // Преобразуем массив features в JSON строку
    const data = {
      ...createAbonementDto,
      features: createAbonementDto.features
        ? JSON.stringify(createAbonementDto.features)
        : null,
    };

    const abonement = await this.prisma.abonement.create({
      data,
    });

    return {
      ...abonement,
      features: abonement.features ? JSON.parse(abonement.features) : [],
    };
  }

  async findAll() {
    const abonements = await this.prisma.abonement.findMany();
    return abonements.map((abonement) => ({
      ...abonement,
      features: abonement.features ? JSON.parse(abonement.features) : [],
    }));
  }

  async findBySection(sectionId: string) {
    const abonements = await this.prisma.abonement.findMany({
      where: { sectionId },
    });
    return abonements.map((abonement) => ({
      ...abonement,
      features: abonement.features ? JSON.parse(abonement.features) : [],
    }));
  }

  async findOne(id: string) {
    const abonement = await this.prisma.abonement.findUnique({
      where: { id },
    });

    if (!abonement) {
      throw new NotFoundException(`Абонемент с ID ${id} не найден`);
    }

    return {
      ...abonement,
      features: abonement.features ? JSON.parse(abonement.features) : [],
    };
  }

  async update(id: string, updateAbonementDto: UpdateAbonementDto) {
    // Преобразуем массив features в JSON строку, если он есть
    const data = {
      ...updateAbonementDto,
      features: updateAbonementDto.features
        ? JSON.stringify(updateAbonementDto.features)
        : undefined,
    };

    const abonement = await this.prisma.abonement.update({
      where: { id },
      data,
    });

    return {
      ...abonement,
      features: abonement.features ? JSON.parse(abonement.features) : [],
    };
  }

  async remove(id: string) {
    const abonement = await this.prisma.abonement.findUnique({
      where: { id },
    });

    if (!abonement) {
      throw new NotFoundException(`Абонемент с ID ${id} не найден`);
    }

    return this.prisma.abonement.delete({
      where: { id },
    });
  }
}
