import { Test, TestingModule } from '@nestjs/testing';
import { UserSchoolService } from './user-school.service';

describe('UserSchoolService', () => {
  let service: UserSchoolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSchoolService],
    }).compile();

    service = module.get<UserSchoolService>(UserSchoolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
