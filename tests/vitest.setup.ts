/** @file setup file for vitest here you can add some extension to expect for example */

// default method is run extend from
// import '@testing-library/jest-dom';
// but we doesn't want to use global: true (which is required for this), so let's run extend manually:
import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

expect.extend(matchers);
