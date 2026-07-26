export function createTimeoutSignal(timeoutMs?: number): { signal?: AbortSignal; cleanup: () => void } {
  if (!timeoutMs) {
    return { signal: undefined, cleanup: () => {} };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    cleanup: () => clearTimeout(timer)
  };
}