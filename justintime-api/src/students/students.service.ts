import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService} from "../prisma/prisma.service";

@Injectable()
export class StudentsService {
  constructor( private readonly prismaService: PrismaService) {
  }
  create(createStudentDto: CreateStudentDto) {
    const { userSchoolId, gradeLevel } = createStudentDto;
    
    return this.prismaService.student.create({
      data: { userSchoolId, gradeLevel },
    });
  }

  findAll() {
    return this.prismaService.student.findMany();
  }

  findOne(id: string) {
    return this.prismaService.student.findUnique({ where: { id } });
  }

  update(id: string, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: string) {
    return this.prismaService.student.delete({ where: { id } });
  }
}
