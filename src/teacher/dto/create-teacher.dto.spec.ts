import { validate } from 'class-validator';
import { CreateTeacherDto } from './create-teacher.dto';
import { testCases, TTestCase } from '../../common/test-utils';

describe('CreateTeacherDto', () => {
  let dto: CreateTeacherDto;

  beforeEach(() => {
    dto = new CreateTeacherDto();
    dto.firstName = 'John';
    dto.lastName = 'Doe';
    dto.cpf = '02890493504';
    dto.status = 'active';
    dto.birthDate = new Date('1990-01-01');
    dto.expertise = 'Math';
  });

  it('Valida um DTO com todos os campos preenchidos corretamente', async () => {
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
  it.each<TTestCase>(testCases())(
    `Falha quando 'firstName' estiver $desc`,
    async ({ value, constraint, valueCheck }) => {
      (dto as { firstName: unknown }).firstName = value;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(constraint);
      valueCheck(errors[0].value);
    },
  );
  it.each<TTestCase>(testCases())(
    `Falha quando 'lastName' estiver $desc`,
    async ({ value, constraint, valueCheck }) => {
      (dto as { lastName: unknown }).lastName = value;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(constraint);
      valueCheck(errors[0].value);
    },
  );
  it.each<TTestCase>(testCases())(
    `Falha quando 'cpf' estiver $desc`,
    async ({ value, constraint, valueCheck }) => {
      (dto as { cpf: unknown }).cpf = value;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(constraint);
      valueCheck(errors[0].value);
    },
  );
  it.each<TTestCase>(testCases('Date'))(
    `Falha quando 'birthDate' estiver $desc`,
    async ({ value, constraint, valueCheck }) => {
      (dto as { birthDate: unknown }).birthDate = value;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(constraint);
      valueCheck(errors[0].value);
    },
  );
  it.each<TTestCase>(testCases())(
    `Falha quando 'status' estiver $desc`,
    async ({ value, constraint, valueCheck }) => {
      (dto as { status: unknown }).status = value;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(constraint);
      valueCheck(errors[0].value);
    },
  );

  it("Falha quando 'status' não for 'active' ou 'inactive'", async () => {
    (dto as { status: unknown }).status = 'invalid';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isEnum');
  });

  it("Falha quando 'expertise' não for uma string", async () => {
    (dto as { expertise: unknown }).expertise = 123;
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
