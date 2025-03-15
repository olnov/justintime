import { Test, TestingModule } from '@nestjs/testing';
import { MailNotifierController } from './mail-notifier.controller';

describe('MailNotifierController', () => {
  let controller: MailNotifierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailNotifierController],
    }).compile();

    controller = module.get<MailNotifierController>(MailNotifierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
