import { Injectable, UseGuards } from '@nestjs/common';
import { CreateRoleAssignmentDto } from './dto/create-role-assignment.dto';
import { UpdateRoleAssignmentDto } from './dto/update-role-assignment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoleAssignmentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRoleAssignmentDto: CreateRoleAssignmentDto) {
    const { userSchoolId, role } = createRoleAssignmentDto;
    return this.prismaService.roleAssignment.create({
      data: { userSchoolId, role },
    });
  }

  async findAll() {
    return this.prismaService.roleAssignment.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.roleAssignment.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateRoleAssignmentDto: UpdateRoleAssignmentDto) {
    return `This action updates a #${id} roleAssignment`;
  }

  async remove(id: string) {
    return this.prismaService.roleAssignment.delete({
      where: { id },
    });
  }
}
