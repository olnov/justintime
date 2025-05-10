import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { SetInitialPasswordDto } from './dto/set-initial-password.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req, @Body() authDto: AuthDto) {
    const user = req.user;
    const userWithDetails = await this.authService.getUserWithDetails(user.id);
    const schools = userWithDetails.UserSchools.map((userSchool) => ({
      id: userSchool.school.id,
      name: userSchool.school.name,
      userSchoolId: userSchool.id,
      roles: userSchool.roles.map((roleAssignment) => roleAssignment.role),
    }));

    const payload = {
      id: user.id,
      username: user.name,
      email: user.email,
      isGlobalAdmin: user.isGlobalAdmin,
      schools,
    };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '30m' }),
      user: {
        id: user.id,
        username: user.name,
        email: user.email,
        schools: schools,
      },
    };
  }

  @Post('set-password-by-invite')
  @HttpCode(201)
  async updatePassword(@Body() setInitialPassword: SetInitialPasswordDto) {
    const { inviteToken, newPassword } = setInitialPassword;
    return this.authService.setInitialPasswordByInvite(
      inviteToken,
      newPassword,
    );
  }
}
