import {Controller, HttpCode, HttpStatus, Post, Request, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req) {
    const payload = { username: req.user.username, sub: req.user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
