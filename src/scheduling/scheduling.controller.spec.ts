import { Test, TestingModule } from '@nestjs/testing';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('SchedulingController', () => {
  let controller: SchedulingController;
  let service: SchedulingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulingController],
      providers: [
        {
          provide: SchedulingService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SchedulingController>(SchedulingController);
    service = module.get<SchedulingService>(SchedulingService);
  });

  describe('POST /scheduling', () => {
    it('deve criar um agendamento com sucesso', async () => {
      const dto: CreateSchedulingDto = {
        dateTime: '2024-03-15T10:00:00Z',
        content: 'Aula de matemática',
        studentId: 'student-1',
        teacherId: 'teacher-1',
      };

      const spy = jest.spyOn(service, 'create');

      const result = await controller.create(dto);
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual({
        id: '1',
        status: 'agendado',
        dateTime: new Date('2024-03-15T10:00:00Z'),
        content: 'Aula de matemática',
        studentId: 'student-1',
        teacherId: 'teacher-1',
        student: {
          birthDate: new Date('2000-01-01'),
          firstName: 'John',
          lastName: 'Doe',
          phone: '123456789',
          email: 'EMAIL',
          cep: 'CEP',
          city: 'CIDADE',
          state: 'ESTADO',
          street: 'RUA',
          number: '123',
          cpf: 'CPF',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          whatsapp: 'WHATSAPP',
          id: 'student-1',
          neighborhood: 'BAIRRO',
        },
        teacher: {
          id: 'teacher-1',
          firstName: 'John',
          lastName: 'Doe',
          cpf: '12345678901',
          expertise: 'Matemática',
          status: 'ativo',
          birthDate: new Date('1990-01-01'),
          updatedAt: expect.any(Date),
          createdAt: expect.any(Date),
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    //   it('deve lidar com estudante menor de 16 anos', async () => {
    //     const dto: CreateSchedulingDto = {
    //       dateTime: '2024-03-20T10:00:00Z',
    //       teacherId: 'teacher-1',
    //       studentId: 'student-1',
    //       content: 'Aula de matemática',
    //     };

    //     jest.spyOn(service, 'create').mockResolvedValueOnce({
    //       ...dto,
    //       id: '1',
    //       status: 'agendado',
    //       dateTime: new Date(dto.dateTime),
    //       student: { birthDate: new Date('2010-01-01') },
    //     });

    //     const result = await controller.create(dto);
    //     expect(result.student).toHaveProperty('birthDate');
    //   });

    //   it('deve retornar erro 400 por antecedência insuficiente', async () => {
    //     const dto: CreateSchedulingDto = {
    //       dateTime: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
    //       teacherId: 'teacher-1',
    //       studentId: 'student-1',
    //       content: 'Aula inválida',
    //     };

    //     jest
    //       .spyOn(service, 'create')
    //       .mockRejectedValueOnce(
    //         new BadRequestException(
    //           'O agendamento deve ser feito com no mínimo 24 horas de antecedência',
    //         ),
    //       );

    //     await expect(controller.create(dto)).rejects.toThrow(BadRequestException);
    //   });

    //   it('deve retornar erro 409 por limite de agendamentos do professor', async () => {
    //     const dto: CreateSchedulingDto = {
    //       dateTime: '2024-03-20T10:00:00Z',
    //       teacherId: 'teacher-1',
    //       studentId: 'student-1',
    //       content: 'Aula de português',
    //     };

    //     jest
    //       .spyOn(service, 'create')
    //       .mockRejectedValueOnce(
    //         new ConflictException(
    //           'O professor já possui 2 aulas agendadas neste dia',
    //         ),
    //       );

    //     await expect(controller.create(dto)).rejects.toThrow(ConflictException);
    //   });
  });
});
