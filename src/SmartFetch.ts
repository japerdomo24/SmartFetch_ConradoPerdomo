// src/SmartFetch.ts
import type { SmartFetchConfig, HttpResponse } from './types/index.js';



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
}