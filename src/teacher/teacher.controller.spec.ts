import { Test, TestingModule } from '@nestjs/testing';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { PrismaService } from '../infra/database/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { AppException } from '../common/exceptions/app.exception';

describe('TeacherController', () => {
  let teacherController: TeacherController;
  let teacherService: TeacherService;

  const mockPrismaService = {
    teacher: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findOne: jest.fn(),
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TeacherController],
      providers: [
        TeacherService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    teacherController = app.get<TeacherController>(TeacherController);
    teacherService = app.get<TeacherService>(TeacherService);
  });

  describe('createTeacher', () => {
    it("Retorna error ao tentar criar dois professores com o mesmo 'CPF", async () => {
      const existingTeacher: CreateTeacherDto = {
        cpf: '07222573500',
        firstName: 'João',
        lastName: 'Silva',
        birthDate: new Date('1990-01-01'),
        status: 'active',
        expertise: 'Matemática',
      };
      const newTeacher: CreateTeacherDto = {
        ...existingTeacher,
        firstName: 'Maria',
      };
      mockPrismaService.teacher.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ ...existingTeacher });
      mockPrismaService.teacher.create
        .mockResolvedValueOnce(existingTeacher)
        .mockRejectedValueOnce(
          new AppException('CPF já cadastrado no sistema'),
        );
      const teacherCreated = (await teacherController.create(existingTeacher))
        .data;
      expect(teacherCreated).toEqual(existingTeacher);

      await expect(teacherController.create(newTeacher)).rejects.toThrow(
        AppException,
      );
      mockPrismaService.teacher.create.mockClear();
      mockPrismaService.teacher.findUnique.mockClear();
    });

    it('Retorna error ao tentar criar um professor com um CPF inválido', async () => {
      const invalidTeacher: CreateTeacherDto = {
        cpf: '12345678901',
        firstName: 'João',
        lastName: 'Silva',
        birthDate: new Date('1990-01-01'),
        status: 'active',
        expertise: 'Matemática',
      };
      await expect(teacherController.create(invalidTeacher)).rejects.toThrow(
        AppException,
      );
      mockPrismaService.teacher.findUnique.mockClear();
      mockPrismaService.teacher.create.mockClear();
    });
  });
  describe('updateTeacher', () => {
    it('Retorna error ao tentar atualizar um professor que não existe', async () => {
      const teacherId = '1';
      const updateTeacherDto: CreateTeacherDto = {
        cpf: '07222573500',
        firstName: 'João',
        lastName: 'Silva',
        birthDate: new Date('1990-01-01'),
        status: 'active',
        expertise: 'Matemática',
      };
      await expect(
        teacherController.update(teacherId, updateTeacherDto),
      ).rejects.toThrow(AppException);
      mockPrismaService.teacher.findUnique.mockClear();
      mockPrismaService.teacher.update.mockClear();
    });

    it('Retorna error ao tentar atualizar um professor com um CPF inválido', async () => {
      const teacherId = '1';
      const updateTeacherDto: CreateTeacherDto = {
        cpf: '02890493504',
        firstName: 'João',
        lastName: 'Silva',
        birthDate: new Date('1990-01-01'),
        status: 'active',
        expertise: 'Matemática',
      };
      mockPrismaService.teacher.findUnique.mockResolvedValueOnce({
        id: teacherId,
        cpf: '01545564489',
        firstName: 'João',
      });
      mockPrismaService.teacher.update.mockRejectedValueOnce(
        new AppException('CPF inválido'),
      );

      await expect(
        teacherController.update(teacherId, updateTeacherDto),
      ).rejects.toThrow(AppException);
      mockPrismaService.teacher.findUnique.mockClear();
    });
    mockPrismaService.teacher.findUnique.mockClear();
    mockPrismaService.teacher.update.mockClear();
    mockPrismaService.teacher.update.mockReset();
  });

  describe('findAll', () => {
    it('Retorna lista de professores', async () => {
      const teachers = [
        {
          id: '1',
          cpf: '07222573500',
          firstName: 'João',
          lastName: 'Silva',
          birthDate: new Date('1990-01-01'),
          status: 'active',
          expertise: 'Matemática',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.teacher.findMany.mockResolvedValue(teachers);

      const result = (await teacherController.findAll()).data;
      expect(result).toEqual(teachers);
      mockPrismaService.teacher.findMany.mockClear();
    });

    it('Lança exceção ao tentar buscar professores com erro no serviço', async () => {
      mockPrismaService.teacher.findMany.mockRejectedValue(
        new Error('Erro ao buscar os professores'),
      );

      await expect(teacherController.findAll()).rejects.toThrow(
        'Erro ao buscar os professores',
      );
    });
    mockPrismaService.teacher.findMany.mockClear();
  });

  describe('findOne', () => {
    beforeEach(() => {
      mockPrismaService.teacher.findUnique.mockClear();
    });

    it('Retorna um professor quando encontrado', async () => {
      const teacherId = '1';
      const teacherData = {
        id: teacherId,
        cpf: '07222573500',
        firstName: 'João',
        lastName: 'Silva',
        birthDate: new Date('1990-01-01'),
        status: 'active',
        expertise: 'Retorna um professor quando encontrado',
      };

      mockPrismaService.teacher.findUnique.mockResolvedValue(teacherData);

      const result = (await teacherController.findOne(teacherId)).data;
      expect(result).toEqual(teacherData);
      mockPrismaService.teacher.findUnique.mockClear();
      mockPrismaService.teacher.findOne.mockClear();
    });

    it('Retorna null quando professor não é encontrado', async () => {
      const teacherId = '999';
      mockPrismaService.teacher.findUnique.mockResolvedValueOnce(null);

      const result = (await teacherController.findOne(teacherId)).data;
      expect(result).toBeNull();
      expect(mockPrismaService.teacher.findUnique).toHaveBeenCalledWith({
        where: { id: teacherId },
      });
      expect(mockPrismaService.teacher.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateTeacher', () => {
    beforeEach(() => {
      mockPrismaService.teacher.findUnique.mockClear();
      mockPrismaService.teacher.update.mockClear();
    });
    it('Atualiza um professor com sucesso', async () => {
      const teacherId = '1';
      const existingTeacher = {
        id: teacherId,
        cpf: '07222573500',
        firstName: 'João',
        lastName: 'Silva',
        birthDate: new Date('1990-01-01'),
        status: 'active',
        expertise: 'Matemática',
      };

      const updateData = {
        firstName: 'João Paulo',
        expertise: 'Física',
      };

      mockPrismaService.teacher.findUnique.mockResolvedValue(existingTeacher);
      mockPrismaService.teacher.update.mockResolvedValue({
        ...existingTeacher,
        ...updateData,
      });

      const result = (await teacherController.update(teacherId, updateData))
        .data;
      expect(result).toEqual(expect.objectContaining(updateData));
      mockPrismaService.teacher.findUnique.mockClear();
      mockPrismaService.teacher.update.mockClear();
      mockPrismaService.teacher.findOne.mockClear();
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      mockPrismaService.teacher.findUnique.mockClear();
      mockPrismaService.teacher.delete.mockClear();
      mockPrismaService.teacher.findOne.mockClear();
      mockPrismaService.teacher.update.mockClear();
    });
    it('Deleta um professor com sucesso', async () => {
      const teacherId = '1';
      const deletedTeacher = {
        id: teacherId,
        cpf: '02890493504',
        firstName: 'João',
        lastName: 'Silva',
        birthDate: new Date('1990-01-01'),
        status: 'active',
        expertise: 'Deleta um professor com sucesso',
      };

      mockPrismaService.teacher.delete.mockResolvedValue(deletedTeacher);
      mockPrismaService.teacher.update.mockResolvedValue(deletedTeacher);
      const result = (await teacherController.delete(teacherId)).data;
      expect(result).toEqual(deletedTeacher);
      mockPrismaService.teacher.delete.mockClear();
      mockPrismaService.teacher.update.mockClear();
    });

    // it('Lança exceção ao tentar deletar professor inexistente', async () => {
    //   const teacherId = '999';
    //   mockPrismaService.teacher.delete.mockRejectedValue(
    //     new Error('Erro ao deletar o professor'),
    //   );

    //   await expect(teacherController.delete(teacherId)).rejects.toThrow(
    //     'Erro ao deletar o professor',
    //   );
    // });
  });
});
