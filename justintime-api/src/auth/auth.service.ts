import {Injectable, InternalServerErrorException, Logger, NotFoundException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserSchoolService } from '../user-school/user-school.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly userSchoolService: UserSchoolService,
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

  async setInitialPasswordByInvite(
    token: string,
    password: string,
  ): Promise<any> {
    const payload: { schoolId: string; email: string } =
      this.jwtService.verify(token);

    // Checking if email belongs to the existing user
    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validating relation of user and school against schoolId in token
    const validateUserSchool =
      await this.userSchoolService.findByUserIdSchoolId(
        user.id,
        payload.schoolId,
      );

    if (!validateUserSchool) {
      throw new InternalServerErrorException(
        'School and user relation mismatch',
      );
    }
    return this.userService.setInitialPassword(payload.email, password);
  }
}
