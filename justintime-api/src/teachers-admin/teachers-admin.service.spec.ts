import { Test, TestingModule } from '@nestjs/testing';
import { TeachersAdminService } from './teachers-admin.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherAdminDto } from './dto/teachers-admin-create.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
}));

describe('TeachersAdminService', () => {
  let service: TeachersAdminService;
  let prismaService: PrismaService;
  let mockTx;

  beforeEach(async () => {
    // Initialize mockTx with Jest mock functions
    mockTx = {
      user: { create: jest.fn() },
      userSchool: { create: jest.fn() },
      roleAssignment: { create: jest.fn() },
      teacher: { create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeachersAdminService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn().mockImplementation(async (callback) => {
              // Use the predefined mockTx
              return callback(mockTx);
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TeachersAdminService>(TeachersAdminService);
    prismaService = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should create a teacher successfully', async () => {
    const mockCreateDto: CreateTeacherAdminDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      schoolId: '1',
      specialization: 'Jazz vocal',
      role: 'teacher',
      bio: 'Vocal teacher',
      rating: 4.5,
    };

    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
    };

    const mockUserSchool = {
      id: '1',
      userId: '1',
      schoolId: '1',
    };

    const mockRoleAssignment = {
      id: '1',
      userSchoolId: '1',
      role: 'teacher',
    };

    const mockTeacher = {
      id: '1',
      userSchoolId: '1',
      specialization: 'Jazz vocal',
      bio: 'Vocal teacher',
      rating: 4.5,
    };

    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    mockTx.user.create.mockResolvedValue(mockUser);
    mockTx.userSchool.create.mockResolvedValue(mockUserSchool);
    mockTx.roleAssignment.create.mockResolvedValue(mockRoleAssignment);
    mockTx.teacher.create.mockResolvedValue(mockTeacher);

    const result = await service.createTeacherAdmin(mockCreateDto);

    expect(result).toEqual({ user: mockUser, teacher: mockTeacher });
    expect(bcrypt.genSalt).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
    expect(mockTx.user.create).toHaveBeenCalledWith({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      },
    });
    expect(mockTx.userSchool.create).toHaveBeenCalledWith({
      data: { userId: '1', schoolId: '1' },
    });
    expect(mockTx.roleAssignment.create).toHaveBeenCalledWith({
      data: { userSchoolId: '1', role: 'teacher' },
    });
    expect(mockTx.teacher.create).toHaveBeenCalledWith({
      data: {
        userSchool: { connect: { id: '1' } },
        specialization: 'Jazz vocal',
        bio: 'Vocal teacher',
        rating: 4.5,
      },
    });
  });

  it('should throw an error if user creation fails', async () => {
    const mockCreateDto: CreateTeacherAdminDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      schoolId: '1',
      specialization: 'Jazz vocal',
      role: 'teacher',
      bio: 'Vocal teacher',
      rating: 4.5,
    };

    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    mockTx.user.create.mockResolvedValue(null);

    await expect(service.createTeacherAdmin(mockCreateDto)).rejects.toThrow(
      'Failed to create user',
    );
  });

  it('should throw an error if userSchool creation fails', async () => {
    const mockCreateDto: CreateTeacherAdminDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      schoolId: '1',
      specialization: 'Jazz vocal',
      role: 'teacher',
      bio: 'Vocal teacher',
      rating: 4.5,
    };

    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
    };

    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    mockTx.user.create.mockResolvedValue(mockUser);
    mockTx.userSchool.create.mockResolvedValue(null);

    await expect(service.createTeacherAdmin(mockCreateDto)).rejects.toThrow(
      'Failed to create user-school relation',
    );
  });

  it('should throw an error if role assignment creation fails', async () => {
    const mockCreateDto: CreateTeacherAdminDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      schoolId: '1',
      specialization: 'Jazz vocal',
      role: 'teacher',
      bio: 'Vocal teacher',
      rating: 4.5,
    };

    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
    };
    const mockUserSchool = { id: '1', userId: '1', schoolId: '1' };

    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    mockTx.user.create.mockResolvedValue(mockUser);
    mockTx.userSchool.create.mockResolvedValue(mockUserSchool);
    mockTx.roleAssignment.create.mockResolvedValue(null);

    await expect(service.createTeacherAdmin(mockCreateDto)).rejects.toThrow(
      'Failed to assign role',
    );
  });

  it('should throw an error if teacher creation fails', async () => {
    const mockCreateDto: CreateTeacherAdminDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      schoolId: '1',
      specialization: 'Jazz vocal',
      role: 'teacher',
      bio: 'Vocal teacher',
      rating: 4.5,
    };

    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
    };
    const mockUserSchool = { id: '1', userId: '1', schoolId: '1' };
    const mockRoleAssignment = { id: '1', userSchoolId: '1', role: 'teacher' };

    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    mockTx.user.create.mockResolvedValue(mockUser);
    mockTx.userSchool.create.mockResolvedValue(mockUserSchool);
    mockTx.roleAssignment.create.mockResolvedValue(mockRoleAssignment);
    mockTx.teacher.create.mockRejectedValue(new Error('DB error'));

    await expect(service.createTeacherAdmin(mockCreateDto)).rejects.toThrow(
      'Error creating teacher Error: DB error',
    );
  });

  it('should default role to "teacher" if not provided', async () => {
    const mockCreateDto: CreateTeacherAdminDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      schoolId: '1',
      specialization: 'Jazz vocal',
      role: 'teacher',
      bio: 'Vocal teacher',
      rating: 4.5,
    };

    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
    };
    const mockUserSchool = { id: '1', userId: '1', schoolId: '1' };
    const mockRoleAssignment = { id: '1', userSchoolId: '1', role: 'teacher' };
    const mockTeacher = {
      id: '1',
      userSchoolId: '1',
      specialization: 'Jazz vocal',
      bio: 'Vocal teacher',
      rating: 4.5,
    };

    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    mockTx.user.create.mockResolvedValue(mockUser);
    mockTx.userSchool.create.mockResolvedValue(mockUserSchool);
    mockTx.roleAssignment.create.mockResolvedValue(mockRoleAssignment);
    mockTx.teacher.create.mockResolvedValue(mockTeacher);

    await service.createTeacherAdmin(mockCreateDto);

    expect(mockTx.roleAssignment.create).toHaveBeenCalledWith({
      data: { userSchoolId: '1', role: 'teacher' },
    });
  });
});
