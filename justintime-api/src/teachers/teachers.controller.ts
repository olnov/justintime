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
  BadRequestException,
  Query,
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

  @ApiOkResponse({
    description: 'Teachers with schools retrieved successfully',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error while removing teacher with school',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('/allWithSchool')
  async allWithSchool() {
    return this.teachersService.findAllWithSchool();
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('/allBySchool/:id')
  async allBySchool(
    @Param('id') id: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const parsedSkip = skip ? parseInt(skip, 10) : undefined;
    const parsedTake = take ? parseInt(take, 10) : undefined;
    return this.teachersService.findBySchoolId(id, parsedSkip, parsedTake);
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

  @UseGuards(JwtAuthGuard)
  @Get('/userschool/:id')
  async findByUserSchoolId(@Param('id') id: string) {
    return this.teachersService.findByUserSchoolId(id);
  }

  @ApiOkResponse({ description: 'Teacher successfully updated' })
  @ApiNotFoundResponse({ description: 'Teacher not found' })
  @ApiInternalServerErrorResponse({
    description: 'Error while updating teacher',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Body() updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.teachersService.findOne(updateTeacherDto.id);
    if (!teacher) {
      throw new HttpException('Teacher not found', HttpStatus.NOT_FOUND);
    }
    return this.teachersService.update(updateTeacherDto);
  }

  @ApiOkResponse({ description: 'Teacher successfully removed' })
  @ApiNotFoundResponse({ description: 'Teacher not found' })
  @ApiInternalServerErrorResponse({
    description: 'Error while removing teacher',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.teachersService.remove(id);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException('Teacher not found', HttpStatus.NOT_FOUND);
      }
      throw new BadRequestException(error.message);
    }
  }
}
