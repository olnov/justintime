import { Test, TestingModule } from '@nestjs/testing';
import { UserSchoolController } from './user-school.controller';
import { UserSchoolService } from './user-school.service';

describe('UserSchoolController', () => {
  let controller: UserSchoolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSchoolController],
      providers: [UserSchoolService],
    }).compile();

    controller = module.get<UserSchoolController>(UserSchoolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
