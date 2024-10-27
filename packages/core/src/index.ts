import { ProviderInterface } from './ProviderInterface';
import { NoOpProvider } from './NoOpProvider';

class OpenSocketCore {
  private static instance: OpenSocketCore;
  private provider: ProviderInterface = new NoOpProvider();
  private subscribedChannels: Set<string> = new Set();
  private isConnected = false;

  private constructor() {}

  static getInstance(): OpenSocketCore {
    if (!OpenSocketCore.instance) {
      OpenSocketCore.instance = new OpenSocketCore();
    }
    return OpenSocketCore.instance;
  }

  isProviderReady(): boolean {
    return this.provider.isReady();
  }

  async setProviderAndWait(provider: ProviderInterface) {
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
          .catch((error) => {
            reject(error);
          });
      }
    });
  }

  async connect() {
    if (this.isConnected) {
      return;
    }
    try {
      await this.provider.connect();
    } catch (error) {
      console.error('OpenSocket: Failed to connect:', error);
      throw error;
    }
  }

  async disconnect() {
    if (!this.isConnected) {
      return;
    }
    try {
      await this.provider.disconnect();
    } catch (error) {
      console.error('OpenSocket: Failed to disconnect:', error);
      throw error;
    }
  }

  async sendMessage(channel: string, event: string, message: string) {
    if (!this.isConnected) {
      const error = new Error(`OpenSocket: Not connected to the provider`);
      console.warn(error.message);
      throw error;
    }
    if (!this.subscribedChannels.has(channel)) {
      const error = new Error(
        `OpenSocket: No active subscription for channel: ${channel}`,
      );
      console.warn(error.message);
      throw error;
    }
    await this.provider.sendMessage(channel, event, message);
  }

  async subscribe(
    channel: string,
    event: string,
    callback: (message: string) => void,
  ) {
    if (!this.isConnected) {
      const error = 'OpenSocket: Not connected to the provider';
      console.warn(error);
      throw error;
    }
    try {
      this.subscribedChannels.add(channel);
      this.provider.subscribe(channel, event, callback);
    } catch (error) {
      console.error(`Failed to subscribe to channel ${channel}:`, error);
      throw error;
    }
  }

  unsubscribe(channel: string) {
    if (!this.isConnected) {
      console.warn('OpenSocket: Not connected to the provider');
      return;
    }
    try {
      this.subscribedChannels.delete(channel);
      this.provider.unsubscribe(channel);
    } catch (error) {
      console.error(`Failed to unsubscribe from channel ${channel}:`, error);
      throw error;
    }
  }

  async presence(channel: string) {
    if (!this.isConnected) {
      console.warn('OpenSocket: Not connected to the provider');
      return;
    }
    if (this.provider.presence) {
      return await this.provider.presence(channel);
    } else {
      console.warn('Provider does not support presence.');
      return null;
    }
  }
}

// Export a singleton instance
export const OpenSocket = OpenSocketCore.getInstance();
