import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { SchoolsModule } from './schools/schools.module';
import { UserSchoolModule } from './user-school/user-school.module';
import { RoleAssignmentModule } from './role-assignment/role-assignment.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UsersModule,
    SchoolsModule,
    TeachersModule,
    StudentsModule,
    AppointmentsModule,
    UserSchoolModule,
    RoleAssignmentModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
