import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeachersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTeacherDto: CreateTeacherDto) {
    const { userSchoolId, specialization, bio, rating } = createTeacherDto;

    return this.prismaService.teacher.create({
      data: { userSchoolId, specialization, bio, rating },
    });
  }

  async findAll() {
    return this.prismaService.teacher.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.teacher.findUnique({ where: { id } });
  }

  async update(updateTeacherDto: UpdateTeacherDto) {
    console.log('Starting update: ', updateTeacherDto);
    const { id, userData, ...teacherData } = updateTeacherDto;

    const updatedTeacher = await this.prismaService.$transaction(async (tx) => {
      const teacher = await tx.teacher.update({
        where: { id: id },
        data: teacherData,
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
      return teacher;
    });
    return updatedTeacher;
  }

  async remove(id: string) {
    return this.prismaService.teacher.delete({ where: { id } });
  }

  async findBySchoolId(id: string) {
    return this.prismaService.teacher.findMany({
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
    return this.prismaService.teacher.findMany({
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
