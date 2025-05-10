// @ts-ignore
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {Transform} from "class-transformer";

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
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    return value.normalize('NFC');
  })
  password: string;

  @IsBoolean()
  isGlobalAdmin: boolean;
}
