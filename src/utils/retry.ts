/**
 * Ejecuta una función asíncrona reintentando hasta N veces si ocurre una falla.
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  retries: number = 1
): Promise<T> {
  let attempt = 0;
  let lastError: any;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      lastError = error;
      if (attempt >= retries) {
        throw lastError;
      }
    }
  }

  throw lastError;
}