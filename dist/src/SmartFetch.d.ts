import type { SmartFetchConfig, HttpResponse } from './types/index.js';
export declare class SmartFetch {
    private defaultConfig;
    constructor(defaultConfig?: SmartFetchConfig);
    /**
     * Actualiza el tiempo máximo de espera por defecto (en milisegundos).
     */
    setTimeout(timeoutMs: number): this;
    /**
     * Actualiza el número de reintentos por defecto.
     */
    setRetries(retries: number): this;
    /**
     * Establece un header por defecto para todas las peticiones futuras.
     */
    setHeader(name: string, value: string): this;
    /**
     * Permite establecer un Token Bearer de forma rápida.
     */
    setBearerToken(token: string): this;
    request<T>(url: string, config?: SmartFetchConfig): Promise<HttpResponse<T>>;
    get<T>(url: string, config?: SmartFetchConfig): Promise<HttpResponse<T>>;
    post<T>(url: string, body?: any, config?: SmartFetchConfig): Promise<HttpResponse<T>>;
    put<T>(url: string, body?: any, config?: SmartFetchConfig): Promise<HttpResponse<T>>;
    patch<T>(url: string, body?: any, config?: SmartFetchConfig): Promise<HttpResponse<T>>;
    delete<T>(url: string, config?: SmartFetchConfig): Promise<HttpResponse<T>>;
}
//# sourceMappingURL=SmartFetch.d.ts.map