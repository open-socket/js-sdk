import { Logger, ManageLogger } from './logger';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
    };
  });

  describe('error', () => {
    it('should call the error method of the logger', () => {
      logger.error('Error message');
      expect(logger.error).toHaveBeenCalledWith('Error message');
    });
  });

  describe('warn', () => {
    it('should call the warn method of the logger', () => {
      logger.warn('Warning message');
      expect(logger.warn).toHaveBeenCalledWith('Warning message');
    });
  });

  describe('info', () => {
    it('should call the info method of the logger', () => {
      logger.info('Info message');
      expect(logger.info).toHaveBeenCalledWith('Info message');
    });
  });

  describe('debug', () => {
    it('should call the debug method of the logger', () => {
      logger.debug('Debug message');
      expect(logger.debug).toHaveBeenCalledWith('Debug message');
    });
  });
});

describe('ManageLogger', () => {
  let manageLogger: ManageLogger<any>;
  let logger: Logger;

  beforeEach(() => {
    logger = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
    };

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
