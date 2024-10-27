import {
  ProviderInterface,
  Message,
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
  private subscribedChannels: Set<string> = new Set();
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
  async setProviderAndWait(provider: ProviderInterface): Promise<void> {
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
    event: string,
    message: string | object,
  ): Promise<void>;

  async sendMessage(
    channel: string,
    eventOrMessage: string | object,
    message?: string | object,
  ) {
    if (!this.isConnected)
      throw new Error('OpenSocket: Not connected to the provider');
    if (!this.subscribedChannels.has(channel))
      throw new Error(`No active subscription for channel: ${channel}`);
    if (typeof eventOrMessage === 'string') {
      await this.provider.sendMessage(
        channel,
        eventOrMessage,
        message as string | object,
      );
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
    callback: (message: string | object) => void,
  ): void;

  /**
   * Subscribes to a specific event on a channel.
   * @param channel - The channel to subscribe to.
   * @param event - The event name.
   * @param callback - Function to handle incoming messages.
   * @throws Error if not connected to the provider.
   */
  subscribe(
    channel: string,
    event: string,
    callback: (message: string | object) => void,
  ): void;

  subscribe(
    channel: string,
    eventOrCallback: string | ((message: string | object) => void),
    callback?: (message: string | object) => void,
  ) {
    if (!this.isConnected)
      throw new Error('OpenSocket: Not connected to the provider');
    try {
      if (typeof eventOrCallback === 'string') {
        this.provider.subscribe(
          channel,
          eventOrCallback,
          callback as (message: string | object) => void,
        );
      } else {
        this.provider.subscribe(channel, eventOrCallback);
      }
      this.subscribedChannels.add(channel);
    } catch (error) {
      console.error(`Failed to subscribe to channel ${channel}:`, error);
      throw error;
    }
  }
  /**
   * Unsubscribes from a channel.
   * @param channel - The channel to unsubscribe from.
   * @throws Error if disconnection fails.
   */
  unsubscribe(channel: string): void;
  /**
   * Unsubscribes from a channel or event.
   * @param channel - The channel to unsubscribe from.
   * @param event - Optional event name.
   * @throws Error if disconnection fails.
   */
  unsubscribe(channel: string, event?: string): void;
  unsubscribe(channel: string, event?: string): void {
    if (!this.isConnected) {
      console.warn('OpenSocket: Not connected to the provider');
      return;
    }
    try {
      if (event) {
        this.provider.unsubscribe(channel, event);
      } else {
        this.provider.unsubscribe(channel);
      }
      this.subscribedChannels.delete(channel);
    } catch (error) {
      console.error(`Failed to unsubscribe from channel ${channel}:`, error);
      throw error;
    }
  }

  // Presence Management
  /**
   * Retrieves presence list for a channel.
   * @param channel - The target channel.
   * @returns A promise resolving to an array of user IDs.
   */
  async presence(channel: string): Promise<string[]> {
    if (!this.isConnected)
      throw new Error('OpenSocket: Not connected to the provider');
    if (this.provider.presence) {
      return await this.provider.presence(channel);
    }
    console.warn('Provider does not support presence.');
    return [];
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
    console.warn('Provider does not support entering presence.');
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
    console.warn('Provider does not support leaving presence.');
  }

  // Message History and Rewind
  /**
   * Retrieves message history for a channel.
   * @param channel - The target channel.
   * @param options - Optional parameters to filter history.
   * @returns A promise resolving to an array of messages.
   */
  async getHistory(
    channel: string,
    options?: HistoryOptions,
  ): Promise<Message[]> {
    if (!this.isConnected)
      throw new Error('OpenSocket: Not connected to the provider');
    if (this.provider.getHistory) {
      return await this.provider.getHistory(channel, options);
    }
    console.warn('Provider does not support message history.');
    return [];
  }

  /**
   * Rewinds the message stream for a channel.
   * @param channel - The target channel.
   * @param count - The number of messages to rewind.
   * @returns A promise that resolves once the rewind is complete.
   */
  async rewind(channel: string, count: number): Promise<void> {
    if (!this.isConnected)
      throw new Error('OpenSocket: Not connected to the provider');
    if (this.provider.rewind) {
      return await this.provider.rewind(channel, count);
    }
    console.warn('Provider does not support rewind.');
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
      console.warn('Provider does not support custom event handling.');
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
      console.warn('Provider does not support custom event handling.');
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
      console.warn('Provider does not support custom data.');
    }
  }
  /**
   * Retrieves the current presence in a channel, if supported.
   * @param channel - The channel to retrieve presence information for.
   * @returns A promise that resolves with an array of PresenceMember objects.
   */
  getCurrentPresence(channel: string) {
    if (this.provider.getCurrentPresence) {
      return this.provider.getCurrentPresence(channel);
    }
    console.warn('Provider does not support current presence.');
    return [];
  }

  /**
   * Sets an error handler callback, if supported by the provider.
   * @param callback - The callback function to handle errors.
   */
  onError(callback: (error: Error) => void) {
    if (this.provider.onError) {
      this.provider.onError(callback);
    } else {
      console.warn('Provider does not support error handling.');
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
    console.warn('Provider does not support reconnection.');
  }
}

// Export a singleton instance
export const OpenSocket = OpenSocketCore.getInstance();
