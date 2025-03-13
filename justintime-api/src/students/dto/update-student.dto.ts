import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';
import { IsOptional, IsString } from 'class-validator';

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

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @ApiProperty({
    description: 'Id of the existing Student',
    example: 'UUID',
    required: true,
  })
  @IsString()
  id: string;

  @ApiProperty({
    type: UpdateUserDataDto,
    required: false,
    description: 'Nested user update data',
  })
  @IsOptional()
  userData: UpdateUserDataDto;
}
