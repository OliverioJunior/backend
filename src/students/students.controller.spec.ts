import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { PrismaService } from '../infra/database/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AppException } from '../common/exceptions/app.exception';

describe('StudentsController', () => {
  let studentsController: StudentsController;
  let studentsService: StudentsService;

  const mockPrismaService = {
    student: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        StudentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    studentsController = app.get<StudentsController>(StudentsController);
    studentsService = app.get<StudentsService>(StudentsService);
  });

  describe('createStudents', () => {
    it('Retorna erro ao tentar criar dois estudantes com o mesmo CPF', async () => {
      const firstStudent = {
        firstName: 'João',
        lastName: 'Silva',
        birthDate: new Date('1990-01-01'),
        cep: '49500000',
        street: 'Rua Teste',
        number: '123',
        neighborhood: 'Centro',
        city: 'Itabaiana',
        state: 'SE',
        phone: '79999999999',
        whatsapp: '5579999999999',
        email: 'joao@teste.com',
        cpf: '12345678900',
      };

      const secondStudent = {
        ...firstStudent,
        firstName: 'Maria',
        email: 'maria@teste.com',
      };

      mockPrismaService.student.create
        .mockResolvedValueOnce(firstStudent)
        .mockRejectedValueOnce(
          new AppException('CPF já cadastrado no sistema'),
        );

      // Primeiro cadastro deve ser bem-sucedido
      await expect(studentsController.create(firstStudent)).resolves.toEqual(
        firstStudent,
      );

      // Segundo cadastro deve falhar devido ao CPF duplicado
      await expect(studentsController.create(secondStudent)).rejects.toThrow();
    });

    it('Retorna erro de validação com dados inválidos para estudante', async () => {
      const invalidStudent = {
        firstName: 'J', // Nome muito curto
        lastName: 'D', // Sobrenome muito curto
        birthDate: 'data-invalida',
        cep: '123', // CEP inválido
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        phone: '123', // Telefone inválido
        whatsapp: '123', // WhatsApp inválido
        email: 'email-invalido',
        cpf: '123', // CPF inválido
      };

      const dto = plainToInstance(CreateStudentDto, invalidStudent);
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            constraints: expect.objectContaining({
              isEmail: expect.any(String),
            }),
          }),
        ]),
      );
    });
  });

  it('Cria um estudante com dados válidos', async () => {
    const validStudent = {
      firstName: 'Olivério',
      lastName: 'Ferreira Chagas Júnior',
      birthDate: new Date('1996-05-20'),
      cep: '49500579',
      street: 'Rua João Alves de Souza',
      number: '49',
      neighborhood: 'São Cristovão',
      city: 'Itabaiana',
      state: 'SE',
      phone: '79996824092',
      whatsapp: '5579996824092',
      email: 'oliverio.junior2@gmail.com',
      cpf: '02890493504',
    };

    mockPrismaService.student.create.mockResolvedValue(validStudent);

    const dto = plainToInstance(CreateStudentDto, validStudent);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    const result = await studentsController.create(validStudent);
    expect(result).toEqual(validStudent);
    expect(mockPrismaService.student.create).toHaveBeenCalledWith({
      data: validStudent,
    });
  });

  it('Lançar exceção ao tentar criar estudante com erro no serviço', async () => {
    const validStudent = {
      firstName: 'Olivério',
      lastName: 'Ferreira Chagas Júnior',
      birthDate: new Date('1996-05-20'),
      cep: '49500579',
      street: 'Rua João Alves de Souza',
      number: '49',
      neighborhood: 'São Cristovão',
      city: 'Itabaiana',
      state: 'SE',
      phone: '79996824092',
      whatsapp: '5579996824092',
      email: 'oliverio.junior2@gmail.com',
      cpf: '02890493504',
    };

    mockPrismaService.student.create.mockRejectedValue(
      new Error('Erro ao criar estudante'),
    );

    await expect(studentsController.create(validStudent)).rejects.toThrow(
      'Erro ao criar estudante',
    );
  });

  describe('updateStudent', () => {
    it('Atualiza parcialmente um estudante com dados válidos', async () => {
      const studentId = '1';
      const existingStudent = {
        id: studentId,
        firstName: 'Olivério',
        lastName: 'Ferreira',
        birthDate: new Date('1996-05-20'),
        cep: '49500579',
        street: 'Rua João Alves',
        number: '49',
        neighborhood: 'São Cristovão',
        city: 'Itabaiana',
        state: 'SE',
        phone: '79996824092',
        whatsapp: '5579996824092',
        email: 'oliverio@gmail.com',
        cpf: '02890493504',
      };

      const updateData = {
        firstName: 'Olivério Junior',
        email: 'oliverio.junior@gmail.com',
      };

      mockPrismaService.student.findUnique.mockResolvedValue(existingStudent);
      mockPrismaService.student.update.mockResolvedValue({
        ...existingStudent,
        ...updateData,
      });

      const result = await studentsController.update(studentId, updateData);

      expect(result).toEqual(expect.objectContaining(updateData));
      expect(mockPrismaService.student.update).toHaveBeenCalledWith({
        where: { id: studentId },
        data: updateData,
      });
    });

    it('Valida campos ao atualizar estudante', async () => {
      const updateData = {
        firstName: 'O', // Nome muito curto
        email: 'email-invalido', // Email inválido
      };

      const dto = plainToInstance(UpdateStudentDto, updateData);
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            constraints: expect.objectContaining({
              minLength: expect.any(String),
            }),
          }),
          expect.objectContaining({
            constraints: expect.objectContaining({
              isEmail: expect.any(String),
            }),
          }),
        ]),
      );
    });
  });

  describe('findAll', () => {
    it('Retorna lista de estudantes', async () => {
      const students = [
        {
          id: 1,
          firstName: 'Olivério',
          lastName: 'Ferreira Chagas Júnior',
          birthDate: new Date('1996-05-20'),
          cep: '49500579',
          street: 'Rua João Alves de Souza',
          number: '49',
          neighborhood: 'São Cristovão',
          city: 'Itabaiana',
          state: 'SE',
          phone: '79996824092',
          whatsapp: '5579996824092',
          email: 'oliverio.junior2@gmail.com',
          cpf: '02890493504',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.student.findMany.mockResolvedValue(students);

      const result = await studentsController.findAll();
      expect(result).toEqual(students);
      expect(mockPrismaService.student.findMany).toHaveBeenCalled();
    });

    it('Lançar exceção ao tentar buscar estudantes com erro no serviço', async () => {
      mockPrismaService.student.findMany.mockRejectedValue(
        new Error('Erro ao buscar estudantes'),
      );

      await expect(studentsController.findAll()).rejects.toThrow(
        'Erro ao buscar estudantes',
      );
    });
  });

  describe('findOne', () => {
    it('Retorna um estudante quando encontrado', async () => {
      const studentId = '1';
      const student = {
        id: studentId,
        firstName: 'Olivério',
        lastName: 'Ferreira',
        birthDate: new Date('1996-05-20'),
        cep: '49500579',
        street: 'Rua João Alves',
        number: '49',
        neighborhood: 'São Cristovão',
        city: 'Itabaiana',
        state: 'SE',
        phone: '79996824092',
        whatsapp: '5579996824092',
        email: 'oliverio@gmail.com',
        cpf: '02890493504',
      };

      mockPrismaService.student.findUnique.mockResolvedValue(student);

      const result = await studentsService.findOne(studentId);
      expect(result).toEqual(student);
      expect(mockPrismaService.student.findUnique).toHaveBeenCalledWith({
        where: { id: studentId },
      });
    });

    it('Retorna null quando estudante não é encontrado', async () => {
      const studentId = '999';
      mockPrismaService.student.findUnique.mockResolvedValue(null);

      const result = await studentsService.findOne(studentId);
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('Deleta um estudante com sucesso', async () => {
      const studentId = '1';
      const deletedStudent = {
        id: studentId,
        firstName: 'Olivério',
        lastName: 'Ferreira',
        birthDate: new Date('1996-05-20'),
        cep: '49500579',
        street: 'Rua João Alves',
        number: '49',
        neighborhood: 'São Cristovão',
        city: 'Itabaiana',
        state: 'SE',
        phone: '79996824092',
        whatsapp: '5579996824092',
        email: 'oliverio@gmail.com',
        cpf: '02890493504',
      };

      mockPrismaService.student.delete.mockResolvedValue(deletedStudent);

      const result = await studentsController.delete(studentId);
      expect(result).toEqual(deletedStudent);
      expect(mockPrismaService.student.delete).toHaveBeenCalledWith({
        where: { id: studentId },
      });
    });

    it('Lança exceção ao tentar deletar estudante inexistente', async () => {
      const studentId = '999';
      mockPrismaService.student.delete.mockRejectedValue(
        new Error('Erro ao deletar estudante'),
      );

      await expect(studentsController.delete(studentId)).rejects.toThrow(
        'Erro ao deletar estudante',
      );
    });
  });
});
