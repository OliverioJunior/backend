import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { AppException } from '../common/exceptions/app.exception';
import { StudentsService } from './students.service';
import { Student } from '@prisma/client';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
@UseFilters(HttpExceptionFilter)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<{
    status: number;
    message: string;
    data: Student[];
  }> {
    try {
      const students = await this.studentsService.findAll();
      return {
        status: HttpStatus.OK,
        message: 'Estudantes encontrados com sucesso',
        data: students,
      };
    } catch (error) {
      throw AppException.internalError('Erro ao buscar estudantes', error);
    }
  }
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id') id: string,
  ): Promise<{ status: number; message: string; data: Student | null }> {
    try {
      const student = await this.studentsService.findOne(id);
      if (!student)
        throw AppException.notFound('Estudante não encontrado', student);
      return {
        status: HttpStatus.OK,
        message: 'Estudante encontrado com sucesso',
        data: student,
      };
    } catch (error) {
      throw AppException.internalError('Erro ao buscar estudantes', error);
    }
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() student: CreateStudentDto,
  ): Promise<{ status: number; message: string; data: Student }> {
    try {
      const studentCreated = await this.studentsService.create(student);
      return {
        status: HttpStatus.CREATED,
        message: 'Estudante criado com sucesso',
        data: studentCreated,
      };
    } catch (error) {
      if (error instanceof AppException) throw error;
      throw AppException.badRequest('Erro ao criar estudante', error);
    }
  }

  @Patch('/update/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<{ status: number; message: string; data: Student }> {
    try {
      const student = await this.studentsService.findOne(id);
      if (!student)
        throw AppException.notFound('Estudante não encontrado', student);
      const studentUpdated = await this.studentsService.update(
        id,
        updateStudentDto,
      );
      return {
        status: HttpStatus.OK,
        message: 'Estudante atualizado com sucesso',
        data: studentUpdated,
      };
    } catch (error) {
      if (error instanceof AppException) throw error;
      throw AppException.badRequest('Erro ao atualizar estudante', error);
    }
  }
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id') id: string,
  ): Promise<{ status: number; message: string; data: Student }> {
    try {
      const student = await this.studentsService.findOne(id);
      if (!student)
        throw AppException.notFound('Estudante não encontrado', student);

      const studentDeleted = await this.studentsService.delete(id);
      return {
        status: HttpStatus.OK,
        message: 'Estudante deletado com sucesso',
        data: studentDeleted,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof AppException) throw error;
      throw AppException.badRequest('Erro ao deletar estudante', error);
    }
  }
}
