import { StudentsService } from '@/students/students.service';
import { TeachersService } from '@/teachers/teachers.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { Hears, Help, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

const SCHOOL_ID = '531ad0ea-3861-4cbe-b96e-87235c62e8ac'; // VoiceUp Hardcoded for testing

@Update()
@Injectable()
export class TelegramService {
  constructor(
    private readonly configService: ConfigService,
    private readonly studentsService: StudentsService,
    private readonly teachersService: TeachersService,
  ) {
    const validatedBotToken =
      this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!validatedBotToken) {
      throw new Error(
        'TELEGRAM_BOT_TOKEN is not defined in environment variables',
      );
    }
  }

  @Start()
  async onStart(ctx: Context) {
    await ctx.reply(
      'Welcome to the JustInTime Bot! Use /help to see available commands.',
    );
  }

  @Help()
  async onHelp(ctx: Context) {
    await ctx.reply(
      'Available commands:\n/start - Start the bot\n/help - Show this help message',
    );
  }

  @Hears('ping')
  async onPing(ctx: Context) {
    console.log('Received ping command', ctx.message);
    await ctx.reply('pong');
  }

  @Hears('студенты')
  async onMySchedule(ctx: Context) {
    const students = await this.studentsService.findBySchoolId(SCHOOL_ID);
    const result = (students.data as any[])
      .map((s) => `${s.userSchool.user.name}`)
      .join('\n');
    await ctx.reply(result);
  }

  @Hears('преподаватели')
  async onTeachers(ctx: Context) {
    const teachers = await this.teachersService.findBySchoolId(SCHOOL_ID);
    const result = (teachers.data as any[])
      .map((t) => `${t.userSchool.user.name}`)
      .join('\n');
    await ctx.reply(result);
  }

  @On('text')
  async onTextMessage(ctx: Context) {
    console.log('Received text message', ctx.message);
    if ('text' in ctx.message) {
      await ctx.reply(`You said: ${ctx.message.text}`);
    }
  }
}
