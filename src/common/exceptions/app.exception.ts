import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    details?: any,
  ) {
    super(
      {
        message,
        details,
      },
      status,
    );
  }

  static badRequest(message: string, details?: any): AppException {
    return new AppException(message, HttpStatus.BAD_REQUEST, details);
  }

  static notFound(message: string, details?: any): AppException {
    return new AppException(message, HttpStatus.NOT_FOUND, details);
  }

  static internalError(message: string, details?: any): AppException {
    return new AppException(message, HttpStatus.INTERNAL_SERVER_ERROR, details);
  }
}
