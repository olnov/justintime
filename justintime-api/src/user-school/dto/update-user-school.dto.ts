import { PartialType } from '@nestjs/swagger';
import { CreateUserSchoolDto } from './create-user-school.dto';

export class UpdateUserSchoolDto extends PartialType(CreateUserSchoolDto) {}
