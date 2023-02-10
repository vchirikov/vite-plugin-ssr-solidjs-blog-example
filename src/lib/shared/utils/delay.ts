/** async version of {@link setTimeout} */
export function delay(timeout: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, timeout));
}
