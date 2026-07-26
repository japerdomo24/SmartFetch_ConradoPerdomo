/**
 * Clase base para errores personalizados producidos por SmartFetch.
 */
export declare class SmartFetchError extends Error {
    /** Código de estado HTTP (si aplica) */
    status?: number;
    /** Datos devueltos por el servidor (si los hay) */
    data?: any;
    /** Indica si el error ocurrió debido a un timeout */
    isTimeout: boolean;
    constructor(message: string, status?: number, data?: any, isTimeout?: boolean);
}
//# sourceMappingURL=SmartFetchError.d.ts.map