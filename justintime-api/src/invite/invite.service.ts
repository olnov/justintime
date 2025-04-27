import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RuntimeException } from '@nestjs/core/errors/exceptions';

@Injectable()
export class InviteService {
  constructor(private readonly jwtService: JwtService) {}

  generateInviteLink(schoolId: string, email: string) {
    const payload = {
      email,
      schoolId,
    };

    const token = this.jwtService.sign(payload, { expiresIn: '1d' });
    const inviteBaseUrl = process.env.INVITE_BASE_URL;
    if (!inviteBaseUrl) {
      throw new RuntimeException('Invite base URL is missing');
    }
    return `${inviteBaseUrl}/invite?inviteToken=${token}`;
  }
}
