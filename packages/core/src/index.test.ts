import { NoOpProvider } from './NoOpProvider';
import { openSocket } from './index';

describe('OpenSocket', () => {
  let provider: NoOpProvider;

  beforeEach(() => {
    provider = new NoOpProvider();
    openSocket.setProvider(provider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should connect to the provider', async () => {
    const connectSpy = jest.spyOn(provider, 'connect');
    await openSocket.connect();
    expect(connectSpy).toHaveBeenCalled();
  });

  test('should disconnect from the provider', async () => {
    const disconnectSpy = jest.spyOn(provider, 'disconnect');
    await openSocket.disconnect();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  test('should send a message through the provider', async () => {
    const sendMessageSpy = jest.spyOn(provider, 'sendMessage');
    const channel = 'test-channel';
    const message = 'test-message';
    await openSocket.sendMessage(channel, message);
    expect(sendMessageSpy).toHaveBeenCalledWith(channel, message);
  });

  test('should subscribe to a channel', () => {
    const subscribeSpy = jest.spyOn(provider, 'subscribe');
    const channel = 'test-channel';
    const callback = jest.fn();
    openSocket.subscribe(channel, callback);
    expect(subscribeSpy).toHaveBeenCalledWith(channel, callback);
  });

  test('should unsubscribe from a channel', () => {
    const unsubscribeSpy = jest.spyOn(provider, 'unsubscribe');
    const channel = 'test-channel';
    openSocket.unsubscribe(channel);
    expect(unsubscribeSpy).toHaveBeenCalledWith(channel);
  });

  test('should get presence information for a channel', async () => {
    const presenceSpy = jest.spyOn(provider, 'presence');
    const channel = 'test-channel';
    await openSocket.presence(channel);
    expect(presenceSpy).toHaveBeenCalledWith(channel);
  });

  test('should warn when provider does not support presence', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    await openSocket.presence('test-channel');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'NoOpProvider: presence() called for channel: test-channel',
    );
  });
});
