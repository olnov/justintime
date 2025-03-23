import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateStudentsAdminDto } from './dto/create-students-admin.dto';
import { StudentsAdminService } from './students-admin.service';

@Controller('students-admin')
export class StudentsAdminController {
  constructor(private readonly studentsAdminService: StudentsAdminService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    description: 'User and related entities created successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'User and related entities creation failed',
  })
  async create(@Body() createStudentsAdminDto: CreateStudentsAdminDto) {
    try {
      return this.studentsAdminService.createStudentAdmin(
        createStudentsAdminDto,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating student',
        error.message,
      );
    }
  }
}
