import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteDto {
  @ApiProperty({
    description: 'School ID UUID',
    example: '5a58eb99-98fe-4423-a075-25a3f001b012',
  })
  @IsNotEmpty({ message: 'School ID is required' })
  @IsUUID()
  schoolId: string;

  @ApiProperty({ description: 'Email address', example: 'john@example.com' })
  @IsNotEmpty({ message: 'Email address is required' })
  @IsEmail()
  email: string;
}
