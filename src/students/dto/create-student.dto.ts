import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsPostalCode,
  MinLength,
  MaxLength,
  Length,
} from 'class-validator';
import { IsCPF } from '../../Application/dto';

export class CreateStudentDto {
  @IsCPF() @IsNotEmpty() cpf: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres.' })
  @MaxLength(50, { message: 'Nome não pode exceder 50 caracteres.' })
  firstName: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Sobrenome deve ter pelo menos 2 caracteres.' })
  @MaxLength(100, { message: 'Sobrenome não pode exceder 100 caracteres.' })
  lastName: string;
  @IsDate() @IsNotEmpty() @Type(() => Date) birthDate: Date;
  @IsPostalCode('BR') @IsNotEmpty() cep: string;
  @IsString() @IsNotEmpty() street: string;
  @IsString() @IsNotEmpty() number: string;
  @IsString() @IsNotEmpty() neighborhood: string;
  @IsString() @IsNotEmpty() city: string;
  @IsString() @IsNotEmpty() state: string;
  @IsString()
  @IsNotEmpty()
  @Length(10, 11, { message: 'Telefone deve ter 10 ou 11 dígitos.' })
  phone: string;
  @IsString()
  @IsNotEmpty()
  @Length(12, 13, { message: 'WhatsApp deve ter 12 ou 13 dígitos.' })
  whatsapp: string;
  @IsEmail() @IsNotEmpty() email: string;
}
