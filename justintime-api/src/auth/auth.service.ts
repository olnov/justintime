import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {UsersService} from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async getUserWithDetails(id: string): Promise<any> {
    return this.prismaService.user.findUnique({
      where: { id },
      include: {
        UserSchools: {
          include: {
            school: true,
            roles: {
              select: {
                userSchoolId: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }

  async resetPassword(token: string, password: string): Promise<any> {
    const payload: { schoolId: string; email: string } =
      this.jwtService.verify(token);

    return this.userService.resetPassword(
      payload.schoolId,
      payload.email,
      password,
    );
  }
}
