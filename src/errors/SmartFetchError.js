/**
 * Error personalizado utilizado por SmartFetch para representar
 * fallos específicos durante la ejecución de solicitudes HTTP.
 *
 * Extiende la clase nativa `Error` y agrega información adicional
 * relacionada con peticiones HTTP, permitiendo identificar:
 *
 * - Código de estado HTTP asociado al fallo.
 * - Datos retornados por el servidor.
 * - Errores producidos por expiración de tiempo (timeout).
 *
 * @class SmartFetchError
 *
 * @extends Error
 */
export class SmartFetchError extends Error {
    /**
     * Código de estado HTTP asociado al error, si existe.
     *
     * @type {number}
     */
    status;
    /**
     * Información adicional enviada por el servidor,
     * cuando está disponible.
     *
     * @type {any}
     */
    data;
    /**
     * Indica si el error fue causado por la expiración
     * del tiempo máximo de espera configurado.
     *
     * @type {boolean}
     */
    isTimeout;
    /**
     * Crea una nueva instancia de SmartFetchError.
     *
     * @constructor
     *
     * @param {string} message
     * Mensaje descriptivo del error ocurrido.
     *
     * @param {number} [status]
     * Código de estado HTTP asociado al error.
     *
     * @param {any} [data]
     * Datos adicionales proporcionados por el servidor.
     *
     * @param {boolean} [isTimeout=false]
     * Indica si el error corresponde a un timeout.
     *
     * @example
     * throw new SmartFetchError(
     *   'Request timeout exceeded',
     *   undefined,
     *   undefined,
     *   true
     * );
     */
    constructor(message, status, data, isTimeout = false) {
        super(message);
        this.name = 'SmartFetchError';
        this.status = status;
        this.data = data;
        this.isTimeout = isTimeout;
        Object.setPrototypeOf(this, SmartFetchError.prototype);
    }
}
//# sourceMappingURL=SmartFetchError.js.map