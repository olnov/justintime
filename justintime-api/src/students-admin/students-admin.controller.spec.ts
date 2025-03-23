import { Test, TestingModule } from '@nestjs/testing';
import { StudentsAdminController } from './students-admin.controller';

describe('StudentsAdminController', () => {
  let controller: StudentsAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsAdminController],
    }).compile();

    controller = module.get<StudentsAdminController>(StudentsAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
