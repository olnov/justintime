import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @ApiOkResponse({ description: 'Teacher successfully created' })
  @ApiInternalServerErrorResponse({
    description: 'Error while creating the teacher',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.create(createTeacherDto);
  }

  @ApiOkResponse({ description: 'Teachers successfully retrieved' })
  @ApiInternalServerErrorResponse({
    description: 'Error while retrieving teachers',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.teachersService.findAll();
  }

  @ApiOkResponse({ description: 'Teacher successfully retrieved' })
  @ApiNotFoundResponse({ description: 'Teacher not found' })
  @ApiInternalServerErrorResponse({
    description: 'Error while getting the teacher',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const teacher = await this.teachersService.findOne(id);
    if (!teacher) {
      throw new HttpException('Teacher not found', HttpStatus.NOT_FOUND);
    }
    return teacher;
  }

  @ApiOkResponse({ description: 'Teacher successfully updated' })
  @ApiNotFoundResponse({ description: 'Teacher not found' })
  @ApiInternalServerErrorResponse({
    description: 'Error while updating teacher',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.teachersService.findOne(id);
    if (!teacher) {
      throw new HttpException('Teacher not found', HttpStatus.NOT_FOUND);
    }
    return this.teachersService.update(id, updateTeacherDto);
  }

  @ApiOkResponse({ description: 'Teacher successfully removed' })
  @ApiNotFoundResponse({ description: 'Teacher not found' })
  @ApiInternalServerErrorResponse({ description: 'Error while removing teacher' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const teacher = await this.teachersService.findOne(id);
    if (!teacher) {
      throw new HttpException('Teacher not found', HttpStatus.NOT_FOUND);
    }
    return this.teachersService.remove(id);
  }
}
