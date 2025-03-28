import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TeacherUnavailableError } from './errors/teacher-unavilable.error';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prismaService: PrismaService) {}

  private async checkTeacherAvailability(
    teacherId: string,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string,
  ) {
    const overlappingLessons = await this.prismaService.appointment.findFirst({
      where: {
        teacherId,
        id: excludeAppointmentId ? { not: excludeAppointmentId } : undefined,
        OR: [
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime },
          },
        ],
      },
    });

    return !overlappingLessons;
  }

  async create(createAppointmentDto: CreateAppointmentDto) {
    const { teacherId, studentId, schoolId, startTime, endTime, status } =
      createAppointmentDto;
    const isTeacherAvailable = await this.checkTeacherAvailability(
      createAppointmentDto.teacherId,
      createAppointmentDto.startTime,
      createAppointmentDto.endTime,
    );

    if (!isTeacherAvailable) {
      throw new TeacherUnavailableError(
        'Teacher is already booked at this time',
      );
    }
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
    const { teacherId, studentId, schoolId, startTime, endTime, status } =
      updateAppointmentDto;
    const isTeacherAvailable = await this.checkTeacherAvailability(
      updateAppointmentDto.teacherId,
      updateAppointmentDto.startTime,
      updateAppointmentDto.endTime,
      updateAppointmentDto.id,
    );

    if (!isTeacherAvailable) {
      throw new TeacherUnavailableError(
        'Teacher is already booked at this time.',
      );
    }
    return this.prismaService.appointment.update({
      where: { id },
      data: { teacherId, studentId, schoolId, startTime, endTime, status },
    });
  }

  async remove(id: string) {
    return this.prismaService.appointment.delete({
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
