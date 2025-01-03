import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({ description: "User's email", example: 'john.doe@gmail.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty( { description: "User's password", example: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
