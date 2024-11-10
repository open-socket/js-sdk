import type { ErrorOptions } from './open-socket-error-abstract';
import { OpenSocketError } from './open-socket-error-abstract';
import { ErrorCode } from '../channel';

export class TargetingKeyMissingError extends OpenSocketError {
  code: ErrorCode;
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    Object.setPrototypeOf(this, TargetingKeyMissingError.prototype);
    this.name = 'TargetingKeyMissingError';
    this.code = ErrorCode.TARGETING_KEY_MISSING;
  }
}
