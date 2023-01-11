export interface Frontmatter {
  title?: string;
  /** used in OpenGraph json */
  description?: string;
  /** used in OpenGraph json */
  canonical?: string;
  /** used for sorting and in OpenGraph json */
  date?: Date;
  /** used in OpenGraph json */
  modified_date?: Date;
  image?: OpenGraphImageInfo;
  /** fallback */
  [key: string]: any;
}

export interface OpenGraphImageInfo {
  /** filepath to the background image */
  background?: string;
  title?: string;
  text?: string;
  theme?: 'dark' | 'light';
}
