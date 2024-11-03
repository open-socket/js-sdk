import { NoOpProvider } from './no-op-provider';

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
    expect(consoleWarnSpy).toHaveBeenCalledWith('NoOpProvider: connect() called');
  });

  test('should log a warning when disconnect() is called', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    await provider.disconnect();
    expect(consoleWarnSpy).toHaveBeenCalledWith('NoOpProvider: disconnect() called');
  });

  test('should log a warning when sendMessage() is called without event', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    const channel = 'test-channel';
    const message = 'test-message';
    await provider.sendMessage(channel, message);
    expect(consoleWarnSpy).toHaveBeenCalledWith(`NoOpProvider: sendMessage() called for channel: ${channel}`, message);
  });

  test('should log a warning when sendMessage() is called with event', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    const channel = 'test-channel';
    const event = 'test-event';
    const message = 'test-message';
    await provider.sendMessage(channel, event, message);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `NoOpProvider: sendMessage() called for channel: ${channel} with event: ${event}`,
      message,
    );
  });

  test('should log a warning when subscribe() is called with event', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    const channel = 'test-channel';
    const event = 'test-event';
    const callback = jest.fn();
    provider.subscribe(channel, event, callback);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `NoOpProvider: subscribe() called for channel: ${channel} with event: ${event}`,
    );
    expect(callback).toHaveBeenCalledWith('NoOpProvider: subscribe() called');
  });

  test('should log a warning when subscribe() is called without event', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(); // Mock console.warn to prevent actual logging
    const channel = 'test-channel';
    const callback = jest.fn();

    // Call the subscribe method without providing an event
    provider.subscribe(channel, callback);

    // Check that the warning is logged
    expect(consoleWarnSpy).toHaveBeenCalledWith(`NoOpProvider: subscribe() called for channel: ${channel}`);
  });

  test('should run callback with subscribe() called', () => {
    const channel = 'test-channel';
    const callback = jest.fn();

    // Call the subscribe method without providing an event
    provider.subscribe(channel, callback);

    // Check that the callback is called with the expected message
    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith('NoOpProvider: subscribe() called');
  });

  test('should log a warning when unsubscribe() is called', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    const channel = 'test-channel';
    provider.unsubscribe(channel);
    expect(consoleWarnSpy).toHaveBeenCalledWith(`NoOpProvider: unsubscribe() called for channel: ${channel}`);
  });

  test('should log a warning and return an empty array when presence() is called', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    const channel = 'test-channel';
    const result = await provider.presence(channel);
    expect(consoleWarnSpy).toHaveBeenCalledWith(`NoOpProvider: presence() called for channel: ${channel}`);
    expect(result).toEqual([]);
  });

  test('should log a warning when enterPresence() is called', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    const channel = 'test-channel';
    const user = 'test-user';
    await provider.enterPresence(channel, user);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `NoOpProvider: enterPresence() called for channel: ${channel} by user: ${user}`,
    );
  });

  test('should log a warning when leavePresence() is called', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    const channel = 'test-channel';
    const user = 'test-user';
    await provider.leavePresence(channel, user);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `NoOpProvider: leavePresence() called for channel: ${channel} by user: ${user}`,
    );
  });

  test('should log a warning when history() is called', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    const channel = 'test-channel';
    const options = { limit: 10 };
    const result = await provider.history(channel, options);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `NoOpProvider: history() called for channel: ${channel} with options:`,
      options,
    );
    expect(result).toEqual([]);
  });

  test('should log a warning when rewind() is called', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    const channel = 'test-channel';
    const count = 5;
    await provider.rewind(channel, count);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `NoOpProvider: rewind() called for channel: ${channel} with count: ${count}`,
    );
  });

  test('should log a warning when on() is called', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    const event = 'test-event';
    const callback = jest.fn();
    provider.on(event, callback);
    expect(consoleWarnSpy).toHaveBeenCalledWith(`NoOpProvider: on() called for event: ${event}`);
  });

  test('should log a warning when off() is called', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    const event = 'test-event';
    provider.off(event);
    expect(consoleWarnSpy).toHaveBeenCalledWith(`NoOpProvider: off() called for event: ${event}`);
  });

  test('should return true for isReady()', () => {
    expect(provider.isReady()).toBe(true);
  });
});
