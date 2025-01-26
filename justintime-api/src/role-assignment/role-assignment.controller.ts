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
import { RoleAssignmentService } from './role-assignment.service';
import { CreateRoleAssignmentDto } from './dto/create-role-assignment.dto';
import { UpdateRoleAssignmentDto } from './dto/update-role-assignment.dto';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('role-assignment')
export class RoleAssignmentController {
  constructor(private readonly roleAssignmentService: RoleAssignmentService) {}

  @ApiOkResponse({ description: 'New role assignment created successfully.' })
  @ApiInternalServerErrorResponse({
    description: 'Error while updating role assignment.',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createRoleAssignmentDto: CreateRoleAssignmentDto) {
    return this.roleAssignmentService.create(createRoleAssignmentDto);
  }

  @ApiOkResponse({ description: 'Successfully retrieved role assignments.' })
  @ApiInternalServerErrorResponse({
    description: 'Error while retrieving role assignments.',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.roleAssignmentService.findAll();
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('/allWithDetails')
  findAllWithDetails() {
    return this.roleAssignmentService.findAllWithDetails();
  }

  @ApiOkResponse({ description: 'Successfully retrieved role assignment.' })
  @ApiNotFoundResponse({ description: 'Role assignment does not exist.' })
  @ApiInternalServerErrorResponse({
    description: 'Error retrieving role assignment.',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    const roleAssignment = this.roleAssignmentService.findOne(id);
    if (!roleAssignment) {
      throw new HttpException(
        'Role assignment does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.roleAssignmentService.findOne(id);
  }

  @ApiOkResponse({ description: 'Successfully updated role assignment.' })
  @ApiNotFoundResponse({ description: 'Role assignment does not exist.' })
  @ApiInternalServerErrorResponse({
    description: 'Error updating role assignment.',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoleAssignmentDto: UpdateRoleAssignmentDto,
  ) {
    const roleAssignment = this.roleAssignmentService.findOne(id);
    if (!roleAssignment) {
      throw new HttpException(
        'Role assignment does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.roleAssignmentService.update(id, updateRoleAssignmentDto);
  }

  @ApiOkResponse({ description: 'Successfully deleted role assignment.' })
  @ApiNotFoundResponse({ description: 'Role assignment does not exist.' })
  @ApiInternalServerErrorResponse({
    description: 'Error while deleting role assignment.',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    const roleAssignment = this.roleAssignmentService.findOne(id);
    if (!roleAssignment) {
      throw new HttpException(
        'Role assignment does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.roleAssignmentService.remove(id);
  }
}
