export interface Configuration {
  /** empty string or a base without slash at the end */
  basePath: string;
  /** scheme://server:port/basePath without slash at the end */
  servedUrl: string;
}