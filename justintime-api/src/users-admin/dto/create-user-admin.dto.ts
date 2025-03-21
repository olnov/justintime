import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserAdminDto {
  @ApiProperty({ description: "User's name", example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "User's email", example: 'john@doe.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "User's password", example: 'PaSSw0rd' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Password must be at least 5 characters long.' })
  @MaxLength(16, { message: 'Password cannot exceed 16 characters.' })
  password: string;

  @ApiProperty({ description: 'SchoolId UUID', example: 'UUID' })
  @IsUUID()
  @IsNotEmpty()
  schoolId: string;

  @ApiProperty({ description: 'Role' })
  @IsString()
  @IsNotEmpty()
  role: Role;
}
