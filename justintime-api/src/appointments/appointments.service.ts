import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const { teacherId, studentId, schoolId, startTime, endTime, status } =
      createAppointmentDto;
    return this.prismaService.appointment.create({
      data: { teacherId, studentId, schoolId, startTime, endTime, status },
    });
  }

  async findAll() {
    return this.prismaService.appointment.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.appointment.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  async remove(id: string) {
    return this.prismaService.appointment.deleteMany({
      where: { id },
    });
  }

  async findBySchoolId(schoolId: string) {
    return this.prismaService.appointment.findMany({
      where: { schoolId },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
        notes: true,
        school: {
          select: {
            id: true,
            name: true,
          },
        },
        student: {
          select: {
            id: true,
            userSchool: {
              select: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        teacher: {
          select: {
            id: true,
            userSchool: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findBySchoolIdAndStudentId(schoolId: string, studentId: string) {
    return this.prismaService.appointment.findMany({
      where: {
        schoolId,
        studentId,
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
        notes: true,
        school: {
          select: {
            id: true,
            name: true,
          },
        },
        student: {
          select: {
            id: true,
            userSchool: {
              select: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        teacher: {
          select: {
            id: true,
            userSchool: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findBySchoolIdAndTeacherId(schoolId: string, teacherId: string) {
    return this.prismaService.appointment.findMany({
      where: {
        schoolId,
        teacherId,
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
        notes: true,
        school: {
          select: {
            id: true,
            name: true,
          },
        },
        student: {
          select: {
            id: true,
            userSchool: {
              select: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        teacher: {
          select: {
            id: true,
            userSchool: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
