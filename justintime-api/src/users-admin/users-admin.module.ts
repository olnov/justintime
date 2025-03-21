import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersAdminController } from './users-admin.controller';
import { UsersAdminService } from './users-admin.service';

@Module({
  controllers: [UsersAdminController],
  providers: [UsersAdminService],
  imports: [PrismaModule],
})
export class UsersAdminModule {}
