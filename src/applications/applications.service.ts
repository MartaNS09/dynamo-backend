import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AddApplicationNoteDto,
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from './dto/applications.dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  private parseJsonField<T>(value: string | null): T | undefined {
    if (!value) {
      return undefined;
    }
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  }

  private mapApplication(entity: any) {
    return {
      ...entity,
      selectedAbonement: this.parseJsonField(entity.selectedAbonement),
      statusHistory: this.parseJsonField(entity.statusHistory) ?? [],
      managerNotes: this.parseJsonField(entity.managerNotes) ?? [],
    };
  }

  async findAll() {
    const rows = await this.prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => this.mapApplication(row));
  }

  async findOne(id: string) {
    const row = await this.prisma.application.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException(`Заявка с ID ${id} не найдена`);
    }
    return this.mapApplication(row);
  }

  async create(dto: CreateApplicationDto) {
    const now = new Date().toISOString();
    const source = dto.source ?? 'enrollment_form';
    const created = await this.prisma.application.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        childAge: dto.childAge,
        sport: dto.sport,
        message: dto.message,
        selectedAbonement: dto.selectedAbonement
          ? JSON.stringify(dto.selectedAbonement)
          : null,
        source,
        sectionId: dto.sectionId,
        sectionName: dto.sectionName,
        status: 'new',
        statusHistory: JSON.stringify([
          {
            status: 'new',
            changedAt: now,
            comment: 'Заявка создана',
          },
        ]),
        managerNotes: JSON.stringify([]),
      },
    });

    return this.mapApplication(created);
  }

  async updateStatus(id: string, dto: UpdateApplicationStatusDto, actor?: string) {
    const existing = await this.prisma.application.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Заявка с ID ${id} не найдена`);
    }

    const history =
      this.parseJsonField<any[]>(existing.statusHistory)?.slice() ?? [];
    history.push({
      status: dto.status,
      changedAt: new Date().toISOString(),
      changedBy: actor ?? 'system',
      changedByName: actor ?? 'Система',
      comment: dto.comment,
    });

    const updated = await this.prisma.application.update({
      where: { id },
      data: {
        status: dto.status,
        statusHistory: JSON.stringify(history),
      },
    });

    return this.mapApplication(updated);
  }

  async addNote(id: string, dto: AddApplicationNoteDto, actor?: string) {
    const existing = await this.prisma.application.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Заявка с ID ${id} не найдена`);
    }

    const notes = this.parseJsonField<any[]>(existing.managerNotes)?.slice() ?? [];
    notes.push({
      id: `note_${Date.now()}`,
      text: dto.text,
      createdAt: new Date().toISOString(),
      createdBy: actor ?? 'system',
      createdByName: actor ?? 'Система',
    });

    const updated = await this.prisma.application.update({
      where: { id },
      data: {
        managerNotes: JSON.stringify(notes),
      },
    });

    return this.mapApplication(updated);
  }

  async remove(id: string) {
    const existing = await this.prisma.application.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Заявка с ID ${id} не найдена`);
    }
    return this.prisma.application.delete({ where: { id } });
  }
}
