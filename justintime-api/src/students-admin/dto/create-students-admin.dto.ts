import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'generated/prisma';

export class CreateStudentsAdminDto {
  @ApiProperty({ description: "User's name", example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "User's email", example: 'john@doe.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // @ApiProperty({ description: "User's password", example: 'PaSSw0rd' })
  // @IsString()
  // @IsNotEmpty()
  // @MinLength(5, { message: 'Password must be at least 5 characters long.' })
  // @MaxLength(16, { message: 'Password cannot exceed 16 characters.' })
  // password: string;

  @ApiProperty({ description: 'SchoolId UUID', example: 'UUID' })
  @IsUUID()
  @IsNotEmpty()
  schoolId: string;

  @ApiProperty({ description: 'Role' })
  @IsString()
  @IsNotEmpty()
  role: Role;

  @ApiPropertyOptional({
    description: 'Grade level',
    example: '5.0',
  })
  @IsOptional()
  @IsString()
  gradeLevel: string;
}
