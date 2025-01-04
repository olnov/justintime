import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSchoolDto {
  @ApiProperty({ description: 'School name', example: 'VoiceUp' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Address',
    example: 'Moscow, Kremlin str. 34',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;
}
