export interface ProviderInterface {
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
  isReady(): boolean;

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
  subscribe(channel: string, callback: (message: string | object, metadata?: MessageMetadata) => void): void;

  /**
   * Subscribes to a specific event on a channel.
   * @param channel - The channel to subscribe to.
   * @param eventsOrOptions - The event(s) name or options to subscribe to.
   * @param callback - The callback function to handle incoming messages, with optional metadata.
   */
  subscribe(
    channel: string,
    eventsOrOptions: string | string[] | object,
    callback: (message: string | object, metadata?: MessageMetadata) => void,
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
  on?(event: string, callback: (data: EventData) => void): void;

  /**
   * Removes an event listener for a custom provider event.
   * @param event - The event name to remove the listener for.
   */
  off?(event: string): void;

  /**
   * Sets custom data for the provider, if supported.
   * @param data - The custom data object.
   */
  setCustomData?(data: CustomData): void;

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

// Types for message history, presence, event data, and custom data
export interface Message {
  /** Unique identifier for the message. */
  id: string;
  /** Timestamp for when the message was sent. */
  timestamp: number;
  /** The data content of the message. */
  data: string | object;
  /** The channel from which the message was sent. */
  channel: string;
  /** The event name associated with the message, if any. */
  event: string;
}

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

// Define types for custom data and event data
export interface CustomData {
  [key: string]: string | number | boolean | object; // More specific as needed
}

export interface EventData {
  [key: string]: string | number | boolean | object; // More specific as needed
}

// Define a new interface for message metadata
export interface MessageMetadata {
  timestamp?: number; // Optional timestamp for the message
  userId?: string; // Optional user ID associated with the message
  event?: string; // Optional event name associated with the message
  [key: string]: string | number | boolean | undefined; // More specific types
}
