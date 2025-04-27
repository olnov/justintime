import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetDto {
  @ApiProperty({ description: 'JWT token', example: 'JWT token' })
  @IsString()
  @IsNotEmpty({ message: 'Token is required' })
  token: string;

  @ApiProperty({ description: 'New password', example: 'Pa$Sw0rd' })
  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(5, { message: 'Password must be at least 5 characters long.' })
  @MaxLength(16, { message: 'Password cannot exceed 16 characters.' })
  password: string;
}
