import { Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../auth/config/jwt.config';

@Module({
  controllers: [InviteController],
  providers: [InviteService],
  imports: [JwtModule.registerAsync(jwtConfig)],
})
export class InviteModule {}
