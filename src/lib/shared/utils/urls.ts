export function addTrailingSlash(url: string): string {
  return url.replace(/\/*$/, '/');
}

export function removeTrailingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}