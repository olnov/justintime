import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { Hears, Help, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class TelegramService {
  constructor(private readonly configService: ConfigService) {
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

  @On('text')
  async onTextMessage(ctx: Context) {
    console.log('Received text message', ctx.message);
    if ('text' in ctx.message) {
      await ctx.reply(`You said: ${ctx.message.text}`);
    }
  }
}
