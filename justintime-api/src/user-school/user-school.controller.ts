import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards, HttpException, HttpStatus,
} from '@nestjs/common';
import { UserSchoolService } from './user-school.service';
import { CreateUserSchoolDto } from './dto/create-user-school.dto';
import { UpdateUserSchoolDto } from './dto/update-user-school.dto';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse, ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user-school')
export class UserSchoolController {
  constructor(private readonly userSchoolService: UserSchoolService) {}

  @ApiOkResponse({ description: 'Successfully created' })
  @ApiInternalServerErrorResponse({
    description: 'Error while creating the relation',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createUserSchoolDto: CreateUserSchoolDto) {
    return this.userSchoolService.create(createUserSchoolDto);
  }

  @ApiOkResponse({ description: 'Successfully retrieved relation' })
  @ApiInternalServerErrorResponse({ description: 'Error while retrieving relation' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.userSchoolService.findAll();
  }

  @ApiOkResponse({ description: 'Successfully retrieved the relation' })
  @ApiNotFoundResponse({ description: 'Relation not found' })
  @ApiInternalServerErrorResponse({ description: 'Error while retrieving the relation' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const userSchool = this.userSchoolService.findOne(id);
    if (!userSchool) {
      throw new HttpException('Relation not found', HttpStatus.NOT_FOUND);
    }
    return userSchool;
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserSchoolDto: UpdateUserSchoolDto,
  ) {
    return this.userSchoolService.update(id, updateUserSchoolDto);
  }

  @ApiOkResponse({ description: 'Relation successfully deleted' })
  @ApiNotFoundResponse({ description: 'Relation not found' })
  @ApiInternalServerErrorResponse({ description: 'Error while deleting the relation' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const userSchool = this.userSchoolService.findOne(id);
    if (!userSchool) {
      throw new HttpException('Relation not found', HttpStatus.NOT_FOUND);
    }
    return this.userSchoolService.remove(id);
  }
}
