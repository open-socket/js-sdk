import type { JsonValue } from '../types';
/**
 * Contains an individual message that is sent to, or received from, Ably.
 */
export interface MessageProps {
  /**
   * The client ID of the publisher of this message.
   */
  clientId?: string;
  /**
   * The connection ID of the publisher of this message.
   */
  connectionId?: string;
  /**
   * The message payload, if provided.
   */
  data?: JsonValue;
  /**
   * This is typically empty, as all messages received from Ably are automatically decoded client-side using this value. However, if the message encoding cannot be processed, this attribute contains the remaining transformations not applied to the `data` payload.
   */
  encoding?: string;
  /**
   * A JSON object of arbitrary key-value pairs that may contain metadata, and/or ancillary payloads. Valid payloads include `push`, `delta`, `ref` and `headers`.
   */
  extras?: JsonValue;
  /**
   * Unique ID assigned by Ably to this message.
   */
  id?: string;
  /**
   * The event name.
   */
  name?: string;
  /**
   * Timestamp of when the message was received by Ably, as milliseconds since the Unix epoch.
   */
  timestamp?: number;
  /**
   * The action type of the message, one of the {@link MessageAction} enum values.
   */
  action?: MessageAction;
  /**
   * This message's unique serial.
   */
  serial?: string;
  /**
   * The serial of the message that this message is a reference to.
   */
  refSerial?: string;
  /**
   * The type of reference this message is, in relation to the message it references.
   */
  refType?: string;
  /**
   * If an `update` operation was applied to this message, this will be the timestamp the update occurred.
   */
  updatedAt?: number;
  /**
   * The serial of the operation that updated this message.
   */
  updateSerial?: string;
  /**
   * If this message resulted from an operation, this will contain the operation details.
   */
  operation?: Operation;
}

/**
 * Contains the details of an operation, such as update or deletion, supplied by the actioning client.
 */
export interface Operation {
  /**
   * The client ID of the client that initiated the operation.
   */
  clientId?: string;
  /**
   * The description provided by the client that initiated the operation.
   */
  description?: string;
  /**
   * A JSON object of string key-value pairs that may contain metadata associated with the operation.
   */
  metadata?: Record<string, string>;
}

/**
 * Message action has not been set.
 */
export type MESSAGE_UNSET = 'message.unset';

/**
 * Message action for a newly created message.
 */
export type MESSAGE_CREATE = 'message.create';

/**
 * Message action for an updated message.
 */
export type MESSAGE_UPDATE = 'message.update';

/**
 * Message action for a deleted message.
 */
export type MESSAGE_DELETE = 'message.delete';

/**
 * Message action for a newly created annotation.
 */
export type ANNOTATION_CREATE = 'annotation.create';

/**
 * Message action for a deleted annotation.
 */
export type ANNOTATION_DELETE = 'annotation.delete';

/**
 * Message action for a meta-message that contains channel occupancy information.
 */
export type META_OCCUPANCY = 'meta.occupancy';

/**
 * Describes the possible action types used on a Message.
 */
export type MessageAction =
  | MESSAGE_UNSET
  | MESSAGE_CREATE
  | MESSAGE_UPDATE
  | MESSAGE_DELETE
  | ANNOTATION_CREATE
  | ANNOTATION_DELETE
  | META_OCCUPANCY;

/**
 * A message received from Ably.
 */
export type Message = (MessageProps & Required<Pick<MessageProps, 'id' | 'timestamp' | 'serial' | 'action'>>) | string;

// Define a new interface for message metadata
export interface MessageMetadata {
  timestamp?: number; // Optional timestamp for the message
  userId?: string; // Optional user ID associated with the message
  event?: string; // Optional event name associated with the message
  [key: string]: string | number | boolean | undefined; // More specific types
}
