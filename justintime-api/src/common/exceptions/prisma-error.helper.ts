import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma';

export function handlePrismaError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new ConflictException('Email already exists');
    }
  }
  throw new InternalServerErrorException('Database error');
}
