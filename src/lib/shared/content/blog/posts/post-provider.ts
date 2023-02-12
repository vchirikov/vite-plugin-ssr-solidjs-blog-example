import type { Locales } from '#shared/i18n/i18n-types';

import type { Post } from './post';

export interface PostProvider {
  all(locale: Locales): Promise<Post[]>;
  get(locale: Locales, slug?: string): Promise<Post | undefined>;
}