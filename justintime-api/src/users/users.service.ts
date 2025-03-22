import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    return this.prismaService.user.create({
      data: { name, email, password: hash },
    });
  }

  async findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return this.prismaService.user.delete({ where: { id: id } });
  }

  async getAllWithDetails() {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isGlobalAdmin: true,
        UserSchools: {
          include: {
            school: {
              select: {
                name: true,
              },
            },
            roles: {
              select: {
                role: true,
              },
            },
          },
        },
      },
    });
  }
}
