import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'generated/prisma';

export class CreateRoleAssignmentDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ description: 'UUID form users_schools table' })
  userSchoolId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The name of the role' })
  role: Role;
}
