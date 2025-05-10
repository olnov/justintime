import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { handlePrismaError } from '../common/exceptions/prisma-error.helper';
import { UserSchoolService } from 'src/user-school/user-school.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userSchoolService: UserSchoolService,
  ) {}

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

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async resetPassword(schoolId: string, email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userSchool = await this.userSchoolService.findByUserIdSchoolId(
      user.id,
      schoolId,
    );

    if (!userSchool) {
      throw new NotFoundException('User does not belong to the school');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const updatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        password: hash,
        updatedAt: new Date(),
      },
    });
    delete updatedUser.password;
    return updatedUser;
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

  async setInitialPassword(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    return this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hash,
      },
    });
  }
}
