import {
  Controller,
  Post,
  Body,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersAdminService } from './users-admin.service';
import { CreateUserAdminDto } from './dto/create-user-admin.dto';

@Controller('users-admin')
export class UsersAdminController {
  constructor(private readonly usersAdminService: UsersAdminService) {}

  @Post()
  @ApiOkResponse({
    description: 'User and related entities created successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'User and related creation failed',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async create(@Body() createUserAdminDto: CreateUserAdminDto) {
    try {
      return this.usersAdminService.createUserAdmin(createUserAdminDto);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating user and related entities:',
        error.message,
      );
    }
  }
}
