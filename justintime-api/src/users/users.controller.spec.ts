import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';

const users = [
  {
    id: 'cff32b69-1b1c-4287-a6cd-73be1644abcd',
    name: 'Valentina Ivanova',
    email: 'ivanova@example.com',
    password: 'hashedpassword',
    isGlobalAdmin: false,
    birthDate: new Date(),
    userPhoto: null,
    phone: null,
    telegram: null,
    otherContacts: null,
    address: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
      imports: [PrismaModule],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('Controller should be defined', () => {
    expect(usersController).toBeDefined();
  });
  it('Service should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('GET /users', () => {
    it('Should return a list of users', async () => {
      const result = users;
      jest
        .spyOn(usersService, 'findAll')
        .mockImplementation(() => Promise.resolve(result));

      expect(await usersService.findAll()).toBe(result);
    });
  });
});
