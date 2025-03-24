import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards, Query,
} from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @ApiOkResponse({ description: 'Successfully created school.' })
  @ApiInternalServerErrorResponse({
    description: 'Error while removing school.',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolsService.create(createSchoolDto);
  }

  @ApiOkResponse({ description: 'Successfully retrieved schools.' })
  @ApiInternalServerErrorResponse({
    description: 'Error while retrieving schools.',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    const parsedSkip = skip ? parseInt(skip, 10) : undefined;
    const parsedTake = take ? parseInt(take, 10) : undefined;
    return this.schoolsService.findAll(parsedSkip, parsedTake);
  }

  @ApiOkResponse({ description: 'Successfully retrieved school.' })
  @ApiNotFoundResponse({ description: 'School does not exist.' })
  @ApiInternalServerErrorResponse({
    description: 'Error while retrieving the school.',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.schoolsService.findOne(id);
  }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
  //   return this.schoolsService.update(id, updateSchoolDto);
  // }

  @ApiOkResponse({ description: 'School successfully deleted.' })
  @ApiNotFoundResponse({ description: 'School does not exist.' })
  @ApiInternalServerErrorResponse({
    description: 'Error while deleting the school.',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.schoolsService.remove(id);
  }
}
