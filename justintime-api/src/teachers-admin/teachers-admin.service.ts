import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherAdminDto } from './dto/teachers-admin-create.dto';
import * as bcrypt from 'bcrypt';
import { handlePrismaError } from '../common/exceptions/prisma-error.helper';
import { generateTemporaryPassword } from '../common/helpers/temporary-password-generator.helper';

@Injectable()
export class TeachersAdminService {
  private readonly logger = new Logger(TeachersAdminService.name);
  constructor(private readonly prismaService: PrismaService) {}

  async createTeacherAdmin(createTeacherAdminDto: CreateTeacherAdminDto) {
    const {
      name,
      email,
      schoolId,
      role = 'teacher',
      specialization,
      bio,
      rating,
    } = createTeacherAdminDto;
    return this.prismaService.$transaction(async (tx) => {
      const password = generateTemporaryPassword();
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      const newUser = await tx.user
        .create({
          data: { name, email, password: hash },
        })
        .catch((err) => {
          handlePrismaError(err);
        });
      if (!newUser) {
        throw new Error('Failed to create user');
      }
      const newUserSchool = await tx.userSchool.create({
        data: { userId: newUser.id, schoolId: schoolId },
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
      try {
        const newTeacher = await tx.teacher.create({
          data: {
            userSchool: { connect: { id: newUserSchool.id } },
            specialization,
            bio,
            rating,
          },
        });
        return { user: newUser, teacher: newTeacher };
      } catch (e) {
        throw new Error(`Error creating teacher ${e}`);
      }
    });
  }
}
