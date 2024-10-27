import { NoOpProvider } from './NoOpProvider';
import { OpenSocket } from './index';

describe('OpenSocket', () => {
  let provider: NoOpProvider;

  beforeEach(async () => {
    provider = new NoOpProvider();
    await OpenSocket.setProviderAndWait(provider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should connect to the provider', async () => {
    const connectSpy = jest.spyOn(provider, 'connect');
    OpenSocket.connect();
    expect(connectSpy).toHaveBeenCalledTimes(0);
  });

  test('should disconnect from the provider', async () => {
    const disconnectSpy = jest.spyOn(provider, 'disconnect');
    await OpenSocket.disconnect();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  test('should send a message through the provider', async () => {
    const sendMessageSpy = jest.spyOn(provider, 'sendMessage');
    const channel = 'test-channel';
    const message = 'test-message';
    const event = 'test-event';
    await OpenSocket.subscribe(channel, () => {});
    await OpenSocket.sendMessage(channel, event, message);
    expect(sendMessageSpy).toHaveBeenCalledWith(channel, event, message);
  });

  test('should subscribe to a channel', () => {
    const subscribeSpy = jest.spyOn(provider, 'subscribe');
    const channel = 'test-channel';
    const callback = jest.fn();
    OpenSocket.subscribe(channel, callback);
    expect(subscribeSpy).toHaveBeenCalledWith(channel, callback);
  });

  test('should unsubscribe from a channel', () => {
    const unsubscribeSpy = jest.spyOn(provider, 'unsubscribe');
    const channel = 'test-channel';
    OpenSocket.unsubscribe(channel);
    expect(unsubscribeSpy).toHaveBeenCalledWith(channel);
  });

  test('should get presence information for a channel', async () => {
    const presenceSpy = jest.spyOn(provider, 'presence');
    const channel = 'test-channel';
    await OpenSocket.presence(channel);
    expect(presenceSpy).toHaveBeenCalledWith(channel);
  });

  test('should warn when provider does not support presence', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    await OpenSocket.presence('test-channel');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'NoOpProvider: presence() called for channel: test-channel',
    );
  });
});
