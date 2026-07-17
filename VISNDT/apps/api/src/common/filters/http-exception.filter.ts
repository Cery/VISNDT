import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message ?? exception.message;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      ({ status, message } = this.mapPrismaError(exception));
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation error';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(`[${status}] ${message}`, exception instanceof Error ? exception.stack : '');

    response.status(status).json({
      success: false,
      data: null,
      message: Array.isArray(message) ? message.join('; ') : message,
      timestamp: new Date().toISOString(),
    });
  }

  private mapPrismaError(error: Prisma.PrismaClientKnownRequestError): { status: number; message: string } {
    switch (error.code) {
      case 'P2002':
        return {
          status: HttpStatus.CONFLICT,
          message: `Unique constraint violation on: ${(error.meta?.target as string[])?.join(', ') ?? 'unknown'}`,
        };
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Record not found',
        };
      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `Foreign key constraint failed on: ${(error.meta?.field_name as string) ?? 'unknown'}`,
        };
      case 'P2014':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Relation violation',
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Database error: ${error.code}`,
        };
    }
  }
}