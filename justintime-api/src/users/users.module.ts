import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserSchoolModule } from '../user-school/user-school.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule, UserSchoolModule],
  exports: [UsersService],
})
export class UsersModule {}
