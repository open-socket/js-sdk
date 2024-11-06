import { OpenSocket } from './index';
import type { ProviderInterface } from './provider-interface';

// Mock implementation of the ProviderInterface
const mockProvider: jest.Mocked<ProviderInterface> = {
  name: 'MockProvider',
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn().mockResolvedValue(undefined),
  isReady: jest.fn().mockReturnValue(true),
  sendMessage: jest.fn().mockResolvedValue(undefined),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  presence: jest.fn().mockResolvedValue(['user1']),
  enterPresence: jest.fn().mockResolvedValue(undefined),
  leavePresence: jest.fn().mockResolvedValue(undefined),
  history: jest.fn().mockResolvedValue([]),
  rewind: jest.fn().mockResolvedValue(undefined),
  on: jest.fn(),
  off: jest.fn(),
  setCustomData: jest.fn(),
  onError: jest.fn(),
  reconnect: jest.fn().mockResolvedValue(undefined),
};

describe('OpenSocket', () => {
  beforeEach(async () => {
    await OpenSocket.setProvider(mockProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // test('should connect to the provider', async () => {
  //   await OpenSocket.connect();
  //   expect(mockProvider.connect).toHaveBeenCalledTimes(0);
  // });

  // test('should disconnect from the provider', async () => {
  //   await OpenSocket.disconnect();
  //   expect(mockProvider.disconnect).toHaveBeenCalled();
  // });

  test('should check if provider is ready', () => {
    const isReady = OpenSocket.isReady();
    expect(isReady).toBe(true);
    expect(mockProvider.isReady).toHaveBeenCalled();
  });

  test('should send a message through the provider', async () => {
    const channel = 'test-channel';
    const message = 'test-message';
    const event = 'test-event';
    await OpenSocket.subscribe(channel, event, jest.fn());
    await OpenSocket.sendMessage(channel, event, message);
    expect(mockProvider.sendMessage).toHaveBeenCalledWith(channel, event, message);
  });

  test('should subscribe to a channel', () => {
    const channel = 'test-channel';
    const event = 'test-event';
    const callback = jest.fn();
    OpenSocket.subscribe(channel, event, callback);
    expect(mockProvider.subscribe).toHaveBeenCalledWith(channel, event, callback);
  });

  test('should unsubscribe from a channel', () => {
    const channel = 'test-channel';
    const event = 'test-event';
    OpenSocket.unsubscribe(channel, event);
    expect(mockProvider.unsubscribe).toHaveBeenCalledWith(channel, event);
  });

  test('should get presence information for a channel', async () => {
    const channel = 'test-channel';
    OpenSocket.presence(channel, (presence) => {
      expect(presence).toEqual(['user1']);
      expect(mockProvider.presence).toHaveBeenCalledWith(channel);
    });
  });

  test('should join the presence list', async () => {
    const channel = 'test-channel';
    const user = 'user1';
    await OpenSocket.enterPresence(channel, user);
    expect(mockProvider.enterPresence).toHaveBeenCalledWith(channel, user);
  });

  test('should leave the presence list', async () => {
    const channel = 'test-channel';
    const user = 'user1';
    await OpenSocket.leavePresence(channel, user);
    expect(mockProvider.leavePresence).toHaveBeenCalledWith(channel, user);
  });

  test('should retrieve message history for a channel', async () => {
    const channel = 'test-channel';
    const history = await OpenSocket.history(channel);
    expect(history).toEqual([]);
    expect(mockProvider.history).toHaveBeenCalledWith(channel, undefined);
  });

  test('should rewind the message stream for a channel', async () => {
    const channel = 'test-channel';
    const count = 5;
    await OpenSocket.rewind(channel, count);
    expect(mockProvider.rewind).toHaveBeenCalledWith(channel, count);
  });

  test('should set an event listener for custom provider events', () => {
    const event = 'custom-event';
    const callback = jest.fn();
    OpenSocket.on(event, callback);
    expect(mockProvider.on).toHaveBeenCalledWith(event, callback);
  });

  test('should remove an event listener for custom provider events', () => {
    const event = 'custom-event';
    OpenSocket.off(event);
    expect(mockProvider.off).toHaveBeenCalledWith(event);
  });

  test('should set custom data for the provider', () => {
    const data = { some: 'data' };
    OpenSocket.setCustomData(data);
    expect(mockProvider.setCustomData).toHaveBeenCalledWith(data);
  });

  test('should set an error handler callback', () => {
    const errorCallback = jest.fn();
    OpenSocket.onError(errorCallback);
    expect(mockProvider.onError).toHaveBeenCalledWith(errorCallback);
  });

  test('should reconnect to the provider', async () => {
    await OpenSocket.reconnect();
    expect(mockProvider.reconnect).toHaveBeenCalled();
  });
});
