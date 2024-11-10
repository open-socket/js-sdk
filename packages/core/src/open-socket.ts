import { ProviderInterface, ProviderMetadata, SingletonProvider } from './provider';
import { DefaultLogger, Logger } from './logger';
import { Realtime } from './realtime';

/**
 * Core class for managing socket connections and interactions with a provider.
 */
class OpenSocketCore {
  protected static instance: OpenSocketCore;
  protected _logger = new DefaultLogger();
  public realtime: Realtime;

  private constructor() {
    this.realtime = Realtime.getInstance(this._logger);
  }

  /**
   * Retrieves the singleton instance of OpenSocketCore.
   * @returns {OpenSocketCore} The instance of OpenSocketCore.
   */
  static getInstance(): OpenSocketCore {
    try {
      if (!OpenSocketCore.instance) {
        OpenSocketCore.instance = new OpenSocketCore();
      }
    } catch (error) {
      OpenSocketCore.instance._logger.error('OpenSocket: Failed to create instance:', error);
    }
    return OpenSocketCore.instance;
  }

  /**
   * Checks if the current provider is ready.
   * @returns {boolean} Boolean indicating if the provider is ready.
   */
  get isReady(): boolean {
    return SingletonProvider.getProvider().isReady;
  }

  /**
   * Sets a provider and waits until it's connected or ready.
   * @param {ProviderInterface} provider - The ProviderInterface instance to use.
   * @returns {Promise<void>}
   */
  async setProvider(provider: ProviderInterface): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      SingletonProvider.setProvider(provider);
      if (SingletonProvider.getProvider().isReady) {
        resolve();
      } else {
        this.connect()
          .then(() => {
            resolve();
          })
          .catch((error) => {
            this._logger.error('OpenSocket: Failed to connect:', error);
            reject(error);
          });
      }
    });
  }

  /**
   * Retrieves the current provider instance.
   * @returns {ProviderMetadata}The current provider instance.
   */
  getProviderMetaData(): ProviderMetadata {
    return SingletonProvider.getProvider().metadata;
  }

  /**
   * Connects to the provider.
   * @returns {Promise<void>}
   */
  async connect(): Promise<void> {
    if (SingletonProvider.getProvider().isReady) return;
    try {
      await SingletonProvider.getProvider().connect();
    } catch (error) {
      this._logger.error('OpenSocket: Failed to connect:', error);
      throw error;
    }
  }

  /**
   * Disconnects from the provider.
   * @returns {Promise<void>}
   */
  async disconnect(): Promise<void> {
    if (!SingletonProvider.getProvider().isReady) return;
    try {
      await SingletonProvider.getProvider().disconnect();
    } catch (error) {
      this._logger.error('OpenSocket: Failed to disconnect:', error);
      throw error;
    }
  }

  /**
   * Sets the logger to use for logging messages.
   * @param {Logger} logger - The logger instance to use.
   * @returns {Promise<void>}
   */
  async setLogger(logger: Logger): Promise<void> {
    try {
      this._logger = logger;
      this.realtime.setLogger(logger);
    } catch (error) {
      this._logger.error('OpenSocket: Failed to set logger:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const OpenSocket = OpenSocketCore.getInstance();
export default OpenSocket;
