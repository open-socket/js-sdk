import type { ErrorCode } from '../channel';

/**
 * Error Options were added in ES2022. Manually adding the type so that an
 * earlier target can be used.
 */
export type ErrorOptions = {
  cause?: unknown;
};

export abstract class OpenSocketError extends Error {
  abstract code: ErrorCode;
  cause?: unknown;
  constructor(message?: string, options?: ErrorOptions) {
    super(message);
    Object.setPrototypeOf(this, OpenSocketError.prototype);
    this.name = 'OpenSocketError';
    this.cause = options?.cause;
  }
}
