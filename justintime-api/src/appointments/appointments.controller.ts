import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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
    return this.appointmentsService.create(createAppointmentDto);
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
