import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CreateSchedulingDto } from './create-scheduling.dto';

enum EStatus {
  AGENDADO = 'agendado',
  CANCELADO = 'cancelado',
  REALIZADO = 'realizado',
}

export class UpdateSchedulingDto extends PartialType(CreateSchedulingDto) {
  @IsEnum(EStatus, {
    message:
      'Status inválido. Os valores permitidos são: agendado, cancelado, realizado',
  })
  @IsNotEmpty({
    message: 'O status é obrigatório',
  })
  status: EStatus;
}
