import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { IsCPF } from '../../Application/dto';

export class CreateTeacherDto {
  @IsCPF()
  @IsNotEmpty()
  cpf: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres.' })
  @MaxLength(50, { message: 'Nome não pode exceder 50 caracteres.' })
  firstName: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Sobrenome deve ter pelo menos 2 caracteres.' })
  @MaxLength(50, { message: 'Sobrenome não pode exceder 100 caracteres.' })
  lastName: string;
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  birthDate: Date;
  @IsEnum(['active', 'inactive'], {
    message: 'Status deve ser "active" ou "inactive"',
  })
  @IsNotEmpty()
  status: 'active' | 'inactive';
  @IsString()
  @IsOptional()
  expertise: string;
}
