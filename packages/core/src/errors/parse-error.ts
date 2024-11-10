import type { ErrorOptions } from './open-socket-error-abstract';
import { OpenSocketError } from './open-socket-error-abstract';
import { ErrorCode } from '../channel';

export class ParseError extends OpenSocketError {
  code: ErrorCode;
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    Object.setPrototypeOf(this, ParseError.prototype);
    this.name = 'ParseError';
    this.code = ErrorCode.PARSE_ERROR;
  }
}
