import { ProviderInterface } from './ProviderInterface';
import { NoOpProvider } from './NoOpProvider';

class OpenSocket {
  private static instance: OpenSocket;
  private provider: ProviderInterface = new NoOpProvider();

  private constructor() {}

  static getInstance(): OpenSocket {
    if (!OpenSocket.instance) {
      OpenSocket.instance = new OpenSocket();
    }
    return OpenSocket.instance;
  }

  setProvider(provider: ProviderInterface) {
    this.provider = provider;
  }

  async connect() {
    await this.provider.connect();
  }

  async disconnect() {
    await this.provider.disconnect();
  }

  async sendMessage(channel: string, message: string) {
    await this.provider.sendMessage(channel, message);
  }

  subscribe(channel: string, callback: (message: string) => void) {
    this.provider.subscribe(channel, callback);
  }

  unsubscribe(channel: string) {
    this.provider.unsubscribe(channel);
  }

  async presence(channel: string) {
    if (this.provider.presence) {
      return await this.provider.presence(channel);
    } else {
      console.warn('Provider does not support presence.');
      return null;
    }
  }
}

// Export a singleton instance
export const openSocket = OpenSocket.getInstance();
