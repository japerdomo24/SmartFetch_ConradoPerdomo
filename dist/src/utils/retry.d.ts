/**
 * Ejecuta una función asíncrona reintentando hasta N veces si ocurre una falla.
 */
export declare function executeWithRetry<T>(fn: () => Promise<T>, retries?: number): Promise<T>;
//# sourceMappingURL=retry.d.ts.map