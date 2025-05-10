import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InviteService {
  private readonly inviteBaseUrl: string;
  private readonly logger = new Logger(InviteService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const validatedInviteBaseUrl = this.configService.get('INVITE_BASE_URL');
    if (!validatedInviteBaseUrl) {
      this.logger.error('INVITE_BASE_URL missing');
      throw new InternalServerErrorException('INVITE_BASE_URL is missing');
    }
    this.inviteBaseUrl = validatedInviteBaseUrl;
  }

  async generateInviteLink(schoolId: string, email: string) {
    const payload = {
      email,
      schoolId,
    };
    const token = this.jwtService.sign(payload, { expiresIn: '1d' });
    const link =
      `${this.inviteBaseUrl}/invite` +
      `?inviteToken=${encodeURIComponent(token)}`;
    return JSON.stringify(link);
  }
}
