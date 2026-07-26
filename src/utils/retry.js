/**
 * Ejecuta una función asíncrona aplicando reintentos automáticos
 * cuando ocurre un error durante su ejecución.
 *
 * La función intenta ejecutar la operación indicada hasta alcanzar
 * el número máximo de intentos configurado. Si todos los intentos
 * fallan, se lanza el último error capturado.
 *
 * @template T
 * Tipo del resultado retornado por la función asíncrona.
 *
 * @param {() => Promise<T>} fn
 * Función asíncrona que será ejecutada y reintentada en caso de fallo.
 *
 * @param {number} [retries=1]
 * Número máximo de intentos permitidos para ejecutar la operación.
 *
 * @returns {Promise<T>}
 * Resultado obtenido cuando la operación finaliza correctamente.
 *
 * @throws {Error}
 * Lanza el último error ocurrido cuando se agotan los intentos disponibles.
 *
 * @example
 * const result = await executeWithRetry(
 *   () => fetchData(),
 *   3
 * );
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