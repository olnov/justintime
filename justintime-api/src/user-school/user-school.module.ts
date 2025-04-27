import { Module } from '@nestjs/common';
import { UserSchoolService } from './user-school.service';
import { UserSchoolController } from './user-school.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [UserSchoolController],
  providers: [UserSchoolService],
  imports: [PrismaModule],
  exports: [UserSchoolService],
})
export class UserSchoolModule {}
