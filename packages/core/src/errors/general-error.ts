import type { ErrorOptions } from './open-socket-error-abstract';
import { OpenSocketError } from './open-socket-error-abstract';
import { ErrorCode } from '../channel';

export class GeneralError extends OpenSocketError {
  code: ErrorCode;
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    Object.setPrototypeOf(this, GeneralError.prototype);
    this.name = 'GeneralError';
    this.code = ErrorCode.GENERAL;
  }
}
