/**
 * Clase base para errores personalizados producidos por SmartFetch.
 */
export class SmartFetchError extends Error {
    /** Código de estado HTTP (si aplica) */
    status;
    /** Datos devueltos por el servidor (si los hay) */
    data;
    /** Indica si el error ocurrió debido a un timeout */
    isTimeout;
    constructor(message, status, data, isTimeout = false) {
        super(message);
        this.name = 'SmartFetchError';
        this.status = status;
        this.data = data;
        this.isTimeout = isTimeout;
        // Mantiene la cadena de prototipos correcta en TypeScript
        Object.setPrototypeOf(this, SmartFetchError.prototype);
    }
}
//# sourceMappingURL=SmartFetchError.js.map