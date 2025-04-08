import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TeachersAdminService } from './teachers-admin.service';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTeacherAdminDto } from './dto/teachers-admin-create.dto';

@Controller('teachers-admin')
export class TeachersAdminController {
  constructor(private readonly teachersAdminService: TeachersAdminService) {}

  @Post()
  @ApiOkResponse({
    description: 'User and related entities created successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'User and related creation failed',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async create(@Body() createTeacherAdminDto: CreateTeacherAdminDto) {
    try {
      return this.teachersAdminService.createTeacherAdmin(
        createTeacherAdminDto,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating teacher: ',
        error.message,
      );
    }
  }
}
