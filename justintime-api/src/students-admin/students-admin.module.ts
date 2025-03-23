import { Module } from '@nestjs/common';
import { StudentsAdminService } from './students-admin.service';
import { StudentsAdminController } from './students-admin.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [StudentsAdminService],
  controllers: [StudentsAdminController],
  imports: [PrismaModule],
})
export class StudentsAdminModule {}
