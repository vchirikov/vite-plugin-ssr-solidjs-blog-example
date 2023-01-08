export type LogFunction = (message: string, ...args: unknown[]) => void;

/** Defines an logger interface which is used to log diagnostic */
export interface Logger {
  /** Log an error scenario that was not expected and caused the requested operation to fail. */
  error: LogFunction;

  /**
   * Log a warning scenario to inform the developer of an issues that should be investigated.
   * The requested operation may or may not have succeeded or completed.
   */
  warn: LogFunction;

  /**
   * Log a general informational message, this should not affect functionality.
   * This is also the default logging level so this should NOT be used for logging
   * debugging level information.
   */
  info: LogFunction;

  /**
   * Log a general debug message that can be useful for identifying a failure.
   * Information logged at this level may include diagnostic details that would
   * help identify a failure scenario.
   * For example: Logging the order of execution of async operations.
   */
  debug: LogFunction;

  /**
   * Log a detailed (verbose) trace level logging that can be used to identify failures
   * where debug level logging would be insufficient, this level of tracing can include
   * input and output parameters and as such may include PII information passing through
   * the API. As such it is recommended that this level of tracing should not be enabled
   * in a production environment.
   */
  verbose: LogFunction;
}


export enum LogLevel {
  /** Diagnostic Logging level setting to disable all logging (except and forced logs) */
  None = 0,

  /** Identifies an error scenario */
  Error = 30,

  /** Identifies a warning scenario */
  Warn = 50,

  /** General informational log message */
  Info = 60,

  /** General debug log message */
  Debug = 70,

  /**
   * Detailed trace level logging should only be used for development, should only be set
   * in a development environment.
   */
  Verbose = 80,

  /** Used to set the logging level to include all logging */
  All = 9999,
}