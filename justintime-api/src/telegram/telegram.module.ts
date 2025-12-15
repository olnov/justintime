import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegrafModule } from 'nestjs-telegraf';

@Module({
  providers: [TelegramService],
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: async () => ({
        token: process.env.TELEGRAM_BOT_TOKEN,
      }),
    }),
  ],
  exports: [TelegramService],
})
export class TelegramModule {}
