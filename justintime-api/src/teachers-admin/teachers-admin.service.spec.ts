import { Test, TestingModule } from '@nestjs/testing';
import { TeachersAdminService } from './teachers-admin.service';

describe('TeachersAdminService', () => {
  let service: TeachersAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeachersAdminService],
    }).compile();

    service = module.get<TeachersAdminService>(TeachersAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
