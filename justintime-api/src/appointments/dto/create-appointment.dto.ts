import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsISO8601,
  IsEnum,
  ValidatorConstraint,
  ValidationArguments,
  ValidatorConstraintInterface,
  Validate, IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum AppointmentStatus {
  PLANNED = 'planned',
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@ValidatorConstraint({ name: 'isStartBeforeEnd', async: false })
class IsStartBeforeEnd implements ValidatorConstraintInterface {
  validate(endTime: Date, args: ValidationArguments): boolean {
    const dto = args.object as any;
    return dto.startTime < endTime;
  }
  defaultMessage() {
    return 'Start time must be earlier than end time';
  }
}

@ValidatorConstraint({ name: 'isFutureDate', async: false })
class IsFutureDate implements ValidatorConstraintInterface {
  validate(startTime: Date, args: ValidationArguments): boolean {
    const dto = args.object as any;
    const status = dto.status;

    if ([AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED].includes(status)) {
      return true;
    }

    return startTime > new Date();
  }

  defaultMessage(): string {
    return 'Start time must be in the future';
  }
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

  @ApiProperty({
    description: 'Start time and date in ISO 8601 format',
    example: '2024-02-20T09:00:00Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @Validate(IsFutureDate)
  startTime: Date;

  @ApiProperty({
    description: 'End time and date in ISO 8601 format',
    example: '2024-02-20T10:00:00Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @Validate(IsStartBeforeEnd)
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
  notes?: string;
}
