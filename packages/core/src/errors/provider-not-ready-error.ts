import type { ErrorOptions } from './open-socket-error-abstract';
import { OpenSocketError } from './open-socket-error-abstract';
import { ErrorCode } from '../channel';

export class ProviderNotReadyError extends OpenSocketError {
  code: ErrorCode;
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    Object.setPrototypeOf(this, ProviderNotReadyError.prototype);
    this.name = 'ProviderNotReadyError';
    this.code = ErrorCode.PROVIDER_NOT_READY;
  }
}
