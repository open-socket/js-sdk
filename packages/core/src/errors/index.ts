import { ErrorCode } from '../channel';
import { OpenSocketError } from './open-socket-error-abstract';
import { GeneralError } from './general-error';
import { ParseError } from './parse-error';
import { ProviderFatalError } from './provider-fatal-error';
import { ProviderNotReadyError } from './provider-not-ready-error';
import { TargetingKeyMissingError } from './targeting-key-missing-error';
import { TypeMismatchError } from './type-mismatch-error';

const instantiateErrorByErrorCode = (errorCode: ErrorCode, message?: string): OpenSocketError => {
  switch (errorCode) {
    case ErrorCode.GENERAL:
      return new GeneralError(message);
    case ErrorCode.PARSE_ERROR:
      return new ParseError(message);
    case ErrorCode.PROVIDER_FATAL:
      return new ProviderFatalError(message);
    case ErrorCode.PROVIDER_NOT_READY:
      return new ProviderNotReadyError(message);
    case ErrorCode.TARGETING_KEY_MISSING:
      return new TargetingKeyMissingError(message);
    case ErrorCode.TYPE_MISMATCH:
      return new TypeMismatchError(message);
    default:
      return new GeneralError(message);
  }
};

export {
  GeneralError,
  ParseError,
  ProviderFatalError,
  ProviderNotReadyError,
  TargetingKeyMissingError,
  TypeMismatchError,
  OpenSocketError,
  instantiateErrorByErrorCode,
};
