import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { TeacherModule } from './teacher/teacher.module';
import { SchedulingModule } from './scheduling/scheduling.module';

@Module({
  imports: [StudentsModule, TeacherModule, SchedulingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
