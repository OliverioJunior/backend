import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infra/database/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { Teacher } from '@prisma/client';
import { AppException } from '../common/exceptions/app.exception';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const existingTeacher = await this.prisma.teacher.findUnique({
      where: { cpf: createTeacherDto.cpf },
    });
    if (existingTeacher) {
      throw new AppException('CPF já cadastrado no sistema');
    }

    createTeacherDto.birthDate = new Date(createTeacherDto.birthDate);
    return await this.prisma.teacher.create({
      data: createTeacherDto,
    });
  }

  async findAll(): Promise<Teacher[]> {
    return await this.prisma.teacher.findMany();
  }

  async findOne(id: string): Promise<Teacher | null> {
    return await this.prisma.teacher.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    return await this.prisma.teacher.update({
      where: { id },
      data: updateTeacherDto,
    });
  }

  async delete(id: string): Promise<Teacher | null> {
    try {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id },
      });

      if (!teacher) {
        throw new AppException('Professor não encontrado');
      }
      if (teacher.status === 'inactive') {
        throw new AppException('Professor já está inativo');
      }
      const teacherDeleted = await this.prisma.teacher.update({
        where: { id },
        data: {
          status: 'inactive',
          updatedAt: new Date(),
        },
      });

      return teacherDeleted;
    } catch (error) {
      if (error instanceof Error) {
        throw new AppException(error.message);
      }
      return null;
    }
  }
}
