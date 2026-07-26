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
export declare class SmartFetchError extends Error {
    /**
     * Código de estado HTTP asociado al error, si existe.
     *
     * @type {number}
     */
    status?: number;
    /**
     * Información adicional enviada por el servidor,
     * cuando está disponible.
     *
     * @type {any}
     */
    data?: any;
    /**
     * Indica si el error fue causado por la expiración
     * del tiempo máximo de espera configurado.
     *
     * @type {boolean}
     */
    isTimeout: boolean;
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
    constructor(message: string, status?: number, data?: any, isTimeout?: boolean);
}
//# sourceMappingURL=SmartFetchError.d.ts.map