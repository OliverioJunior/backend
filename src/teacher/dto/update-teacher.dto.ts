import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateTeacherDto } from './create-teacher.dto';

export class UpdateTeacherDto extends PartialType(
  OmitType(CreateTeacherDto, ['cpf'] as const),
) {}
