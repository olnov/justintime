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

  update(id: string, updateTeacherDto: UpdateTeacherDto) {
    return `This action updates a #${id} teacher`;
  }

  async remove(id: string) {
    return this.prismaService.teacher.delete({ where: { id } });
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
