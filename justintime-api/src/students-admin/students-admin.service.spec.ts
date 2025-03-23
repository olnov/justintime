import { Test, TestingModule } from '@nestjs/testing';
import { StudentsAdminService } from './students-admin.service';

describe('StudentsAdminService', () => {
  let service: StudentsAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentsAdminService],
    }).compile();

    service = module.get<StudentsAdminService>(StudentsAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
