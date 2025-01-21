import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ description: 'User school id', example: 'UUID' })
  @IsString()
  userSchoolId: string;

  @ApiPropertyOptional({
    description: 'Grade level',
    example: '5.0',
  })
  @IsOptional()
  @IsString()
  gradeLevel: string;
}
