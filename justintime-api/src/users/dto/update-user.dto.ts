import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  MinLength,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: "User's name", example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: "User's email", example: 'john@doe.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: "User's password", example: 'PaSSw0rd' })
  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'Password must be at least 5 characters long.' })
  @MaxLength(16, { message: 'Password cannot exceed 16 characters.' })
  password?: string;

  @ApiProperty({
    description: 'Global admin indicator',
    example: 'true or false',
  })
  @IsOptional()
  @IsBoolean()
  isGlobalAdmin: boolean;

  @ApiPropertyOptional({
    description: "User's birth date",
    example: '10.12.1990',
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({
    description: "User's profile photo",
    example: 'https://s3bucket.server/user_photo.jpg',
  })
  @IsOptional()
  @IsString()
  userPhoto?: string;

  @ApiPropertyOptional({
    description: "User's phone",
    example: '+447407777777',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: "User's telegram account",
    example: '@johndoe',
  })
  @IsOptional()
  @IsString()
  telegram?: string;

  @ApiPropertyOptional({
    description: "User's other contacts",
    example: 'Whatsapp: ...',
  })
  @IsOptional()
  @IsString()
  otherContacts?: string;

  @ApiPropertyOptional({
    description: "User's address",
    example: '221B Baker St, London NW1 6XE',
  })
  @IsOptional()
  @IsString()
  address?: string;
}
