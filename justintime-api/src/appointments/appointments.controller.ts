import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards, ConflictException, InternalServerErrorException,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TeacherUnavailableError } from './errors/teacher-unavilable.error';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @ApiOkResponse({ description: 'Appointment successfully created' })
  @ApiInternalServerErrorResponse({
    description: 'Error while creating an appointment',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    try {
      return this.appointmentsService.create(createAppointmentDto);
    } catch (error) {
      if (error instanceof TeacherUnavailableError) {
        throw new ConflictException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @ApiOkResponse({ description: 'Appointments successfully retrieved' })
  @ApiInternalServerErrorResponse({
    description: 'Error while retrieving appointments',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @ApiOkResponse({ description: 'Appointments successfully retrieved' })
  @ApiInternalServerErrorResponse({
    description: 'Error while retrieving appointments',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('/school/:schoolId')
  async getBySchoolId(@Param('schoolId') schoolId: string) {
    return this.appointmentsService.findBySchoolId(schoolId);
  }

  @ApiOkResponse({ description: 'Appointments successfully retrieved' })
  @ApiInternalServerErrorResponse({
    description: 'Error while retrieving appointments',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('/school/:schoolId/teacher/:teacherId')
  async getBySchoolIdAndTeacherId(
    @Param('schoolId') schoolId: string,
    @Param('teacherId') teacherId: string,
  ) {
    return this.appointmentsService.findBySchoolIdAndTeacherId(
      schoolId,
      teacherId,
    );
  }

  @ApiOkResponse({ description: 'Appointment successfully retrieved' })
  @ApiInternalServerErrorResponse({
    description: 'Error while retrieving the appointment',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @ApiOkResponse({ description: 'Appointment successfully updated' })
  @ApiInternalServerErrorResponse({
    description: 'Error while updating appointment',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @ApiOkResponse({ description: 'Appointment successfully deleted' })
  @ApiInternalServerErrorResponse({
    description: 'Error while deleting the appointment',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
