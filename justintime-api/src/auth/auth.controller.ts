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
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  // @UseGuards(AuthGuard('local'))
  // @HttpCode(HttpStatus.OK)
  // @Post('login')
  // async login(@Request() req) {
  //   const payload = { username: req.user.username, sub: req.user.id };
  //   return {
  //     accessToken: this.jwtService.sign(payload),
  //   };
  // }

  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req, @Body() authPayload: AuthDto ) {
    const user = req.user;
    const payload = {
      username: user.name,
      id: user.id,
      globalAdmin: user.isGlobalAdmin,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.name,
        email: user.email,
        roles: user.roles,
      },
    };
  }
}
