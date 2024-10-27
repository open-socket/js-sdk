import { ProviderInterface } from './ProviderInterface';

export class NoOpProvider implements ProviderInterface {
  async connect() {
    console.warn('NoOpProvider: connect() called');
  }

  async disconnect() {
    console.warn('NoOpProvider: disconnect() called');
  }

  async sendMessage(channel: string, event: string, message: string) {
    console.warn(
      `NoOpProvider: sendMessage() called for channel: ${channel}`,
      message,
    );
  }

  subscribe(
    channel: string,
    event: string,
    callback: (message: string) => void,
  ) {
    console.warn(`NoOpProvider: subscribe() called for channel: ${channel}`);
    callback('NoOpProvider: subscribe() called');
  }

  unsubscribe(channel: string) {
    console.warn(`NoOpProvider: unsubscribe() called for channel: ${channel}`);
  }

  presence(channel: string) {
    console.warn(`NoOpProvider: presence() called for channel: ${channel}`);
    return new Promise<string[]>((resolve) => resolve([]));
  }
  // Implement isReady to check Ably's connection status
  isReady(): boolean {
    return true;
  }
}
