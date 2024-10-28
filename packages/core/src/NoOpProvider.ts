import {
  ProviderInterface,
  Message,
  MessageMetadata,
  EventData,
  HistoryOptions,
  PresenceMember,
} from './ProviderInterface';

export class NoOpProvider implements ProviderInterface {
  async connect() {
    console.warn('NoOpProvider: connect() called');
  }

  async disconnect() {
    console.warn('NoOpProvider: disconnect() called');
  }

  isReady(): boolean {
    // Always return true for NoOpProvider
    return true;
  }

  async sendMessage(channel: string, message: string | object): Promise<void>;
  async sendMessage(
    channel: string,
    event: string,
    message: string | object,
  ): Promise<void>;
  async sendMessage(
    channel: string,
    arg2: string | object,
    message?: string | object,
  ): Promise<void> {
    if (typeof arg2 === 'string' && message) {
      console.warn(
        `NoOpProvider: sendMessage() called for channel: ${channel} with event: ${arg2}`,
        message,
      );
    } else {
      console.warn(
        `NoOpProvider: sendMessage() called for channel: ${channel}`,
        arg2,
      );
    }
  }

  subscribe(
    channel: string,
    callback: (message: string | object, metadata?: MessageMetadata) => void,
  ): void;
  subscribe(
    channel: string,
    event: string | string[] | object,
    callback: (message: string | object, metadata?: MessageMetadata) => void,
  ): void;
  subscribe(
    channel: string,
    arg2:
      | string
      | string[]
      | object
      | ((message: string | object, metadata?: MessageMetadata) => void),
    callback?: (message: string | object, metadata?: MessageMetadata) => void,
  ): void {
    if (typeof callback === 'function') {
      console.warn(
        `NoOpProvider: subscribe() called for channel: ${channel} with event: ${arg2}`,
      );
      callback('NoOpProvider: subscribe() called');
    } else if (typeof arg2 === 'function') {
      console.warn(`NoOpProvider: subscribe() called for channel: ${channel}`);
      arg2('NoOpProvider: subscribe() called');
    }
  }

  async unsubscribe(channel: string): Promise<void>;
  async unsubscribe(channel: string, event?: string): Promise<void>;
  async unsubscribe(channel: string, event?: string): Promise<void> {
    if (event) {
      console.warn(
        `NoOpProvider: unsubscribe() called for channel: ${channel} with event: ${event}`,
      );
    } else {
      console.warn(
        `NoOpProvider: unsubscribe() called for channel: ${channel}`,
      );
    }
  }

  async presence(channel: string): Promise<string[]> {
    console.warn(`NoOpProvider: presence() called for channel: ${channel}`);
    return Promise.resolve([]); // Return an empty presence list
  }

  async enterPresence(channel: string, user: string): Promise<void> {
    console.warn(
      `NoOpProvider: enterPresence() called for channel: ${channel} by user: ${user}`,
    );
  }

  async updatePresence(channel: string, user: string | object): Promise<void> {
    console.warn(
      `NoOpProvider: updatePresence() called for channel: ${channel} by user: ${user}`,
    );
    return Promise.resolve();
  }

  async leavePresence(channel: string, user: string): Promise<void> {
    console.warn(
      `NoOpProvider: leavePresence() called for channel: ${channel} by user: ${user}`,
    );
  }
  async presenceHistory(channel: string): Promise<PresenceMember[]> {
    console.warn(
      `NoOpProvider: presenceHistory() called for channel: ${channel}`,
    );
    return Promise.resolve([]); // Return an empty presence list
  }

  async history(channel: string, options?: HistoryOptions): Promise<Message[]> {
    console.warn(
      `NoOpProvider: history() called for channel: ${channel} with options:`,
      options,
    );
    return Promise.resolve([]); // Return an empty message history
  }

  async rewind(channel: string, count: number): Promise<Message[]> {
    console.warn(
      `NoOpProvider: rewind() called for channel: ${channel} with count: ${count}`,
    );
    return Promise.resolve([]); // Return an empty message history
  }

  on(event: string, callback: (data: EventData) => void): void {
    console.warn(`NoOpProvider: on() called for event: ${event}`);
    callback({ NoOpProvider: 'on() called' });
  }

  off(event: string): void {
    console.warn(`NoOpProvider: off() called for event: ${event}`);
  }

  setCustomData?(data: object): void {
    console.warn(`NoOpProvider: setCustomData() called with data:`, data);
  }

  async getCurrentPresence?(channel: string): Promise<PresenceMember[]> {
    console.warn(
      `NoOpProvider: getCurrentPresence() called for channel: ${channel}`,
    );
    return []; // Return an empty presence list
  }

  onError?(callback: (error: Error) => void): void {
    console.warn(`NoOpProvider: onError() called`);
    callback(new Error('NoOpProvider: onError() called'));
  }

  async reconnect?(): Promise<void> {
    console.warn(`NoOpProvider: reconnect() called`);
  }
}
