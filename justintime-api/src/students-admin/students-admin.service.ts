import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentsAdminDto } from './dto/create-students-admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsAdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async createStudentAdmin(createStudentsAdminDto: CreateStudentsAdminDto) {
    const {
      name,
      email,
      password,
      role = 'student',
      schoolId,
      gradeLevel,
    } = createStudentsAdminDto;
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
        const newStudent = await tx.student.create({
          data: {
            userSchool: { connect: { id: newUserSchool.id } },
            gradeLevel,
          },
        });
        return { user: newUser, student: newStudent };
      } catch (e) {
        throw new Error(`Failed to create student: ${e}`);
      }
    });
  }
}
