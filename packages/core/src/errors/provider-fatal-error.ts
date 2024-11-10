import type { ErrorOptions } from './open-socket-error-abstract';
import { OpenSocketError } from './open-socket-error-abstract';
import { ErrorCode } from '../channel';

export class ProviderFatalError extends OpenSocketError {
  code: ErrorCode;
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    Object.setPrototypeOf(this, ProviderFatalError.prototype);
    this.name = 'ProviderFatalError';
    this.code = ErrorCode.PROVIDER_FATAL;
  }
}
