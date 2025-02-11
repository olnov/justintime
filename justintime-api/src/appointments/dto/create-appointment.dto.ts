import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsISO8601,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum AppointmentStatus {
  PLANNED = 'planned',
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class CreateAppointmentDto {
  @ApiProperty({ description: "Teacher's ID", example: 'UUID' })
  @IsNotEmpty()
  @IsString()
  teacherId: string;

  @ApiProperty({ description: "Student's ID", example: 'UUID' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ description: "School's ID", example: 'UUID' })
  @IsNotEmpty()
  @IsString()
  schoolId: string;

  @ApiProperty({ description: 'Start time and date in ISO 8601 format', example: '2024-02-20T09:00:00Z' })
  @IsNotEmpty()
  @IsISO8601()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({ description: 'End time and date in ISO 8601 format', example: '2024-02-20T10:00:00Z' })
  @IsNotEmpty()
  @IsISO8601()
  @Type(() => Date)
  endTime: Date;

  @ApiProperty({
    description: 'Status',
    example: 'planned, scheduled, completed or cancelled',
  })
  @IsNotEmpty()
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @ApiPropertyOptional({
    description: 'Notes',
    example: 'Some useful notes (optional)',
  })
  @IsString()
  @IsOptional()
  notes: string;
}
