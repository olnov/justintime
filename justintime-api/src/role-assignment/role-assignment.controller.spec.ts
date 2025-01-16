import { Test, TestingModule } from '@nestjs/testing';
import { RoleAssignmentController } from './role-assignment.controller';
import { RoleAssignmentService } from './role-assignment.service';

describe('RoleAssignmentController', () => {
  let controller: RoleAssignmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleAssignmentController],
      providers: [RoleAssignmentService],
    }).compile();

    controller = module.get<RoleAssignmentController>(RoleAssignmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
