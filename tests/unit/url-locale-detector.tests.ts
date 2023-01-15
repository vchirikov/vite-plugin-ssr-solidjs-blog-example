import { describe, expect, it } from 'vitest';

import { createUrlLocaleDetector } from '#shared/i18n/url-locale-detector';
import type { PageContext } from '#types';

describe('createUrlLocaleDetector', () => {
  it('should return en locale from /en/<url>', () => {
    const pageContext = { urlOriginal: '/en/foo' };
    const detector = createUrlLocaleDetector(pageContext as PageContext);
    const result = detector();
    expect(result).toEqual(['en']);
  });

  it('should return an empty array from /', () => {
    const pageContext = { urlOriginal: '/' };
    const detector = createUrlLocaleDetector(pageContext as PageContext);
    const result = detector();
    expect(result).toEqual([]);
  });

  it('should return an empty array from /<page>', () => {
    const pageContext = { urlOriginal: '/en-page' };
    const detector = createUrlLocaleDetector(pageContext as PageContext);
    const result = detector();
    expect(result).toEqual([]);
  });

  it('should return en locale from /en', () => {
    const pageContext = { urlOriginal: '/en' };
    const detector = createUrlLocaleDetector(pageContext as PageContext);
    const result = detector();
    expect(result).toEqual(['en']);
  });
});
