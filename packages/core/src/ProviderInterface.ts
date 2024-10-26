export interface ProviderInterface {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendMessage(channel: string, message: string): Promise<void>;
  subscribe(channel: string, callback: (message: string) => void): void;
  unsubscribe(channel: string): void;
  presence?(channel: string): Promise<string[]>;

  // Additional methods if necessary
}
