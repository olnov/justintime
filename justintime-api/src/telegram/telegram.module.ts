import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { StudentsModule } from '@/students/students.module';
import { TeachersModule } from '@/teachers/teachers.module';

@Module({
  providers: [TelegramService],
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: async () => ({
        token: process.env.TELEGRAM_BOT_TOKEN,
      }),
    }),
    StudentsModule,
    TeachersModule,
  ],
  exports: [TelegramService],
})
export class TelegramModule {}
