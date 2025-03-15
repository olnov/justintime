import { Test, TestingModule } from '@nestjs/testing';
import { MailNotifierService } from './mail-notifier.service';

describe('MailNotifierService', () => {
  let service: MailNotifierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailNotifierService],
    }).compile();

    service = module.get<MailNotifierService>(MailNotifierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
