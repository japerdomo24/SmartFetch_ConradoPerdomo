/**
 * Ejecuta una función asíncrona reintentando hasta N veces si ocurre una falla.
 */
export async function executeWithRetry(fn, retries = 1) {
    let attempt = 0;
    let lastError;
    while (attempt < retries) {
        try {
            return await fn();
        }
        catch (error) {
            attempt++;
            lastError = error;
            if (attempt >= retries) {
                throw lastError;
            }
            else {
                console.log(` [Reintento ${attempt}/${retries - 1}] Fallo detectado. Reintentando...`);
            }
        }
    }
    throw lastError;
}
//# sourceMappingURL=retry.js.map