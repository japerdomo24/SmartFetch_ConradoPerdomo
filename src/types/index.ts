export interface SmartFetchConfig extends RequestInit {
  timeout?: number; // Tiempo máximo en ms
  retries?: number; // Número de reintentos (default: 1)
  retryDelay?: number; // Tiempo de espera entre reintentos en ms
}

/**
 * Representa la respuesta empaquetada que retorna SmartFetch.
 * @template T El tipo de datos que se espera en el cuerpo (data) de la respuesta.
 */
export interface HttpResponse<T = any> {
  /** Datos de la respuesta parseados (usualmente JSON) */
  data: T;
  /** Código de estado HTTP (ej. 200, 201, 404, 500) */
  status: number;
  /** Texto asociado al estado HTTP (ej. "OK", "Created") */
  statusText: string;
  /** Indica si la petición fue exitosa (status en el rango 200-299) */
  ok: boolean;
  /** Encabezados devueltos por el servidor */
  headers: Headers;
}