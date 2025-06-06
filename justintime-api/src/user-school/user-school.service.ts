import { Injectable } from '@nestjs/common';
import { CreateUserSchoolDto } from './dto/create-user-school.dto';
import { UpdateUserSchoolDto } from './dto/update-user-school.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserSchoolService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserSchoolDto: CreateUserSchoolDto) {
    const { userId, schoolId } = createUserSchoolDto;
    return this.prismaService.userSchool.create({
      data: { userId, schoolId },
    });
  }

  async findAll() {
    return this.prismaService.userSchool.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.userSchool.findUnique({
      where: { id },
    });
  }

  async findByUserIdSchoolId(userId: string, schoolId: string) {
    return this.prismaService.userSchool.findUnique({
      where: {
        userId_schoolId: { userId, schoolId },
      },
    });
  }

  async update(id: string, updateUserSchoolDto: UpdateUserSchoolDto) {
    return `This action updates a #${id} userSchool`;
  }

  async remove(id: string) {
    return this.prismaService.userSchool.delete({
      where: { id },
    });
  }

  async findAllWithDetails() {
    return this.prismaService.userSchool.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            isGlobalAdmin: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        school: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
