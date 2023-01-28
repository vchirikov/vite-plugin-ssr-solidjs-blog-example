export function addTrailingSlash(url: string): string {
  return url.replace(/\/?$/, '/');
}