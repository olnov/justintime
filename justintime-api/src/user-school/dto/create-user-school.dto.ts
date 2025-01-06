import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserSchoolDto {
  @ApiProperty({ example: 'UUID from users table' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'UUID from schools table' })
  @IsUUID()
  @IsNotEmpty()
  schoolId: string;
}
