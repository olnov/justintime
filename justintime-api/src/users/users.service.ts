import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { handlePrismaError } from '../common/exceptions/prisma-error.helper';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    try {
      return this.prismaService.user.create({
        data: { name, email, password: hash },
      });
    } catch (error) {
      handlePrismaError(error);
    }
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

  async getAllWithDetails(skip?: number, take?: number) {
    const queryOptions: any = {
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
    };

    if (typeof skip === 'number' && typeof take === 'number') {
      queryOptions.skip = skip;
      queryOptions.take = take;
    }

    const data = await this.prismaService.user.findMany(queryOptions);
    const totalCount = await this.prismaService.user.count();
    return { data, totalCount };
  }
}
