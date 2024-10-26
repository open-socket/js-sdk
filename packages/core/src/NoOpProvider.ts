import { ProviderInterface } from './ProviderInterface';

export class NoOpProvider implements ProviderInterface {
  async connect() {
    console.warn('NoOpProvider: connect() called');
  }

  async disconnect() {
    console.warn('NoOpProvider: disconnect() called');
  }

  async sendMessage(channel: string, message: any) {
    console.warn(
      `NoOpProvider: sendMessage() called for channel: ${channel}`,
      message,
    );
  }

  subscribe(channel: string, callback: (message: any) => void) {
    console.warn(`NoOpProvider: subscribe() called for channel: ${channel}`);
  }

  unsubscribe(channel: string) {
    console.warn(`NoOpProvider: unsubscribe() called for channel: ${channel}`);
  }

  async presence(channel: string) {
    console.warn(`NoOpProvider: presence() called for channel: ${channel}`);
    return {}; // Return empty presence data
  }
}
