import {
  Injectable,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../infra/database/prisma.service';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { UpdateSchedulingDto } from './dto/update-scheduling.dto';
import { differenceInHours, startOfDay, endOfDay } from 'date-fns';
import { AppException } from 'src/common/exceptions/app.exception';

@Injectable()
export class SchedulingService {
  constructor(private prisma: PrismaService) {}

  async create(createSchedulingDto: CreateSchedulingDto) {
    const { dateTime, teacherId, studentId, content } = createSchedulingDto;
    const schedulingDate = new Date(dateTime);

    // Validar antecedência mínima de 24 horas
    const hoursUntilClass = differenceInHours(schedulingDate, new Date());
    if (hoursUntilClass < 24) {
      throw new BadRequestException(
        'O agendamento deve ser feito ou alterado com no mínimo 24 horas de antecedência',
      );
    }

    // Verificar limite de aulas do professor no dia
    const teacherSchedulings = await this.prisma.scheduling.count({
      where: {
        teacherId,
        dateTime: {
          gte: startOfDay(schedulingDate),
          lte: endOfDay(schedulingDate),
        },
        status: 'agendado',
      },
    });

    if (teacherSchedulings >= 2) {
      throw new ConflictException(
        'O professor já possui 2 aulas agendadas neste dia',
      );
    }

    const schedulingConflict = await this.prisma.scheduling.findFirst({
      where: {
        teacherId,
        dateTime: {
          equals: schedulingDate,
        },
        status: 'agendado',
      },
    });

    if (schedulingConflict) {
      throw new ConflictException('Já existe um agendamento para esse horário');
    }

    return await this.prisma.scheduling.create({
      data: {
        dateTime: schedulingDate,
        teacherId,
        studentId,
        content,
        status: 'agendado',
      },
      include: {
        teacher: true,
        student: true,
      },
    });
  }

  async update(id: string, updateSchedulingDto: UpdateSchedulingDto) {
    const scheduling = await this.prisma.scheduling.findUnique({
      where: { id },
    });

    if (!scheduling) {
      throw new BadRequestException('Agendamento não encontrado update');
    }

    // Validar se ainda é possível editar (24h antes)
    const hoursUntilClass = differenceInHours(scheduling.dateTime, new Date());

    if (hoursUntilClass > 0 && hoursUntilClass < 24) {
      throw new ForbiddenException(
        'Não é possível editar agendamentos com menos de 24 horas de antecedência',
      );
    }

    // Se houver alteração de data, validar regras de agendamento
    if (updateSchedulingDto.dateTime) {
      const newDate = new Date(updateSchedulingDto.dateTime);
      const hoursUntilNewClass = differenceInHours(newDate, new Date());

      if (hoursUntilNewClass > 0 && hoursUntilNewClass < 24) {
        throw AppException.badRequest(
          'O agendamento deve ser feito ou alterado com no mínimo 24 horas de antecedência',
        );
      }

      // Verificar limite de aulas do professor no novo dia
      const teacherSchedulings = await this.prisma.scheduling.count({
        where: {
          teacherId: updateSchedulingDto.teacherId || scheduling.teacherId,
          dateTime: {
            gte: startOfDay(newDate),
            lte: endOfDay(newDate),
          },
          status: 'agendado',
          NOT: { id: scheduling.id },
        },
      });

      if (teacherSchedulings >= 2) {
        throw new ConflictException(
          'O professor já possui 2 aulas agendadas neste dia',
        );
      }
    }

    return await this.prisma.scheduling.update({
      where: { id },
      data: updateSchedulingDto,
      include: {
        teacher: true,
        student: true,
      },
    });
  }

  async findAllByStudent(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw AppException.notFound('Estudante não encontrado');
    }
    return await this.prisma.scheduling.findMany({
      where: { studentId },
      include: {
        teacher: true,
        student: true,
      },
      orderBy: { dateTime: 'asc' },
    });
  }
  async findAllByTeacher(teacherId: string) {
    try {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: teacherId },
      });

      if (!teacher) {
        throw AppException.notFound('Professor não encontrado');
      }
      const schedulings = await this.prisma.scheduling.findMany({
        where: { teacherId },
        include: {
          teacher: true,
          student: true,
        },
        orderBy: { dateTime: 'asc' },
      });

      if (!schedulings) {
        return [];
      }
      return schedulings;
    } catch {
      return [];
    }
  }

  async findAll() {
    return await this.prisma.scheduling.findMany({
      include: {
        teacher: true,
        student: true,
      },
      orderBy: { dateTime: 'asc' },
    });
  }
  async findOne(id: string) {
    return await this.prisma.scheduling.findUnique({
      where: { id },
      include: {
        teacher: true,
        student: true,
      },
    });
  }
}
