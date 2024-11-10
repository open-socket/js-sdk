import type { Message, MessageMetadata } from '../message';
import type { HistoryOptions, PresenceMember } from '../channel';
import type { Metadata, JsonValue } from '../types';

/**
 * The state of the provider.
 * Note that the provider's state is handled by the SDK.
 */
export enum ProviderStatus {
  /**
   * The provider has not been initialized and cannot yet evaluate flags.
   */
  NOT_READY = 'NOT_READY',

  /**
   * The provider is ready to resolve flags.
   */
  READY = 'READY',

  /**
   * The provider is in an error state and unable to evaluate flags.
   */
  ERROR = 'ERROR',

  /**
   * The provider's cached state is no longer valid and may not be up-to-date with the source of truth.
   */
  STALE = 'STALE',

  /**
   * The provider has entered an irrecoverable error state.
   */
  FATAL = 'FATAL',

  /**
   * The provider is reconciling its state with a context change.
   */
  RECONCILING = 'RECONCILING',
}

/**
 * Static data about the provider.
 */
export interface ProviderMetadata extends Readonly<Metadata> {
  readonly name: string;
}

export interface ProviderInterface {
  readonly metadata: ProviderMetadata;
  readonly status: ProviderStatus;
  /**
   * Establishes a connection to the provider.
   * @returns A promise that resolves once the connection is established.
   */
  connect(): Promise<void>;

  /**
   * Disconnects from the provider.
   * @returns A promise that resolves once the disconnection is complete.
   */
  disconnect(): Promise<void>;

  /**
   * Checks if the provider is ready for use.
   * @returns A boolean indicating if the provider is ready.
   */
  get isReady(): boolean;

  /**
   * Sends a message to a specific channel.
   * @param channel - The target channel.
   * @param message - The message content, which can be a string or an object.
   * @returns A promise that resolves once the message is sent.
   */
  sendMessage(channel: string, message: string | object): Promise<void>;

  /**
   * Sends a message to a specific channel with an event.
   * @param channel - The target channel.
   * @param event - The event name associated with the message.
   * @param message - The message content, which can be a string or an object.
   * @returns A promise that resolves once the message is sent.
   */
  sendMessage(channel: string, event: string | string[], message: string | object): Promise<void>;

  /**
   * Subscribes to a specific channel.
   * @param channel - The channel to subscribe to.
   * @param callback - The callback function to handle incoming messages, with optional metadata.
   */
  subscribe(channel: string, callback: (message: Message, metadata?: MessageMetadata) => void): void;

  /**
   * Subscribes to a specific event on a channel.
   * @param channel - The channel to subscribe to.
   * @param eventsOrOptions - The event(s) name or options to subscribe to.
   * @param callback - The callback function to handle incoming messages, with optional metadata.
   */
  subscribe(
    channel: string,
    eventsOrOptions: string | string[] | object,
    callback: (message: Message, metadata?: MessageMetadata) => void,
  ): void;

  /**
   * Unsubscribes from a channel.
   * @param channel - The channel to unsubscribe from.
   */
  unsubscribe(channel: string): Promise<void>;

  /**
   * Unsubscribes from a channel or event.
   * @param channel - The channel to unsubscribe from.
   * @param event - Optional event name to unsubscribe from.
   */
  unsubscribe(channel: string, event?: string): Promise<void>;

  /**
   * Retrieves the presence list for a channel.
   * @param channel - The channel to get the presence for.
   * @param callback - The callback function to handle the presence list.
   * @returns
   */
  presence?(channel: string, callback: (users: object) => void): void;

  /**
   * Retrieves the presence list for a channel for specific events.
   * @param channel - The channel to check.
   * @param events - The user to check for presence.
   * @param callback - The callback function to handle the presence status.
   * @returns A promise that resolves with the presence status.
   */
  presence?(channel: string, events: string | string[], callback: (users: object) => void): void;

  /**
   * Joins the presence list in a channel.
   * @param channel - The channel to join.
   * @param user - The user joining the presence list.
   * @returns A promise that resolves once the user has joined.
   */
  enterPresence?(channel: string, user: string | object): Promise<void>;

  /**
   * Updates the presence list in a channel.
   * @param channel - The channel to update.
   * @param user - The user to update in the presence list.
   * @returns A promise that resolves once the user has been updated.
   */
  updatePresence?(channel: string, user: string | object): Promise<void>;

  /**
   * Leaves the presence list in a channel.
   * @param channel - The channel to leave.
   * @param user - The user leaving the presence list.
   * @returns A promise that resolves once the user has left.
   */
  leavePresence?(channel: string, user: string | object): Promise<void>;

  /**
   * Retrieves the presence history for a channel.
   * @param channel - The channel to retrieve history for.
   * @returns A promise that resolves with an array of presence members.
   */
  presenceHistory?(channel: string): Promise<PresenceMember[]>;

  /**
   * Retrieves message history for a channel.
   * @param channel - The channel to retrieve history for.
   * @returns A promise that resolves with an array of messages.
   */
  history?(channel: string): Promise<Message[]>;

  /**
   * Retrieves message history for a channel.
   * @param channel - The channel to retrieve history for.
   * @param options - Optional parameters to filter history.
   * @returns A promise that resolves with an array of messages.
   */
  history?(channel: string, options?: HistoryOptions): Promise<Message[]>;

  /**
   * Rewinds the message stream for a channel.
   * @param channel - The channel to rewind.
   * @param count - The number of messages to rewind.
   * @returns A promise that resolves with an array of messages.
   */
  rewind?(channel: string, count: number): Promise<Message[]>;

  /**
   * Sets an event listener for custom provider events.
   * @param event - The event name to listen for.
   * @param callback - The callback function to handle the event data.
   */
  on?(event: string, callback: (data: JsonValue) => void): void;

  /**
   * Removes an event listener for a custom provider event.
   * @param event - The event name to remove the listener for.
   */
  off?(event: string): void;

  /**
   * Sets custom data for the provider, if supported.
   * @param data - The custom data object.
   */
  setCustomData?(data: JsonValue): void;

  /**
   * Sets an error handler callback, if supported by the provider.
   * @param callback - The callback function to handle errors.
   */
  onError?(callback: (error: Error) => void): void;

  /**
   * Reconnects to the provider, if supported.
   * @returns A promise that resolves once the reconnection is successful.
   */
  reconnect?(): Promise<void>;
}
