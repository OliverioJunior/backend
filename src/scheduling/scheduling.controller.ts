import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import { AppException } from 'src/common/exceptions/app.exception';

@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Get()
  async findAll() {
    return await this.schedulingService.findAll();
  }

  @Get('scheduling/:id')
  async findOne(@Param('id') id: string) {
    const scheduling = await this.schedulingService.findOne(id);
    if (!scheduling) {
      throw AppException.notFound(`Agendamento não encontrado`);
    }
    return scheduling;
  }

  @Post()
  async create(@Body() createSchedulingDto: CreateSchedulingDto) {
    const scheduling = await this.schedulingService.create(createSchedulingDto);
    if (!scheduling) {
      throw AppException.badRequest('Erro ao criar o agendamento');
    }
    return {
      status: HttpStatus.CREATED,
      message: 'Agendamento criado com sucesso',
      data: scheduling,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSchedulingDto: UpdateSchedulingDto,
  ) {
    const scheduling = await this.schedulingService.findOne(id);
    if (!scheduling) {
      throw AppException.notFound(`Agendamento não encontrado`);
    }
    if (scheduling.status === updateSchedulingDto.status) {
      return {
        status: HttpStatus.CONFLICT,
        message: `Agendamento já ${updateSchedulingDto.status}`,
        data: null,
      };
    }
    const updatedScheduling = await this.schedulingService.update(
      id,
      updateSchedulingDto,
    );
    return {
      status: HttpStatus.OK,
      message: 'Agendamento atualizado com sucesso',
      data: updatedScheduling,
    };
  }

  @Get('student/:studentId')
  async findAllByStudent(@Param('studentId') studentId: string) {
    return await this.schedulingService.findAllByStudent(studentId);
  }

  @Get('/teacher/:id')
  async findAllByTeacher(@Param('id') id: string) {
    if (!id) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'ID do professor não informado',
        data: null,
      };
    }
    const schedulings = await this.schedulingService.findAllByTeacher(id);
    return {
      status: HttpStatus.OK,
      message: 'Busca realizada com sucesso',
      data: schedulings,
    };
  }
}
