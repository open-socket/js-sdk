import { Logger, ManageLogger } from './logger';
import { DefaultLogger } from './default-logger';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new DefaultLogger();
  });

  describe('error', () => {
    it('should call the error method of the logger', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error');
      logger.error('Error message');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error message');
      consoleErrorSpy.mockRestore();
    });
  });

  describe('warn', () => {
    it('should call the warn method of the logger', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn');
      logger.warn('Warning message');
      expect(consoleWarnSpy).toHaveBeenCalledWith('Warning message');
      consoleWarnSpy.mockRestore();
    });
  });

  describe('info', () => {
    it('should not call any console method', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error');
      const consoleWarnSpy = jest.spyOn(console, 'warn');
      logger.info('Info message');
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('debug', () => {
    it('should not call any console method', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error');
      const consoleWarnSpy = jest.spyOn(console, 'warn');
      logger.debug('Debug message');
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });
  });
});

describe('ManageLogger', () => {
  let manageLogger: ManageLogger<any>;
  let logger: Logger;

  beforeEach(() => {
    logger = new DefaultLogger();
    manageLogger = {
      setLogger: jest.fn(),
    };
  });

  describe('setLogger', () => {
    it('should call the setLogger method of the ManageLogger', () => {
      manageLogger.setLogger(logger);
      expect(manageLogger.setLogger).toHaveBeenCalledWith(logger);
    });
  });
});
