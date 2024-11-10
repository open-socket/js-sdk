export interface HistoryOptions {
  /** Maximum number of messages to retrieve. */
  limit?: number;
  /** Start time for message retrieval in milliseconds since epoch. */
  start?: number;
  /** End time for message retrieval in milliseconds since epoch. */
  end?: number;
  /** Whether to retrieve messages in reverse order. */
  reverse?: boolean;
}

export interface PresenceMember {
  /** Unique identifier for the user in the presence list. */
  userId: string;
  /** Timestamp for when the user joined the presence list. */
  connectedAt: number;
  /** The user's status (e.g., online, offline). */
  status: string;
  /** Additional properties that may be set by the provider. */
  [key: string]: string | number | boolean; // Define more specific types if needed
}

export enum ErrorCode {
  /**
   * Resolution attempted before provider was ready.
   */
  PROVIDER_NOT_READY = 'PROVIDER_NOT_READY',

  /**
   * The provider encountered an irrecoverable error.
   */
  PROVIDER_FATAL = 'PROVIDER_FATAL',

  /**
   * The requested message could not be found.
   */
  MESSAGE_NOT_FOUND = 'MESSAGE_NOT_FOUND',

  /**
   * The requested message could not be found.
   */
  CHANNEL_NOT_FOUND = 'CHANNEL_NOT_FOUND',

  /**
   * An error occurred parsing message data.
   */
  PARSE_ERROR = 'PARSE_ERROR',

  /**
   * Message type does not match expected type.
   */
  TYPE_MISMATCH = 'TYPE_MISMATCH',

  /**
   * Provider requires a targeting key, which was missing.
   */
  TARGETING_KEY_MISSING = 'TARGETING_KEY_MISSING',

  /**
   * The context does not meet provider requirements.
   */
  INVALID_CONTEXT = 'INVALID_CONTEXT',

  /**
   * General unspecified error.
   */
  GENERAL = 'GENERAL',
}
