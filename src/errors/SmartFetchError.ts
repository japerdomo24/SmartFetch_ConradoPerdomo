/**
 * Clase base para errores personalizados producidos por SmartFetch.
 */
export class SmartFetchError extends Error {
  /** Código de estado HTTP (si aplica) */
  public status?: number;
  /** Datos devueltos por el servidor (si los hay) */
  public data?: any;
  /** Indica si el error ocurrió debido a un timeout */
  public isTimeout: boolean;

  constructor(
    message: string, 
    status?: number, 
    data?: any, 
    isTimeout: boolean = false
  ) {
    super(message);
    this.name = 'SmartFetchError';
    this.status = status;
    this.data = data;
    this.isTimeout = isTimeout;

    // Mantiene la cadena de prototipos correcta en TypeScript
    Object.setPrototypeOf(this, SmartFetchError.prototype);
  }
}