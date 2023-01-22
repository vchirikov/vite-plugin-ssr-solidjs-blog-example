export interface Configuration {
  /** empty string or a base without slash at the end */
  basePath: string;
  /** starts scheme://server without slash at the end */
  servedUrl: string;
}