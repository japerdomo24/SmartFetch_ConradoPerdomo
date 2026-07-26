// src/SmartFetch.ts
import type { SmartFetchConfig, HttpResponse } from './types/index.js';
import { SmartFetchError } from './errors/SmartFetchError.js';
import { createTimeoutSignal } from './utils/timeout.js';
import { executeWithRetry } from './utils/retry.js';

export class SmartFetch {
  private defaultConfig: SmartFetchConfig;

  constructor(defaultConfig: SmartFetchConfig = {}) {
    this.defaultConfig = { retries: 1, timeout: 5000, ...defaultConfig };
  }

  /**
   * Actualiza el tiempo máximo de espera por defecto (en milisegundos).
   */
  setTimeout(timeoutMs: number): this {
    this.defaultConfig.timeout = timeoutMs;
    return this; // Permite encadenamiento
  }

  /**
   * Actualiza el número de reintentos por defecto.
   */
  setRetries(retries: number): this {
    this.defaultConfig.retries = retries;
    return this;
  }

  /**
   * Establece un header por defecto para todas las peticiones futuras.
   */
  setHeader(name: string, value: string): this {
    this.defaultConfig.headers = {
      ...this.defaultConfig.headers,
      [name]: value
    };
    return this;
  }

  /**
   * Permite establecer un Token Bearer de forma rápida.
   */
  setBearerToken(token: string): this {
    return this.setHeader('Authorization', `Bearer ${token}`);
  }

  async request<T>(url: string, config: SmartFetchConfig = {}): Promise<HttpResponse<T>> {
    const mergedConfig = { ...this.defaultConfig, ...config };
    const { timeout, retries, ...fetchOptions } = mergedConfig;

    // 1. Usamos executeWithRetry para envolver la petición individual
    return executeWithRetry(async () => {
      // 2. Usamos createTimeoutSignal para manejar el tiempo de espera
      const { signal, cleanup } = createTimeoutSignal(timeout);

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          signal
        });

        // Si el servidor responde con 5xx, lanzamos error para que retry lo intente de nuevo
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
          throw new SmartFetchError('Request timeout exceeded', undefined, undefined, true);
        }
        throw err;
      } finally {
        cleanup(); // Limpiamos el timer del timeout al finalizar el intento
      }
    }, retries);
  }

  get<T>(url: string, config?: SmartFetchConfig) {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  post<T>(url: string, body?: any, config?: SmartFetchConfig) {
    return this.request<T>(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', ...config?.headers }
    });
  }

  put<T>(url: string, body?: any, config?: SmartFetchConfig) {
    return this.request<T>(url, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', ...config?.headers }
    });
  }

  patch<T>(url: string, body?: any, config?: SmartFetchConfig) {
    return this.request<T>(url, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', ...config?.headers }
    });
  }

  delete<T>(url: string, config?: SmartFetchConfig) {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }
}