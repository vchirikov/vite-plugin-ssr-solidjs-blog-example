
function checkBrowser(): boolean {
  // Using `typeof window !== 'undefined'` alone is not enough for general use,
  // because of https://www.npmjs.com/package/ssr-window (╯°□°)╯︵ ┻━┻
  return typeof window !== 'undefined' && typeof window.scrollY === 'number';
}

export const isBrowser = checkBrowser();
