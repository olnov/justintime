import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import {PasswordResetDto} from "./dto/password-reset.dto";

@Controller('auth')
export class AuthController {
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

  @Post('password-reset')
  async updatePassword(@Body() passwordResetDto: PasswordResetDto) {
    const { token, password } = passwordResetDto;
    await this.authService.resetPassword(token, password);
  }
}
