import { Injectable } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class SchoolsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createSchoolDto: CreateSchoolDto) {
    const { name, address, phone } = createSchoolDto;

    return this.prismaService.school.create({
      data: { name, address, phone },
    });
  }

  async findAll() {
    return this.prismaService.school.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.school.findUnique({
      where: { id },
    });
  }

  update(id: number, updateSchoolDto: UpdateSchoolDto) {
    return `This action updates a #${id} school`;
  }

  async remove(id: string) {
    return this.prismaService.school.delete({
      where: { id },
    });
  }
}
