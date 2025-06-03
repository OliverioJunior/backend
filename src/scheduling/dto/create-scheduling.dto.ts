import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSchedulingDto {
  @IsDateString()
  @IsNotEmpty({ message: 'A data e hora do agendamento é obrigatória' })
  dateTime: string;

  @IsUUID()
  @IsNotEmpty({ message: 'O professor é obrigatório' })
  teacherId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'O estudante é obrigatório' })
  studentId: string;

  @IsString()
  @IsNotEmpty({ message: 'O conteúdo da aula é obrigatório' })
  content: string;
}
