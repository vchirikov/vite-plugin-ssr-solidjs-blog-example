/* eslint-disable import/first */
/* eslint-disable simple-import-sort/imports */
// disable auto-mode for prism
if (typeof window !== 'undefined') {
  // @ts-expect-error {} is not a Prism namespace type
  window.Prism = window.Prism || {};
  window.Prism.manual = true;
}

import { languages, util, highlight as prismHighlight } from 'prismjs';

// we should load needed language into bundle (with side-effects)
// because prismjs doesn't work with bundler + dynamic loading
import 'prismjs/components/prism-yaml';

export function highlight(code: string, language: string): string {
  if (languages[language]) {
    return prismHighlight(code, languages[language], language);
  }
  return util.encode(code).toString();
}
