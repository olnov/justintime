import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    isGlobalAdmin: false,
    birthDate: new Date(),
    userPhoto: 'https://s3.com/photos/200',
    phone: '+7(916)222-2222',
    telegram: '@TestUser',
    address: '',
    otherContacts: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn().mockResolvedValue(mockUser),
              findMany: jest.fn().mockResolvedValue([mockUser]),
              findUnique: jest.fn().mockResolvedValue(mockUser),
              delete: jest.fn().mockResolvedValue(mockUser),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should hash password and create user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        isGlobalAdmin: false,
      };

      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      const result = await service.create(createUserDto);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 'salt');
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashedpassword',
        },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll();
      expect(prismaService.user.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      const result = await service.findOne('1');
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await service.findOne('999');
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const result = await service.remove('1');
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw error if user not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.remove('999')).rejects.toThrow(
        'User with id 999 not found',
      );
    });
  });

  describe('getAllWithDetails', () => {
    it('should return users with details', async () => {
      const mockUsersWithDetails = [
        {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          isGlobalAdmin: false,
          UserSchools: [
            {
              school: { name: 'Test School' },
              roles: [{ role: 'Admin' }],
            },
          ],
        },
      ];

      (prismaService.user.findMany as jest.Mock).mockResolvedValue(
        mockUsersWithDetails,
      );

      const result = await service.getAllWithDetails();

      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          email: true,
          isGlobalAdmin: true,
          UserSchools: {
            include: {
              school: { select: { name: true } },
              roles: { select: { role: true } },
            },
          },
        },
      });
      expect(result).toEqual(mockUsersWithDetails);
    });
  });

  // describe('update', () => {
  //   it('should return update message', () => {
  //     expect(service.update(1, {} as UpdateUserDto)).toBe(
  //       'This action updates a #1 user',
  //     );
  //   });
  // });
});
