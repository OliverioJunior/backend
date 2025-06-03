import { validate } from 'class-validator';
import { CreateStudentDto } from './create-student.dto';
import { testCases, TTestCase } from '../../common/test-utils';

describe('CreateStudentDto', () => {
  let dto: CreateStudentDto;

  beforeEach(() => {
    dto = new CreateStudentDto();
    dto.cpf = '02890493504';
    dto.firstName = 'João';
    dto.lastName = 'Silva';
    dto.birthDate = new Date('1990-01-01');
    dto.cep = '12345678';
    dto.street = 'Rua Exemplo';
    dto.number = '123';
    dto.neighborhood = 'Centro';
    dto.city = 'São Paulo';
    dto.state = 'SP';
    dto.phone = '11999999999';
    dto.whatsapp = '5511999999999';
    dto.email = 'joao@teste.com';
  });

  it('Valida um DTO com todos os campos preenchidos corretamente', async () => {
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

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
    "Falha quando 'cep' estiver $desc",
    async ({ value, constraint, valueCheck }) => {
      (dto as { cep: unknown }).cep = value;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(constraint);
      valueCheck(errors[0].value);
    },
  );
  it.each<TTestCase>(testCases())(
    "Falha quando 'street' estiver $desc",
    async ({ value, constraint, valueCheck }) => {
      (dto as { street: unknown }).street = value;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(constraint);
      valueCheck(errors[0].value);
    },
  );
  it.each<TTestCase>(testCases())(
    "Falha quando 'number' estiver $desc",
    async ({ value, constraint, valueCheck }) => {
      (dto as { number: unknown }).number = value;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(constraint);
      valueCheck(errors[0].value);
    },
  );
  it.each<TTestCase>(testCases())(
    "Falha quando 'neighborhood' estiver $desc",
    async ({ value, constraint, valueCheck }) => {
      (dto as { neighborhood: unknown }).neighborhood = value;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(constraint);
      valueCheck(errors[0].value);
    },
  );
  it.each<TTestCase>(testCases())(
    "Falha quando 'city' estiver $desc",
    async ({ value, constraint, valueCheck }) => {
      (dto as { city: unknown }).city = value;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(constraint);
      valueCheck(errors[0].value);
    },
  );
  it.each<TTestCase>(testCases())(
    "Falha quando 'state' estiver $desc",
    async ({ value, constraint, valueCheck }) => {
      (dto as { state: unknown }).state = value;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(constraint);
      valueCheck(errors[0].value);
    },
  );
  it.each<TTestCase>(testCases())(
    "Falha quando 'phone' estiver $desc",
    async ({ value, constraint, valueCheck }) => {
      (dto as { phone: unknown }).phone = value;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(constraint);
      valueCheck(errors[0].value);
    },
  );
  it.each<TTestCase>(testCases())(
    "Falha quando 'whatsapp' estiver $desc",
    async ({ value, constraint, valueCheck }) => {
      (dto as { whatsapp: unknown }).whatsapp = value;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(constraint);
      valueCheck(errors[0].value);
    },
  );
  it.each<TTestCase>(testCases())(
    "Falha quando 'email' estiver $desc",
    async ({ value, constraint, valueCheck }) => {
      (dto as { email: unknown }).email = value;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints).toHaveProperty(constraint);
      valueCheck(errors[0].value);
    },
  );
  it('Falha quando "email" for inválido', async () => {
    dto.email = 'email';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it("Falha quando 'cpf' for inválido", async () => {
    dto.cpf = '12345678901';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isCPF');
  });
});
