export class CommonResult<T = any> {
  constructor(
    public code: number,
    public message: string,
    public data?: T,
    public timestamp: number = Date.now()
  ) {}

  static success<T>(data?: T, message = 'Success'): CommonResult<T> {
    return new CommonResult(200, message, data);
  }

  static error(message: string, code = 500): CommonResult {
    return new CommonResult(code, message);
  }
}

export class PageResult<T> {
  constructor(
    public list: T[],
    public total: number,
    public page: number,
    public pageSize: number
  ) {}
}

export class GlobalErrorCodeConstants {
  static readonly UNAUTHORIZED = 401;
  static readonly FORBIDDEN = 403;
  static readonly NOT_FOUND = 404;
  static readonly BAD_REQUEST = 400;
  static readonly INTERNAL_ERROR = 500;
  static readonly USER_NOT_EXISTS = 1001;
  static readonly USER_DISABLED = 1002;
  static readonly USER_PASSWORD_FAILED = 1003;
}

export class ErrorMessages {
  static readonly UNAUTHORIZED = 'Unauthorized';
  static readonly FORBIDDEN = 'Forbidden';
  static readonly NOT_FOUND = 'Not Found';
  static readonly BAD_REQUEST = 'Bad Request';
  static readonly INTERNAL_ERROR = 'Internal Server Error';
  static readonly [GlobalErrorCodeConstants.USER_NOT_EXISTS] = 'User does not exist';
  static readonly [GlobalErrorCodeConstants.USER_DISABLED] = 'User is disabled';
  static readonly [GlobalErrorCodeConstants.USER_PASSWORD_FAILED] = 'Password is incorrect';
}