import type { Locales } from '#shared/i18n/i18n-types';

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
  [key: string]: unknown;
}

export interface OpenGraphImageInfo {
  /** filepath to the background image */
  background?: string;
  title?: string;
  text?: string;
  theme?: 'dark' | 'light';
}

export interface Post {
  matter?: Frontmatter;
  locale: Locales;
  code: string;
  /** slug without locale part, for example for _content/en/1.mdx: 1 */
  slug: string;
  /** image sha1 hash if presented, computed by frontmatter info, if doesn't met => regenerate image */
  image_hash?: string;
  filepath?: string;
}
