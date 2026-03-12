import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrainerDto, UpdateTrainerDto } from './dto/create-trainer.dto';

@Injectable()
export class TrainersService {
  constructor(private prisma: PrismaService) {}

  async create(createTrainerDto: CreateTrainerDto) {
    return this.prisma.trainer.create({
      data: createTrainerDto,
    });
  }

  async findAll() {
    return this.prisma.trainer.findMany();
  }

  async findOne(id: string) {
    const trainer = await this.prisma.trainer.findUnique({
      where: { id },
    });

    if (!trainer) {
      throw new NotFoundException(`Тренер с ID ${id} не найден`);
    }

    return trainer;
  }

  async findBySection(sectionId: string) {
    return this.prisma.trainer.findMany({
      where: { sectionId },
      orderBy: { order: 'asc' },
    });
  }

  async update(id: string, updateTrainerDto: UpdateTrainerDto) {
    const trainer = await this.prisma.trainer.findUnique({
      where: { id },
    });

    if (!trainer) {
      throw new NotFoundException(`Тренер с ID ${id} не найден`);
    }

    return this.prisma.trainer.update({
      where: { id },
      data: updateTrainerDto,
    });
  }

  async remove(id: string) {
    const trainer = await this.prisma.trainer.findUnique({
      where: { id },
    });

    if (!trainer) {
      throw new NotFoundException(`Тренер с ID ${id} не найден`);
    }

    return this.prisma.trainer.delete({
      where: { id },
    });
  }
}
