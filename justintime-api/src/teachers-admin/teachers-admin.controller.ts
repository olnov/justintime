import {
  Body,
  Controller,
  InternalServerErrorException, Logger,
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
  private readonly logger = new Logger(TeachersAdminService.name);
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
    this.logger.debug('Received payload:', createTeacherAdminDto);
    try {
      const result = await this.teachersAdminService.createTeacherAdmin(
        createTeacherAdminDto,
      );
      this.logger.debug('Resulted response:', result);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating teacher: ',
        error.message,
      );
    }
  }
}
