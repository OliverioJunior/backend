import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateSchedulingDto } from './create-scheduling.dto';

describe('CreateSchedulingDto', () => {
  it('Valida com dados corretos', async () => {
    const validData = {
      dateTime: '2024-03-15T10:00:00Z',
      teacherId: 'd3e8baf0-7d8f-4e5d-b689-6d3a7e5f8a1c',
      studentId: 'a1b2c3d4-e5f6-4890-a1b2-c3d4e5f6789b',
      content: 'Aula de matemática básica',
    };

    const dto = plainToInstance(CreateSchedulingDto, validData);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  describe('validações de campos obrigatórios', () => {
    const testCases = [
      { field: 'dateTime', value: null },
      { field: 'teacherId', value: null },
      { field: 'studentId', value: null },
      { field: 'content', value: null },
    ];

    testCases.forEach(({ field, value }) => {
      it(`Falha quando ${field} está ausente`, async () => {
        const invalidData = {
          dateTime: '2024-03-15T10:00:00Z',
          teacherId: 'd3e8baf0-7d8f-4e5d-b689-6d3a7e5f8a1c',
          studentId: 'a1b2c3d4-e5f6-4890-a1b2-c3d4e5f6789b',
          content: 'Aula de matemática básica',
        };
        delete invalidData[field];
        const mensagemForField = {
          dateTime: 'A data e hora do agendamento é obrigatória',
          teacherId: 'O professor é obrigatório',
          studentId: 'O estudante é obrigatório',
          content: 'O conteúdo da aula é obrigatório',
        };
        const dto = plainToInstance(CreateSchedulingDto, invalidData);
        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].constraints?.isNotEmpty).toContain(
          mensagemForField[field],
        );
      });
    });
  });

  describe('validações de formato', () => {
    it('Falha com UUID inválido para teacherId', async () => {
      const invalidData = {
        dateTime: '2024-03-15T10:00:00Z',
        teacherId: 'uuid-invalido',
        studentId: 'a1b2c3d4-e5f6-4890-a1b2-c3d4e5f6789b',
        content: 'Aula de matemática básica',
      };

      const dto = plainToInstance(CreateSchedulingDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isUuid).toBeDefined();
    });
    it('Falha com UUID inválido para studentId', async () => {
      const invalidData = {
        dateTime: '2024-03-15T10:00:00Z',
        teacherId: 'd3e8baf0-7d8f-4e5d-b689-6d3a7e5f8a1c',
        studentId: 'buuid-invalido',
        content: 'Aula de matemática básica',
      };

      const dto = plainToInstance(CreateSchedulingDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isUuid).toBeDefined();
    });

    it('Falha com data em formato inválido', async () => {
      const invalidData = {
        dateTime: '15/03/2024',
        teacherId: 'd3e8baf0-7d8f-4e5d-b689-6d3a7e5f8a1c',
        studentId: 'a1b2c3d4-e5f6-4890-a1b2-c3d4e5f6789b',
        content: 'Aula de matemática básica',
      };

      const dto = plainToInstance(CreateSchedulingDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isDateString).toBeDefined();
    });
  });
});
