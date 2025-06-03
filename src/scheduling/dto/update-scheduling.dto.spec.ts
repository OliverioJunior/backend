import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateSchedulingDto } from './update-scheduling.dto';

describe('UpdateSchedulingDto', () => {
  describe('Validação do Status', () => {
    it('Deve gerar erro quando status está ausente', async () => {
      const invalidData = {};
      const dto = plainToInstance(UpdateSchedulingDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toContain(
        'O status é obrigatório',
      );
    });

    it.each(['agendado', 'cancelado', 'realizado'])(
      'Deve aceitar status válido: %s',
      async (status) => {
        const validData = { status };
        const dto = plainToInstance(UpdateSchedulingDto, validData);
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      },
    );

    it('Deve gerar erro com status inválido', async () => {
      const invalidData = { status: 'invalid' };
      const dto = plainToInstance(UpdateSchedulingDto, invalidData);
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isEnum).toContain(
        'Status inválido. Os valores permitidos são: agendado, cancelado, realizado',
      );
    });
  });
});
