import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { Teacher } from '@prisma/client';
import { AppException } from '../common/exceptions/app.exception';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Controller('teachers')
@UseFilters(HttpExceptionFilter)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<{
    status: number;
    message: string;
    data: Teacher[];
  }> {
    try {
      return {
        status: HttpStatus.OK,
        message: 'Professores encontrados com sucesso',
        data: await this.teacherService.findAll(),
      };
    } catch (error) {
      if (error instanceof AppException) throw error;
      throw AppException.badRequest('Erro ao buscar os professores', error);
    }
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() teacher: CreateTeacherDto,
  ): Promise<{ status: number; message: string; data: Teacher }> {
    try {
      return {
        status: HttpStatus.CREATED,
        message: 'Professor criado com sucesso',
        data: await this.teacherService.create(teacher),
      };
    } catch (error) {
      if (error instanceof AppException) throw error;
      throw AppException.badRequest('Erro ao criar o professor', error);
    }
  }

  @Patch('/update/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() teacher: UpdateTeacherDto,
  ): Promise<{ status: number; message: string; data: Teacher }> {
    try {
      const teacherExist = await this.teacherService.findOne(id);
      if (!teacherExist) {
        throw AppException.notFound('Professor não encontrado para atualizar');
      }
      return {
        status: HttpStatus.OK,
        message: 'Professor atualizado com sucesso',
        data: await this.teacherService.update(id, teacher),
      };
    } catch (error) {
      if (error instanceof AppException) throw error;
      throw AppException.badRequest('Erro ao atualizar o professor', error);
    }
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id') id: string,
  ): Promise<{ status: number; message: string; data: Teacher }> {
    try {
      const teacher = await this.teacherService.findOne(id);
      if (!teacher) {
        throw AppException.notFound('Professor não encontrado para deletar');
      }

      const teacherDeleted = await this.teacherService.delete(id);
      if (!teacherDeleted) {
        throw AppException.badRequest('Erro ao deletar o professor');
      }
      return {
        status: HttpStatus.OK,
        message: 'Status do professor mudado para inativo com sucesso',
        data: teacherDeleted,
      };
    } catch (error) {
      if (error instanceof AppException) throw error;
      throw AppException.badRequest('Erro ao deletar o professor', error);
    }
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id') id: string,
  ): Promise<{ status: number; message: string; data: Teacher | null }> {
    try {
      return {
        status: HttpStatus.OK,
        message: 'Professor encontrado com sucesso',
        data: await this.teacherService.findOne(id),
      };
    } catch (error) {
      if (error instanceof AppException) throw error;
      throw AppException.badRequest('Erro ao buscar o professor', error);
    }
  }
}
