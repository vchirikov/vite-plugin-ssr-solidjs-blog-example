import { detectLocale, localStorageDetector, navigatorDetector } from 'typesafe-i18n/detectors';
import { navigate } from 'vite-plugin-ssr/client/router';


import type { Locales } from './i18n-types';
import { locales } from './i18n-util';
import { loadLocaleAsync } from './i18n-util.async';

if(isBrowser)