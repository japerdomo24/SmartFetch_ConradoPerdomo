import type { SmartFetchConfig, HttpResponse } from './types/index.js';
import { SmartFetchError } from './errors/SmartFetchError.js';
import { createTimeoutSignal } from './utils/timeout.js';
import { executeWithRetry } from './utils/retry.js';
import { LogRequest } from './aspects/LogAspect.js';
import { AuditMetrics, getMetricsReport, PerformanceMetrics } from './aspects/MetricsAspect.js';
import { MeasureTime } from './aspects/MeasureTimeAspect.js';

/**
 * Cliente HTTP avanzado basado en Fetch API.
 *
 * SmartFetch proporciona una capa de abstracción sobre la API nativa
 * fetch incorporando funcionalidades adicionales como:
 *
 * - Configuración global de peticiones.
 * - Control automático de timeout.
 * - Sistema de reintentos.
 * - Manejo personalizado de errores HTTP.
 * - Headers globales.
 * - Autenticación mediante Bearer Token.
 * - Registro de logs.
 * - Auditoría de métricas.
 * - Medición de rendimiento.
 *
 * @class SmartFetch
 */
export class SmartFetch {

  /**
   * Configuración global utilizada como base para todas las solicitudes.
   *
   * @private
   * @type {SmartFetchConfig}
   */
  private defaultConfig: SmartFetchConfig;


  /**
   * Inicializa una nueva instancia de SmartFetch.
   *
   * Si no se proporcionan valores personalizados,
   * utiliza una configuración predeterminada:
   *
   * - Reintentos: 1 intento adicional.
   * - Timeout: 5000 ms.
   *
   * @constructor
   *
   * @param {SmartFetchConfig} defaultConfig
   * Configuración inicial opcional del cliente.
   *
   * @example
   * const client = new SmartFetch({
   *   timeout: 3000,
   *   retries: 2
   * });
   */
  constructor(defaultConfig: SmartFetchConfig = {}) {
    this.defaultConfig = { retries: 1, timeout: 5000, ...defaultConfig };
  }


  /**
   * Obtiene el reporte acumulado de métricas generadas
   * durante la ejecución del cliente.
   *
   * Las métricas incluyen información relacionada con:
   * - Cantidad de solicitudes realizadas.
   * - Tiempos de respuesta.
   * - Estados HTTP recibidos.
   *
   * @returns {PerformanceMetrics}
   * Reporte completo de rendimiento.
   */
  getMetrics(): PerformanceMetrics {
    return getMetricsReport();
  }


  /**
   * Modifica el tiempo máximo de espera predeterminado
   * para las solicitudes futuras.
   *
   * @param {number} timeoutMs
   * Tiempo límite en milisegundos antes de cancelar una petición.
   *
   * @returns {this}
   * Retorna la instancia actual para permitir encadenamiento.
   *
   * @example
   * client.setTimeout(10000);
   */
  setTimeout(timeoutMs: number): this {
    this.defaultConfig.timeout = timeoutMs;
    return this;
  }


  /**
   * Modifica la cantidad de reintentos automáticos
   * utilizados por defecto.
   *
   * @param {number} retries
   * Número máximo de intentos adicionales después de un fallo.
   *
   * @returns {this}
   */
  setRetries(retries: number): this {
    this.defaultConfig.retries = retries;
    return this;
  }


  /**
   * Agrega un header HTTP global para todas las solicitudes futuras.
   *
   * Los headers definidos mediante este método serán combinados
   * con los headers específicos enviados en cada petición.
   *
   * @param {string} name
   * Nombre del header HTTP.
   *
   * @param {string} value
   * Valor asociado al header.
   *
   * @returns {this}
   *
   * @example
   * client.setHeader('Accept', 'application/json');
   */
  setHeader(name: string, value: string): this {
    this.defaultConfig.headers = {
      ...this.defaultConfig.headers,
      [name]: value
    };

    return this;
  }


  /**
   * Configura automáticamente un token de autenticación Bearer.
   *
   * Equivale a establecer el header:
   *
   * Authorization: Bearer TOKEN
   *
   * @param {string} token
   * Token de autenticación proporcionado por el servidor.
   *
   * @returns {this}
   */
  setBearerToken(token: string): this {
    return this.setHeader('Authorization', `Bearer ${token}`);
  }


  /**
   * Ejecuta una solicitud HTTP genérica.
   *
   * Este método constituye la operación principal del cliente.
   * Todos los métodos auxiliares (GET, POST, PUT, PATCH y DELETE)
   * utilizan internamente esta función.
   *
   * Incluye:
   *
   * - Fusión de configuración global y local.
   * - Timeout mediante AbortController.
   * - Reintentos automáticos.
   * - Validación de errores HTTP.
   * - Conversión automática de respuesta JSON.
   * - Registro y auditoría mediante aspectos.
   *
   * @template T
   * Tipo esperado de la respuesta.
   *
   * @param {string} url
   * Dirección del recurso solicitado.
   *
   * @param {SmartFetchConfig} config
   * Configuración específica de la petición.
   *
   * @returns {Promise<HttpResponse<T>>}
   * Respuesta HTTP procesada con datos tipados.
   *
   * @throws {SmartFetchError}
   * Cuando ocurre un error HTTP, timeout o fallo del servidor.
   */
  @AuditMetrics()
  @MeasureTime(1000)
  @LogRequest()
  async request<T>(
    url: string,
    config: SmartFetchConfig = {}
  ): Promise<HttpResponse<T>> {

    const mergedConfig = { ...this.defaultConfig, ...config };
    const { timeout, retries, ...fetchOptions } = mergedConfig;


    return executeWithRetry(async () => {

      const { signal, cleanup } = createTimeoutSignal(timeout);

      try {

        const response = await fetch(url, {
          ...fetchOptions,
          signal
        });


        if (response.status >= 500 && response.status < 600) {
          throw new SmartFetchError(
            `Server error with status ${response.status}`,
            response.status
          );
        }


        if (!response.ok) {
          throw new SmartFetchError(
            `HTTP error! status: ${response.status}`,
            response.status
          );
        }


        const data = (await response.json()) as T;

        return {
          data,
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: response.headers
        };

      } catch (err: any) {

        if (err.name === 'AbortError') {
          throw new SmartFetchError(
            'Request timeout exceeded',
            undefined,
            undefined,
            true
          );
        }

        throw err;

      } finally {

        cleanup();

      }

    }, retries);
  }


  /**
   * Ejecuta una petición HTTP GET.
   *
   * @template T
   * Tipo esperado de respuesta.
   *
   * @param {string} url
   * URL del recurso.
   *
   * @param {SmartFetchConfig} [config]
   * Configuración adicional.
   *
   * @returns {Promise<HttpResponse<T>>}
   */
  get<T>(url: string, config?: SmartFetchConfig) {
    return this.request<T>(url, { ...config, method: 'GET' });
  }


  /**
   * Ejecuta una petición HTTP POST.
   *
   * Convierte automáticamente el cuerpo enviado
   * a formato JSON.
   *
   * @template T
   *
   * @param {string} url
   * URL destino.
   *
   * @param {any} body
   * Datos enviados al servidor.
   *
   * @param {SmartFetchConfig} [config]
   * Configuración adicional.
   *
   * @returns {Promise<HttpResponse<T>>}
   */
  post<T>(url: string, body?: any, config?: SmartFetchConfig) {
    return this.request<T>(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      }
    });
  }


  /**
   * Ejecuta una petición HTTP PUT.
   *
   * @template T
   * Tipo esperado de respuesta.
   *
   * @returns {Promise<HttpResponse<T>>}
   */
  put<T>(url: string, body?: any, config?: SmartFetchConfig) {
    return this.request<T>(url, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      }
    });
  }


  /**
   * Ejecuta una petición HTTP PATCH.
   *
   * Utilizado normalmente para actualizaciones parciales.
   *
   * @template T
   *
   * @returns {Promise<HttpResponse<T>>}
   */
  patch<T>(url: string, body?: any, config?: SmartFetchConfig) {
    return this.request<T>(url, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      }
    });
  }


  /**
   * Ejecuta una petición HTTP DELETE.
   *
   * @template T
   *
   * @param {string} url
   * URL del recurso a eliminar.
   *
   * @returns {Promise<HttpResponse<T>>}
   */
  delete<T>(url: string, config?: SmartFetchConfig) {
    return this.request<T>(url, {
      ...config,
      method: 'DELETE'
    });
  }
}