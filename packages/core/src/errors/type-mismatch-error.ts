import type { ErrorOptions } from './open-socket-error-abstract';
import { OpenSocketError } from './open-socket-error-abstract';
import { ErrorCode } from '../channel';

export class TypeMismatchError extends OpenSocketError {
  code: ErrorCode;
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    Object.setPrototypeOf(this, TypeMismatchError.prototype);
    this.name = 'TypeMismatchError';
    this.code = ErrorCode.TYPE_MISMATCH;
  }
}
