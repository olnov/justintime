import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from '../prisma/prisma.service';

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

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  async remove(id: string) {
    return this.prismaService.student.delete({ where: { id } });
  }

  async findAllWithSchool() {
    const result = await this.prismaService.student.findMany({
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
    console.log(result);
    return result;
  }
}
