import {vi} from 'vitest'

export const mockLoggerDebug = vi.fn();
export const mockLoggerError = vi.fn();
export const mockLoggerInfo = vi.fn();
export const mockLoggerLog = vi.fn();
export const mockLoggerTrace = vi.fn();
export const mockLoggerWarn = vi.fn();

export const Logger = vi.fn().mockImplementation(() => {
  return {
    debug: mockLoggerDebug,
    error: mockLoggerError,
    info: mockLoggerInfo,
    log: mockLoggerLog,
    trace: mockLoggerTrace,
    warn: mockLoggerWarn
  };
});

export const logger = new Logger();
