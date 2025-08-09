/**Delays the running of a function. */
export function debounce<RetT, ArgsT extends any[]>(fn: (...args: ArgsT) => RetT, delay: number) {
  let timeout;
  return (...args: ArgsT) => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      await fn(...args);
    }, delay);
  };
}
