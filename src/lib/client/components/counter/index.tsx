import { createSignal } from 'solid-js';

export function Counter() {
  const [count, setCount] = createSignal(0);
  return <button data-testid='counter' onClick={() => setCount((prev) => prev + 1)}>Counter {count()}</button>;
}