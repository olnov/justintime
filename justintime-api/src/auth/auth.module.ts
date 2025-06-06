import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { jwtConfig } from './config/jwt.config';
import { UsersModule } from '../users/users.module';
import { UserSchoolModule } from '../user-school/user-school.module';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig),
    PrismaModule,
    UsersModule,
    UserSchoolModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
