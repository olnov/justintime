import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional, IsPhoneNumber,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from 'generated/prisma';

export class CreateTeacherAdminDto {
  @ApiProperty({ description: "User's name", example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "User's email", example: 'john@doe.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // @ApiProperty({ description: "User's phone", example: '+7(903)222-22-22' })
  // @IsPhoneNumber()
  // phone: string;

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

  @ApiProperty({
    description: "Teacher's specialization",
    example: 'Extreme vocal',
  })
  @IsString()
  @IsOptional()
  specialization?: string;

  @ApiPropertyOptional({
    description: 'About the teacher',
    example: 'Worked with Maroon 5',
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ description: "Teacher's rating", example: '5,0' })
  @IsNumber()
  @IsOptional()
  rating?: number;
}
