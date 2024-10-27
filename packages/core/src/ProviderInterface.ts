export interface ProviderInterface {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendMessage(channel: string, event: string, message: string): Promise<void>;
  subscribe(
    channel: string,
    event: string,
    callback: (message: string) => void,
  ): void;
  unsubscribe(channel: string): void;
  presence?(channel: string): Promise<string[]>;
  isReady(): boolean;
  // Additional methods if necessary
}
