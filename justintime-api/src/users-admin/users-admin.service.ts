import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateUserAdminDto } from './dto/create-user-admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersAdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUserAdmin(createUserAdminDto: CreateUserAdminDto) {
    const { name, email, password, schoolId, role } = createUserAdminDto;
    return this.prismaService.$transaction(async (tx) => {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      const newUser = await tx.user.create({
        data: { name, email, password: hash },
      });
      if (!newUser) {
        throw new Error('Failed to create user');
      }

      const newUserSchool = await tx.userSchool.create({
        data: { userId: newUser.id, schoolId },
      });
      if (!newUserSchool) {
        throw new Error('Failed to create user-school relation');
      }

      const newRoleAssignment = await tx.roleAssignment.create({
        data: { userSchoolId: newUserSchool.id, role },
      });
      if (!newRoleAssignment) {
        throw new Error('Failed to assign role');
      }

      if (role === 'student') {
        try {
          const student = await tx.student.create({
            data: {
              userSchool: { connect: { id: newUserSchool.id } },
              gradeLevel: '',
            },
          });
          return { user: newUser, student };
        } catch (e) {
          throw new Error(`Error creating student: ${e}`);
        }
      } else if (role === 'teacher') {
        try {
          const teacher = await tx.teacher.create({
            data: {
              userSchool: { connect: { id: newUserSchool.id } },
              specialization: '',
            },
          });
          return { user: newUser, teacher };
        } catch (e) {
          throw new Error(`Error creating teacher: ${e}`);
        }
      } else if (role === 'admin') {
        return { user: newUser };
      } else {
        throw new Error('Unsupported role');
      }
    });
  }
}
