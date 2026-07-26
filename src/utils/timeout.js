/**
 * Crea una señal de cancelación automática mediante AbortController.
 *
 * Permite establecer un tiempo máximo de ejecución para operaciones
 * asíncronas, como solicitudes HTTP realizadas mediante Fetch API.
 *
 * Cuando el tiempo configurado se supera, la señal generada ejecuta
 * la cancelación de la operación asociada.
 *
 * Si no se proporciona un tiempo límite, retorna una señal indefinida
 * junto con una función de limpieza vacía para mantener una interfaz
 * consistente.
 *
 * @function createTimeoutSignal
 *
 * @param {number} [timeoutMs]
 * Tiempo máximo de espera en milisegundos antes de cancelar la operación.
 *
 * @returns {{
 *   signal?: AbortSignal;
 *   cleanup: () => void;
 * }}
 * Objeto que contiene:
 *
 * - `signal`: Señal de cancelación compatible con APIs que utilizan
 *   AbortController.
 * - `cleanup`: Función encargada de liberar el temporizador asociado.
 *
 * @example
 * const { signal, cleanup } = createTimeoutSignal(5000);
 *
 * try {
 *   await fetch(url, { signal });
 * } finally {
 *   cleanup();
 * }
 */
export function createTimeoutSignal(timeoutMs) {
    if (!timeoutMs) {
        return {
            signal: undefined,
            cleanup: () => { }
        };
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return {
        signal: controller.signal,
        cleanup: () => clearTimeout(timer)
    };
}
//# sourceMappingURL=timeout.js.map