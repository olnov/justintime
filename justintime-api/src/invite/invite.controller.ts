import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteDto } from './dto/invite.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SchoolAdminGuard } from '../common/guards/school-admin.guard';

@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @ApiOkResponse({ description: 'Invite link successfully generated' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, SchoolAdminGuard)
  @Post()
  generateInviteLink(@Body() inviteDto: InviteDto) {
    const { schoolId, email } = inviteDto;
    return this.inviteService.generateInviteLink(schoolId, email);
  }
}
