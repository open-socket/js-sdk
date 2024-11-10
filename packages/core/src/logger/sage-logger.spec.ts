import { Logger, ManageLogger } from './logger';
import { SafeLogger } from './safe-logger';

describe('SafeLogger', () => {
  let logger: Logger;
  let safeLogger: SafeLogger;

  beforeEach(() => {
    logger = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
    };
    safeLogger = new SafeLogger(logger);
  });

  describe('error', () => {
    it('should call the error method of the logger', () => {
      safeLogger.error('Error message');
      expect(logger.error).toHaveBeenCalledWith('Error message');
    });
  });

  describe('warn', () => {
    it('should call the warn method of the logger', () => {
      safeLogger.warn('Warning message');
      expect(logger.warn).toHaveBeenCalledWith('Warning message');
    });
  });

  describe('info', () => {
    it('should call the info method of the logger', () => {
      safeLogger.info('Info message');
      expect(logger.info).toHaveBeenCalledWith('Info message');
    });
  });

  describe('debug', () => {
    it('should call the debug method of the logger', () => {
      safeLogger.debug('Debug message');
      expect(logger.debug).toHaveBeenCalledWith('Debug message');
    });
  });

  // describe('fallback to default logger', () => {
  //   beforeEach(() => {
  //     // errorSpy = jest.spyOn(global.console, 'error').mockImplementation();
  //     safeLogger = new SafeLogger({} as Logger);
  //   });

  //   it('should log an error message when the provided logger is missing a method', () => {
  //     safeLogger.error('Error message');
  //     expect(console.error).toHaveBeenCalledWith(new Error('The provided logger is missing the error method.'));
  //   });

  //   it('should log a fallback message when falling back to the default logger', () => {
  //     expect(console.error).toHaveBeenCalledWith('Falling back to the default logger.');
  //   });

  //   it('should call the error method of the fallback logger', () => {
  //     safeLogger.error('Error message');
  //     expect(safeLogger['fallbackLogger'].error).toHaveBeenCalledWith('Error message');
  //   });

  //   it('should call the warn method of the fallback logger', () => {
  //     safeLogger.warn('Warning message');
  //     expect(safeLogger['fallbackLogger'].warn).toHaveBeenCalledWith('Warning message');
  //   });

  //   it('should call the info method of the fallback logger', () => {
  //     safeLogger.info('Info message');
  //     expect(safeLogger['fallbackLogger'].info).toHaveBeenCalledWith('Info message');
  //   });

  //   it('should call the debug method of the fallback logger', () => {
  //     safeLogger.debug('Debug message');
  //     expect(safeLogger['fallbackLogger'].debug).toHaveBeenCalledWith('Debug message');
  //   });
  // });
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
