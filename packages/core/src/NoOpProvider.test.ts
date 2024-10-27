import { NoOpProvider } from './NoOpProvider';

describe('NoOpProvider', () => {
  let provider: NoOpProvider;

  beforeEach(() => {
    provider = new NoOpProvider();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should log a warning when connect() is called', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    await provider.connect();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'NoOpProvider: connect() called',
    );
  });

  test('should log a warning when disconnect() is called', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    await provider.disconnect();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'NoOpProvider: disconnect() called',
    );
  });

  test('should log a warning when sendMessage() is called', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    const channel = 'test-channel';
    const message = 'test-message';
    const event = 'test-event';
    await provider.subscribe(channel, () => {});
    await provider.sendMessage(channel, event, message);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `NoOpProvider: sendMessage() called for channel: ${channel}`,
      message,
    );
  });

  test('should log a warning when subscribe() is called', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    const channel = 'test-channel';
    const callback = jest.fn();
    provider.subscribe(channel, callback);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `NoOpProvider: subscribe() called for channel: ${channel}`,
    );
    expect(callback).toHaveBeenCalledWith('NoOpProvider: subscribe() called');
  });

  test('should log a warning when unsubscribe() is called', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    const channel = 'test-channel';
    provider.unsubscribe(channel);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `NoOpProvider: unsubscribe() called for channel: ${channel}`,
    );
  });

  test('should log a warning and return an empty array when presence() is called', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    const channel = 'test-channel';
    const result = await provider.presence(channel);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `NoOpProvider: presence() called for channel: ${channel}`,
    );
    expect(result).toEqual([]);
  });
});
