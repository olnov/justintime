import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MailNotifierService } from './mail-notifier.service';
import { MailNotifierController } from './mail-notifier.controller';

@Module({
  controllers: [MailNotifierController],
  providers: [MailNotifierService],
  imports: [HttpModule],
})
export class MailNotifierModule {}
