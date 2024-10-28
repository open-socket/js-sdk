import {
  ProviderInterface,
  Message,
  MessageMetadata,
  HistoryOptions,
  EventData,
} from './ProviderInterface';
import { NoOpProvider } from './NoOpProvider';

/**
 * Core class for managing socket connections and interactions with a provider.
 */
class OpenSocketCore {
  private static instance: OpenSocketCore;
  private provider: ProviderInterface = new NoOpProvider();
  private isConnected = false;

  private constructor() {}

  /**
   * Retrieves the singleton instance of OpenSocketCore.
   * @returns The instance of OpenSocketCore.
   */
  static getInstance(): OpenSocketCore {
    if (!OpenSocketCore.instance) {
      OpenSocketCore.instance = new OpenSocketCore();
    }
    return OpenSocketCore.instance;
  }

  /**
   * Checks if the current provider is ready.
   * @returns Boolean indicating if the provider is ready.
   */
  isReady(): boolean {
    return this.provider.isReady();
  }

  /**
   * Sets a provider and waits until it's connected or ready.
   * @param provider - The ProviderInterface instance to use.
   * @returns A promise that resolves once the provider is ready.
   */
  async setProvider(provider: ProviderInterface): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.provider = provider;
      if (this.provider.isReady()) {
        this.isConnected = true;
        resolve();
      } else {
        this.connect()
          .then(() => {
            this.isConnected = true;
            resolve();
          })
          .catch((error) => reject(error));
      }
    });
  }

  /**
   * Retrieves the current provider instance.
   * @returns The current provider instance.
   */
  getProvider(): ProviderInterface {
    return this.provider;
  }

  /**
   * Connects to the provider.
   * @throws Error if connection fails.
   */
  async connect(): Promise<void> {
    if (this.isConnected) return;
    try {
      await this.provider.connect();
      this.isConnected = true;
    } catch (error) {
      console.error('OpenSocket: Failed to connect:', error);
      throw error;
    }
  }

  /**
   * Disconnects from the provider.
   * @throws Error if disconnection fails.
   */
  async disconnect(): Promise<void> {
    if (!this.isConnected) return;
    try {
      await this.provider.disconnect();
      this.isConnected = false;
    } catch (error) {
      console.error('OpenSocket: Failed to disconnect:', error);
      throw error;
    }
  }

  // Messaging Methods with Overloads
  /**
   * Sends a message to a specified channel.
   * @param channel - The target channel.
   * @param message - Message content, either a string or object.
   * @throws Error if not connected or if no subscription to the channel.
   */
  async sendMessage(channel: string, message: string | object): Promise<void>;

  /**
   * Sends a message with an event to a specified channel.
   * @param channel - The target channel.
   * @param event - The event name.
   * @param message - Message content, either a string or object.
   * @throws Error if not connected or if no subscription to the channel.
   */
  async sendMessage(
    channel: string,
    event: string | string[],
    message: string | object,
  ): Promise<void>;

  async sendMessage(
    channel: string,
    eventOrMessage: string | string[] | object,
    message?: string | object,
  ) {
    if (!this.isConnected)
      throw new Error('OpenSocket: Not connected to the provider');

    if (
      (typeof eventOrMessage === 'string' || Array.isArray(eventOrMessage)) &&
      typeof message != 'undefined'
    ) {
      await this.provider.sendMessage(channel, eventOrMessage, message);
    } else {
      await this.provider.sendMessage(channel, eventOrMessage);
    }
  }

  // Subscription Management with Overloads
  /**
   * Subscribes to a specific channel.
   * @param channel - The channel to subscribe to.
   * @param callback - Function to handle incoming messages.
   * @throws Error if not connected to the provider.
   */
  subscribe(
    channel: string,
    callback: (message: string | object, metadata?: MessageMetadata) => void,
  ): void;

  /**
   * Subscribes to a specific event on a channel.
   * @param channel - The channel to subscribe to.
   * @param eventOrOptions - The event name(s) or options to subscribe to.
   * @param callback - Function to handle incoming messages.
   * @throws Error if not connected to the provider.
   */
  subscribe(
    channel: string,
    eventOrOptions: string | string[] | object,
    callback: (message: string | object, metadata?: MessageMetadata) => void,
  ): void;

  subscribe(
    channel: string,
    eventOrOptionsOrCallback:
      | string
      | string[]
      | object
      | ((message: string | object, metadata?: MessageMetadata) => void),
    callback?: (message: string | object, metadata?: MessageMetadata) => void,
  ) {
    if (!this.isConnected)
      throw new Error('OpenSocket: Not connected to the provider');
    try {
      if (
        typeof eventOrOptionsOrCallback === 'string' ||
        Array.isArray(eventOrOptionsOrCallback) ||
        typeof eventOrOptionsOrCallback === 'object'
      ) {
        this.provider.subscribe(
          channel,
          eventOrOptionsOrCallback,
          callback as (
            message: string | object,
            metadata?: MessageMetadata,
          ) => void,
        );
      } else if (typeof eventOrOptionsOrCallback === 'function') {
        this.provider.subscribe(
          channel,
          eventOrOptionsOrCallback as (
            message: string | object,
            metadata?: MessageMetadata,
          ) => void,
        );
      } else {
        throw new Error('OpenSocket: Invalid arguments for subscribe');
      }
    } catch (error) {
      console.error(
        `OpenSocket: Failed to subscribe to channel ${channel}:`,
        error,
      );
      throw error;
    }
  }
  /**
   * Unsubscribes from a channel.
   * @param channel - The channel to unsubscribe from.
   * @throws Error if disconnection fails.
   */
  unsubscribe(channel: string): Promise<void>;
  /**
   * Unsubscribes from a channel or event.
   * @param channel - The channel to unsubscribe from.
   * @param event - Optional event name.
   * @throws Error if disconnection fails.
   */
  unsubscribe(channel: string, event?: string): Promise<void>;
  async unsubscribe(channel: string, event?: string): Promise<void> {
    if (!this.isConnected) {
      console.warn('OpenSocket: Not connected to the provider');
      return;
    }
    try {
      if (event) {
        await this.provider.unsubscribe(channel, event);
      } else {
        await this.provider.unsubscribe(channel);
      }
    } catch (error) {
      console.error(`Failed to unsubscribe from channel ${channel}:`, error);
      throw error;
    }
  }

  // Presence Management
  /**
   * Retrieves the presence list for a channel.
   * @param channel - The channel to get the presence for.
   * @param callback - The callback function to handle the presence list.
   * @returns
   */
  presence(channel: string, callback: (users: object) => void): void;

  /**
   * Retrieves the presence list for a channel for specific events.
   * @param channel - The channel to check.
   * @param user - The user to check for presence.
   * @param callback - The callback function to handle the presence status.
   * @returns A promise that resolves with the presence status.
   */
  presence(
    channel: string,
    events: string | string[],
    callback: (users: object) => void,
  ): void;

  presence(
    channel: string,
    eventsOrCallback: string | string[] | ((users: object) => void),
    callback?: (users: object) => void,
  ) {
    if (!this.isConnected)
      throw new Error('OpenSocket: Not connected to the provider');
    if (this.provider.presence) {
      if (
        Array.isArray(eventsOrCallback) ||
        typeof eventsOrCallback === 'string'
      ) {
        this.provider.presence(
          channel,
          eventsOrCallback,
          callback as (users: object) => void,
        );
      } else if (typeof eventsOrCallback === 'function') {
        this.provider.presence(channel, eventsOrCallback);
      } else {
        throw new Error('OpenSocket: Invalid arguments for presence');
      }
    }
  }
  /**
   * Enters presence list for a channel.
   * @param channel The target channel.
   * @param user The user ID to add to the presence list.
   * @returns A promise that resolves once the user is added.
   */
  async enterPresence(channel: string, user: string): Promise<void> {
    if (!this.isConnected)
      throw new Error('OpenSocket: Not connected to the provider');
    if (this.provider.enterPresence) {
      return await this.provider.enterPresence(channel, user);
    }
    console.warn('OpenSocket: Provider does not support entering presence.');
  }
  /**
   * Leaves presence list for a channel.
   * @param channel The target channel.
   * @param user The user ID to remove from the presence list.
   * @returns A promise that resolves once the user is removed.
   */
  async leavePresence(channel: string, user: string): Promise<void> {
    if (!this.isConnected)
      throw new Error('OpenSocket: Not connected to the provider');
    if (this.provider.leavePresence) {
      return await this.provider.leavePresence(channel, user);
    }
    console.warn('OpenSocket: Provider does not support leaving presence.');
  }

  // Message History and Rewind
  /**
   * Retrieves message history for a channel.
   * @param channel - The target channel.
   * @param options - Optional parameters to filter history.
   * @returns A promise resolving to an array of messages.
   */
  async history(channel: string, options?: HistoryOptions): Promise<Message[]> {
    if (!this.isConnected)
      throw new Error('OpenSocket: Not connected to the provider');
    if (this.provider.history) {
      return await this.provider.history(channel, options);
    }
    console.warn('OpenSocket: Provider does not support message history.');
    return [];
  }

  /**
   * Rewinds the message stream for a channel.
   * @param channel - The target channel.
   * @param count - The number of messages to rewind.
   * @returns A promise that resolves once the rewind is complete.
   */
  async rewind(channel: string, count: number): Promise<Message[]> {
    if (!this.isConnected)
      throw new Error('OpenSocket: Not connected to the provider');
    if (this.provider.rewind) {
      return this.provider.rewind(channel, count);
    } else {
      console.warn('OpenSocket: Provider does not support rewinding.');
      return Promise.resolve([]);
    }
  }

  // Event-specific Handlers
  /**
   * Sets an event listener for custom provider events.
   * @param event - The event name to listen for.
   * @param callback - The callback function to handle the event data.
   */
  on(event: string, callback: (data: EventData) => void): void {
    if (this.provider.on) {
      this.provider.on(event, callback);
    } else {
      console.warn(
        'OpenSocket: Provider does not support custom event handling.',
      );
    }
  }

  /**
   * Removes an event listener for a custom provider event.
   * @param event - The event name to remove the listener for.
   */
  off(event: string): void {
    if (this.provider.off) {
      this.provider.off(event);
    } else {
      console.warn(
        'OpenSocket: Provider does not support custom event handling.',
      );
    }
  }

  /**
   * Sets custom data for the provider.
   * @param data - The custom data to set.
   */
  setCustomData(data: EventData): void {
    if (this.provider.setCustomData) {
      this.provider.setCustomData(data);
    } else {
      console.warn('OpenSocket: Provider does not support custom data.');
    }
  }

  /**
   * Sets an error handler callback, if supported by the provider.
   * @param callback - The callback function to handle errors.
   */
  onError(callback: (error: Error) => void) {
    if (this.provider.onError) {
      this.provider.onError(callback);
    } else {
      console.warn('OpenSocket: Provider does not support error handling.');
    }
  }

  /**
   * Reconnects to the provider, if supported.
   * @returns A promise that resolves once the reconnection is successful.
   */
  reconnect() {
    if (this.provider.reconnect) {
      return this.provider.reconnect();
    }
    console.warn('OpenSocket: Provider does not support reconnection.');
  }
}

// Export a singleton instance
export const OpenSocket = OpenSocketCore.getInstance();
