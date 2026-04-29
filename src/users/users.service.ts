import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, InviteUserDto, UpdateUserDto } from './dto/users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private mapUser(user: any) {
    const { password, ...rest } = user;
    return {
      ...rest,
      permissions: rest.permissions ? JSON.parse(rest.permissions) : [],
    };
  }

  async findAll() {
    const users = await this.prisma.adminUser.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map((user) => this.mapUser(user));
  }

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.adminUser.findUnique({
      where: { email: dto.email },
    });
    if (exists) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const created = await this.prisma.adminUser.create({
      data: {
        email: dto.email,
        password: hashed,
        name: dto.name,
        role: dto.role,
        phone: dto.phone,
        position: dto.position,
        bio: dto.bio,
        isActive: true,
      },
    });
    return this.mapUser(created);
  }

  private generateTempPassword(length = 12) {
    const chars =
      'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < length; i += 1) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
  }

  async invite(dto: InviteUserDto) {
    const tempPassword = this.generateTempPassword();
    const user = await this.create({
      email: dto.email,
      name: dto.name,
      role: dto.role,
      password: tempPassword,
    });
    return {
      user,
      tempPassword,
      message: dto.message ?? null,
    };
  }

  async update(id: string, dto: UpdateUserDto) {
    const existing = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Пользователь ${id} не найден`);
    }
    const updated = await this.prisma.adminUser.update({
      where: { id },
      data: dto,
    });
    return this.mapUser(updated);
  }

  async remove(id: string) {
    const existing = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Пользователь ${id} не найден`);
    }
    return this.prisma.adminUser.delete({ where: { id } });
  }
}
