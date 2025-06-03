import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infra/database/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { Student } from '@prisma/client';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AppException } from '../common/exceptions/app.exception';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const existingStudent = await this.prisma.student.findUnique({
      where: { cpf: createStudentDto.cpf },
    });

    if (existingStudent) {
      throw new AppException('CPF já cadastrado no sistema');
    }

    createStudentDto.birthDate = new Date(createStudentDto.birthDate);
    return await this.prisma.student.create({
      data: createStudentDto,
    });
  }

  async findAll(): Promise<Student[]> {
    return await this.prisma.student.findMany();
  }

  async findOne(id: string): Promise<Student | null> {
    return await this.prisma.student.findUnique({
      where: { id },
    });
  }
  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    return await this.prisma.student.update({
      where: { id },
      data: updateStudentDto,
    });
  }
  async delete(id: string): Promise<Student> {
    const scheduling = await this.prisma.scheduling.findFirst({
      where: {
        studentId: id,
      },
    });
    if (scheduling) {
      throw new AppException('Estudante possui agendamentos');
    }
    return await this.prisma.student.delete({
      where: { id },
    });
  }
}
