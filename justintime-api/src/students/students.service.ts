import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from '../prisma/prisma.service';
import {UpdateTeacherDto} from "../teachers/dto/update-teacher.dto";

@Injectable()
export class StudentsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createStudentDto: CreateStudentDto) {
    const { userSchoolId, gradeLevel } = createStudentDto;

    return this.prismaService.student.create({
      data: { userSchoolId, gradeLevel },
    });
  }

  async findAll() {
    return this.prismaService.student.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.student.findUnique({ where: { id } });
  }

  async update(updateStudentDto: UpdateStudentDto) {
    const { id, userData, ...studentData } = updateStudentDto;

    const updatedStudent = await this.prismaService.$transaction(async (tx) => {
      const student = await tx.student.update({
        where: { id: id },
        data: studentData,
      });

      if (userData) {
        await tx.user.update({
          where: { id: userData.userId },
          data: {
            name: userData.name,
            email: userData.email,
          },
        });
      }
      return student;
    });
    return updatedStudent;
  }

  async remove(id: string) {
    return this.prismaService.student.delete({ where: { id } });
  }

  async findBySchoolId(id: string) {
    return this.prismaService.student.findMany({
      where: {
        userSchool: {
          schoolId: id,
        },
      },
      include: {
        userSchool: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            school: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findAllWithSchool() {
    return this.prismaService.student.findMany({
      include: {
        userSchool: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            school: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
