/**
 * Configuración personalizada utilizada por SmartFetch para realizar
 * solicitudes HTTP.
 *
 * Extiende la configuración nativa de `RequestInit` de Fetch API,
 * agregando opciones específicas para controlar comportamiento
 * adicional como tiempos de espera y reintentos automáticos.
 *
 * @interface SmartFetchConfig
 *
 * @extends RequestInit
 *
 * @property {number} [timeout]
 * Tiempo máximo de espera de una solicitud en milisegundos antes
 * de generar un error por timeout.
 *
 * @property {number} [retries]
 * Cantidad de intentos permitidos para repetir una solicitud
 * cuando ocurre un fallo.
 *
 * @property {number} [retryDelay]
 * Tiempo de espera en milisegundos entre cada intento de reintento.
 */
export interface SmartFetchConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}


/**
 * Representa la estructura estándar de respuesta procesada
 * por SmartFetch.
 *
 * Encapsula la información principal obtenida de una petición HTTP,
 * incluyendo los datos recibidos, estado de la respuesta y metadatos
 * asociados.
 *
 * @template T
 * Tipo de datos esperado dentro del campo `data`.
 *
 * @interface HttpResponse
 *
 * @property {T} data
 * Contenido procesado de la respuesta, normalmente obtenido
 * mediante la conversión de JSON.
 *
 * @property {number} status
 * Código numérico del estado HTTP retornado por el servidor.
 *
 * @property {string} statusText
 * Descripción textual asociada al código de estado HTTP.
 *
 * @property {boolean} ok
 * Indica si la solicitud fue exitosa según la especificación
 * de Fetch API (códigos HTTP entre 200 y 299).
 *
 * @property {Headers}
 * Encabezados HTTP recibidos desde el servidor.
 */
export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  ok: boolean;
  headers: Headers;
}