import { Module } from '@nestjs/common';
import { RoleAssignmentService } from './role-assignment.service';
import { RoleAssignmentController } from './role-assignment.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [RoleAssignmentController],
  providers: [RoleAssignmentService],
  imports: [PrismaModule],
})
export class RoleAssignmentModule {}
