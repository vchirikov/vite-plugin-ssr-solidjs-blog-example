import { injectable } from 'inversify';

import { noop } from '#shared/utils';

import type { LogFunction, Logger } from './logging';
import { LogLevel } from './logging';


type ConsoleMethod = 'error' | 'warn' | 'info' | 'debug' | 'trace';
type LogLevelStrings = keyof typeof LogLevel;

const consoleMap: { level: keyof Logger; method: ConsoleMethod; }[] = [
  { level: 'error', method: 'error' },
  { level: 'warn', method: 'warn' },
  { level: 'info', method: 'info' },
  { level: 'debug', method: 'debug' },
  { level: 'verbose', method: 'trace' },
];

@injectable()
class ConsoleLogger implements Logger {
  public constructor(logLevel: LogLevel) {
    // some environments only expose the console when the F12 developer console is open
    const level = console ? logLevel : LogLevel.None;

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const convert = (loggerMethod: keyof Logger): LogLevelStrings => {
      return (loggerMethod[0].toUpperCase() + loggerMethod.slice(1)) as LogLevelStrings;
    };

    for (const element of consoleMap) {
      if (level >= LogLevel[convert(element.level)]) {
        let func = console[element.method];
        // not all environments support all functions
        if (typeof func !== 'function') {
          func = console.log;
        }
        if (typeof func === 'function') {
          this[element.level] = (...args) => func.apply(console, args);
        }

      }
      this[element.level] ??= noop;
    }
  }

  /** Log an error scenario that was not expected and caused the requested operation to fail. */
  public error!: LogFunction;

  /**
   * Log a warning scenario to inform the developer of an issues that should be investigated.
   * The requested operation may or may not have succeeded or completed.
   */
  public warn!: LogFunction;

  /**
   * Log a general informational message, this should not affect functionality.
   * This is also the default logging level so this should NOT be used for logging
   * debugging level information.
   */
  public info!: LogFunction;

  /**
   * Log a general debug message that can be useful for identifying a failure.
   * Information logged at this level may include diagnostic details that would
   * help identify a failure scenario. Useful scenarios would be to log the execution
   * order of async operations
   */
  public debug!: LogFunction;

  /**
   * Log a detailed (verbose) trace level logging that can be used to identify failures
   * where debug level logging would be insufficient, this level of tracing can include
   * input and output parameters and as such may include PII information passing through
   * the API. As such it is recommended that this level of tracing should not be enabled
   * in a production environment.
   */
  public verbose!: LogFunction;
}

export { ConsoleLogger };