import { SingletonProvider } from '../provider';
import type { Message, MessageMetadata } from '../message';
import type { HistoryOptions } from '../channel';
import type { JsonValue } from '../types';
import { DefaultLogger } from '../logger';
import type { Logger } from '../logger';
import { ProviderFatalError, ProviderNotReadyError } from '../errors';

/**
 * Core class for managing socket connections and interactions with a provider.
 */
export class Realtime {
  protected static instance: Realtime;
  protected _logger: Logger;

  private constructor(logger: Logger) {
    this._logger = logger;
  }

  /**
   * Retrieves the singleton instance of Realtime.
   * @param {Logger} _logger - The logger to use for this instance.
   * @returns {Realtime} The instance of Realtime.
   */
  static getInstance(_logger?: Logger): Realtime {
    if (!Realtime.instance) {
      const logger = _logger || new DefaultLogger();
      Realtime.instance = new Realtime(logger);
    }
    return Realtime.instance;
  }

  /**
   * Creates a new instance of Realtime.
   * @param {Logger} logger - The logger to use for this instance.
   * @returns {Realtime} The new instance of Realtime.
   */
  static createInstance(logger: Logger): Realtime {
    this.instance = new Realtime(logger);
    return this.instance;
  }

  /**
   * Sets the logger for this instance.
   * @param {Logger} logger - The logger to use.
   */
  setLogger(logger: Logger) {
    this._logger = logger;
  }
  // Messaging Methods with Overloads
  /**
   * Sends a message to a specified channel.
   * @param {string} channel - The target channel.
   * @param {string| object} message - Message content, either a string or object.
   * @returns {Promise<void>}
   */
  async sendMessage(channel: string, message: string | object): Promise<void>;
  /**
   * Sends a message with an event to a specified channel.
   * @param {string} channel - The target channel.
   * @param {string | string[]} event - The event name.
   * @param {string} message - Message content, either a string or object.
   * @throws Error if not connected or if no subscription to the channel.
   */
  async sendMessage(channel: string, event: string | string[], message: string | object): Promise<void>;

  async sendMessage(channel: string, eventOrMessage: string | string[] | object, message?: string | object) {
    const provider = SingletonProvider.getProvider();
    if (!provider?.isReady) {
      throw new ProviderNotReadyError('OpenSocket: Provider is not ready');
    }
    try {
      if ((typeof eventOrMessage === 'string' || Array.isArray(eventOrMessage)) && typeof message != 'undefined') {
        await provider.sendMessage(channel, eventOrMessage, message);
      } else {
        await provider.sendMessage(channel, eventOrMessage);
      }
    } catch (error) {
      this._logger.error(`Failed to send message to channel ${channel}:`, error);
      throw new ProviderFatalError('OpenSocket: Failed to send message', { cause: error });
    }
  }

  // Subscription Management with Overloads
  /**
   * Subscribes to a specific channel.
   * @param {string} channel - The channel to subscribe to.
   * @param {Function} callback - Function to handle incoming messages.
   * @returns {Promise<void>}
   */
  subscribe(channel: string, callback: (message: string | object, metadata?: MessageMetadata) => void): void;

  /**
   * Subscribes to a specific event on a channel.
   * @param {string} channel - The channel to subscribe to.
   * @param {string | string[] | object} eventOrOptions - The event name(s) or options to subscribe to.
   * @param {Function} callback - Function to handle incoming messages.
   * @returns {Promise<void>}
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
    const provider = SingletonProvider.getProvider();
    if (!provider.isReady) {
      throw new ProviderNotReadyError('OpenSocket: Provider is not ready');
    }
    try {
      if (
        typeof eventOrOptionsOrCallback === 'string' ||
        Array.isArray(eventOrOptionsOrCallback) ||
        typeof eventOrOptionsOrCallback === 'object'
      ) {
        provider.subscribe(
          channel,
          eventOrOptionsOrCallback,
          callback as (message: string | object, metadata?: MessageMetadata) => void,
        );
      } else if (typeof eventOrOptionsOrCallback === 'function') {
        provider.subscribe(
          channel,
          eventOrOptionsOrCallback as (message: string | object, metadata?: MessageMetadata) => void,
        );
      } else {
        throw new Error('OpenSocket: Invalid arguments for subscribe');
      }
    } catch (error) {
      console.error(`OpenSocket: Failed to subscribe to channel ${channel}:`, error);
      throw error;
    }
  }
  /**
   * Unsubscribes from a channel.
   * @param {string} channel - The channel to unsubscribe from.
   * @returns {Promise<void>}
   */
  unsubscribe(channel: string): Promise<void>;

  /**
   * Unsubscribes from a channel or event.
   * @param {string} channel - The channel to unsubscribe from.
   * @param {string} event - The event name to unsubscribe from.
   * @returns {Promise<void>}
   */
  unsubscribe(channel: string, event?: string): Promise<void>;
  async unsubscribe(channel: string, event?: string): Promise<void> {
    const provider = SingletonProvider.getProvider();
    if (!provider.isReady) {
      throw new ProviderNotReadyError('OpenSocket: Provider is not ready');
    }
    try {
      if (event) {
        await provider.unsubscribe(channel, event);
      } else {
        await provider.unsubscribe(channel);
      }
    } catch (error) {
      this._logger.error(`Failed to unsubscribe from channel ${channel}:`, error);
      throw new ProviderFatalError('OpenSocket: Failed to unsubscribe from channel', { cause: error });
    }
  }

  // Presence Management
  /**
   * Retrieves the presence list for a channel.
   * @param {string} channel - The channel to get the presence list for.
   * @param {Function} callback - The callback function to handle the presence list.
   * @returns {Promise<void>}
   */
  presence(channel: string, callback: (users: object) => void): void;

  /**
   * Retrieves the presence list for specific events in a channel.
   * @param {string} channel - The channel to get the presence list for.
   * @param {string} events - The event or events to filter the presence list by.
   * @param {Function} callback - The callback function to handle the presence list.
   * @returns {Promise<void>}
   */
  presence(channel: string, events: string | string[], callback: (users: object) => void): void;

  presence(
    channel: string,
    eventsOrCallback: string | string[] | ((users: object) => void),
    callback?: (users: object) => void,
  ) {
    const provider = SingletonProvider.getProvider();
    if (!provider.isReady) {
      throw new ProviderNotReadyError('OpenSocket: Provider is not ready');
    }
    try {
      if (provider.presence) {
        if (typeof eventsOrCallback === 'function') {
          // Single parameter: channel and callback only
          provider.presence(channel, eventsOrCallback);
        } else if (callback) {
          // Two parameters: channel, events, and callback
          provider.presence(channel, eventsOrCallback, callback);
        } else {
          throw new ProviderFatalError('OpenSocket: Invalid arguments for presence method');
        }
      } else {
        this._logger.warn('OpenSocket: Provider does not support presence.');
      }
    } catch (error) {
      this._logger.error(`Failed to retrieve presence for channel ${channel}:`, error);
      throw new ProviderFatalError('OpenSocket: Failed to retrieve presence', { cause: error });
    }
  }
  /**
   * Enters presence list for a channel.
   * @param {string} channel The target channel.
   * @param {string} user The user ID to add to the presence list.
   * @returns {Promise<void>}
   */
  async enterPresence(channel: string, user: string): Promise<void> {
    const provider = SingletonProvider.getProvider();
    if (!provider.isReady) {
      throw new ProviderNotReadyError('OpenSocket: Provider is not ready');
    }
    try {
      if (provider.enterPresence) {
        return await provider.enterPresence(channel, user);
      }
      this._logger.warn('OpenSocket: Provider does not support entering presence.');
    } catch (error) {
      this._logger.error(`Failed to enter presence for channel ${channel}:`, error);
      throw new ProviderFatalError('OpenSocket: Failed to enter presence', { cause: error });
    }
  }
  /**
   * Leaves presence list for a channel.
   * @param {string} channel The target channel.
   * @param {string} user The user ID to remove from the presence list.
   * @returns {Promise<void>}
   */
  async leavePresence(channel: string, user: string): Promise<void> {
    const provider = SingletonProvider.getProvider();
    if (!provider.isReady) {
      throw new ProviderNotReadyError('OpenSocket: Provider is not ready');
    }
    try {
      if (provider.leavePresence) {
        return await provider.leavePresence(channel, user);
      }
      this._logger.warn('OpenSocket: Provider does not support leaving presence.');
    } catch (error) {
      this._logger.error(`Failed to leave presence for channel ${channel}:`, error);
      throw new ProviderFatalError('OpenSocket: Failed to leave presence', { cause: error });
    }
  }

  // Message History and Rewind
  /**
   * Retrieves message history for a channel.
   * @param {string} channel - The target channel.
   * @returns {Promise<Message[]>} A promise resolving to an array of messages.
   */
  async history(channel: string): Promise<Message[]>;
  /**
   * Retrieves message history for a channel.
   * @param {string} channel - The target channel.
   * @param {HistoryOptions} options - Optional parameters to filter history.
   * @returns {Promise<Message[]>} A promise resolving to an array of messages.
   */
  async history(channel: string, options?: HistoryOptions): Promise<Message[]>;
  async history(channel: string, options?: HistoryOptions): Promise<Message[]> {
    const provider = SingletonProvider.getProvider();
    if (!provider.isReady) {
      throw new ProviderNotReadyError('OpenSocket: Provider is not ready');
    }
    try {
      if (provider.history) {
        if (options) {
          return await provider.history(channel, options);
        }
        return await provider.history(channel, options);
      }
      this._logger.warn('OpenSocket: Provider does not support message history.');
      return [];
    } catch (error) {
      this._logger.error(`Failed to retrieve message history for channel ${channel}:`, error);
      throw new ProviderFatalError('OpenSocket: Failed to retrieve message history', { cause: error });
    }
  }

  /**
   * Rewinds the message stream for a channel.
   * @param {string} channel - The target channel.
   * @param {number} count - The number of messages to rewind.
   * @returns {Promise<Message[]>} A promise that resolves once the rewind is complete.
   */
  async rewind(channel: string, count: number): Promise<Message[]> {
    const provider = SingletonProvider.getProvider();
    if (!provider.isReady) {
      throw new ProviderNotReadyError('OpenSocket: Provider is not ready');
    }
    try {
      if (provider.rewind) {
        return provider.rewind(channel, count);
      } else {
        this._logger.warn('OpenSocket: Provider does not support rewinding.');
        return Promise.resolve([]);
      }
    } catch (error) {
      this._logger.error(`Failed to rewind message history for channel ${channel}:`, error);
      throw new ProviderFatalError('OpenSocket: Failed to rewind message history', { cause: error });
    }
  }

  // Event-specific Handlers
  /**
   * Sets an event listener for custom provider events.
   * @param {string} event - The event name to listen for.
   * @param {Function} callback - The callback function to handle the event data.
   * @returns {void}
   */
  on(event: string, callback: (data: JsonValue) => void): void {
    const provider = SingletonProvider.getProvider();
    if (!provider.isReady) {
      throw new ProviderNotReadyError('OpenSocket: Provider is not ready');
    }
    try {
      if (provider.on) {
        provider.on(event, callback);
      } else {
        console.warn('OpenSocket: Provider does not support custom event handling.');
      }
    } catch (error) {
      this._logger.error(`Failed to set event listener for event ${event}:`, error);
      throw new ProviderFatalError('OpenSocket: Failed to set event listener', { cause: error });
    }
  }

  /**
   * Removes an event listener for a custom provider event.
   * @param {string} event - The event name to remove the listener for.
   * @returns {void}
   */
  off(event: string): void {
    const provider = SingletonProvider.getProvider();
    if (!provider.isReady) {
      throw new ProviderNotReadyError('OpenSocket: Provider is not ready');
    }
    try {
      if (provider.off) {
        provider.off(event);
      } else {
        this._logger.warn('OpenSocket: Provider does not support custom event handling.');
      }
    } catch (error) {
      this._logger.error(`Failed to remove event listener for event ${event}:`, error);
      throw new ProviderFatalError('OpenSocket: Failed to remove event listener', { cause: error });
    }
  }

  /**
   * Sets custom data for the provider.
   * @param {JsonValue} data - The custom data to set.
   * @returns {void}
   */
  setCustomData(data: JsonValue): void {
    const provider = SingletonProvider.getProvider();
    if (!provider.isReady) {
      throw new ProviderNotReadyError('OpenSocket: Provider is not ready');
    }
    try {
      if (provider.setCustomData) {
        provider.setCustomData(data);
      } else {
        this._logger.warn('OpenSocket: Provider does not support custom data.');
      }
    } catch (error) {
      this._logger.error('Failed to set custom data:', error);
      throw new ProviderFatalError('OpenSocket: Failed to set custom data', { cause: error });
    }
  }

  /**
   * Sets an error handler callback, if supported by the provider.
   * @param {Function} callback - The callback function to handle errors.
   * @returns {void}
   */
  onError(callback: (error: Error) => void) {
    const provider = SingletonProvider.getProvider();
    if (!provider.isReady) {
      throw new ProviderNotReadyError('OpenSocket: Provider is not ready');
    }
    try {
      if (provider.onError) {
        provider.onError(callback);
      } else {
        console.warn('OpenSocket: Provider does not support error handling.');
      }
    } catch (error) {
      this._logger.error('Failed to set error handler:', error);
      throw new ProviderFatalError('OpenSocket: Failed to set error handler', { cause: error });
    }
  }

  /**
   * Reconnects to the provider, if supported.
   * @returns {Promise<void>} A promise that resolves once the reconnection is successful.
   */
  async reconnect(): Promise<void> {
    const provider = SingletonProvider.getProvider();
    if (provider.reconnect) {
      await provider.reconnect();
      return Promise.resolve();
    } else if (provider.connect) {
      await provider.connect();
      return Promise.resolve();
    }
    this._logger.warn('OpenSocket: Provider does not support reconnection.');
  }
}

// Export a singleton instance
export default Realtime;
