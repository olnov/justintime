// @ts-ignore
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: "User's name", example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ description: "User's email", example: 'john@doe.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "User's password", example: 'PaSSw0rd' })
  @IsString()
  @MinLength(5, { message: 'Password must be at least 5 characters long.' })
  @MaxLength(16, { message: 'Password cannot exceed 16 characters.' })
  password: string;

  @ApiProperty({ description: "Global admin indicator", example: 'true or false' })
  @IsBoolean()
  isGlobalAdmin: boolean;
}
