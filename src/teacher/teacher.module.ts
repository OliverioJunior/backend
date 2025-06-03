import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { PrismaService } from '../infra/database/prisma.service';
import { TeacherController } from './teacher.controller';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService, PrismaService],
})
export class TeacherModule {}
