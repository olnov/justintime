import { Test, TestingModule } from '@nestjs/testing';
import { TeachersAdminController } from './teachers-admin.controller';

describe('TeachersAdminController', () => {
  let controller: TeachersAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachersAdminController],
    }).compile();

    controller = module.get<TeachersAdminController>(TeachersAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
