import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MailNotifierService } from './mail-notifier.service';
import { EmailDto } from './dto/email.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('mail-notifier')
export class MailNotifierController {
  constructor(private readonly mailNotifierService: MailNotifierService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async sendEmail(@Body() emailDto: EmailDto): Promise<void> {
    console.log(emailDto);
    return await this.mailNotifierService.sendEmail(emailDto);
  }
}
