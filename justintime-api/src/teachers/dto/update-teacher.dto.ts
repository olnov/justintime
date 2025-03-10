import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTeacherDto } from './create-teacher.dto';
import { IsString, IsOptional } from 'class-validator';

class UpdateUserDataDto {
  @ApiProperty({
    description: 'Id of the existing User',
    example: 'UUID',
    required: true,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Updated name of the User',
    example: 'Jason Born',
    required: false,
  })
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Updated email of the User',
    example: 'email@jason.com',
    required: false,
  })
  @IsString()
  email?: string;
}

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {
  @ApiProperty({
    description: 'Id of the existing Teacher',
    example: 'UUID',
    required: true,
  })
  @IsString()
  id: string;

  @ApiProperty({ type: UpdateUserDataDto, required: false, description: 'Nested user update data' })
  @IsOptional()
  userData: UpdateUserDataDto;
}
