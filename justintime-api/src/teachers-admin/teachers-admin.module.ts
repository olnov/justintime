import { Module } from '@nestjs/common';
import { TeachersAdminService } from './teachers-admin.service';
import { TeachersAdminController } from './teachers-admin.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [TeachersAdminService],
  controllers: [TeachersAdminController],
  imports: [PrismaModule],
})
export class TeachersAdminModule {}
