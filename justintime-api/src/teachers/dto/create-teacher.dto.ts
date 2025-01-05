import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({ description: 'Id from users_school table', example: 'UUID' })
  @IsString()
  @IsNotEmpty()
  userSchoolId: string;

  @ApiProperty({
    description: "Teacher's specialization",
    example: 'Extreme vocal',
  })
  @IsString()
  @IsNotEmpty()
  specialization: string;

  @ApiPropertyOptional({
    description: 'About the teacher',
    example: 'Worked with Maroon 5',
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ description: "Teacher's rating", example: '5,0' })
  @IsNumber()
  @IsNotEmpty()
  rating: number;
}
