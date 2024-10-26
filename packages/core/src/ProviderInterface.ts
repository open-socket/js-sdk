export interface ProviderInterface {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendMessage(channel: string, message: any): Promise<void>;
  subscribe(channel: string, callback: (message: any) => void): void;
  unsubscribe(channel: string): void;
  presence?(channel: string): Promise<any>; // Optional method for presence support

  // Additional methods if necessary
}
