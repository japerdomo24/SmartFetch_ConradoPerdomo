var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { SmartFetchError } from './errors/SmartFetchError.js';
import { createTimeoutSignal } from './utils/timeout.js';
import { executeWithRetry } from './utils/retry.js';
import { LogRequest } from './aspects/LogAspect.js';
import { AuditMetrics, getMetricsReport } from './aspects/MetricsAspect.js';
import { MeasureTime } from './aspects/MeasureTimeAspect.js';
export class SmartFetch {
    defaultConfig;
    constructor(defaultConfig = {}) {
        this.defaultConfig = { retries: 1, timeout: 5000, ...defaultConfig };
    }
    /**
     * Obtiene el reporte acumulado de métricas de uso
     */
    getMetrics() {
        return getMetricsReport();
    }
    /**
     * Actualiza el tiempo máximo de espera por defecto (en milisegundos).
     */
    setTimeout(timeoutMs) {
        this.defaultConfig.timeout = timeoutMs;
        return this; // Permite encadenamiento
    }
    /**
     * Actualiza el número de reintentos por defecto.
     */
    setRetries(retries) {
        this.defaultConfig.retries = retries;
        return this;
    }
    /**
     * Establece un header por defecto para todas las peticiones futuras.
     */
    setHeader(name, value) {
        this.defaultConfig.headers = {
            ...this.defaultConfig.headers,
            [name]: value
        };
        return this;
    }
    /**
     * Permite establecer un Token Bearer de forma rápida.
     */
    setBearerToken(token) {
        return this.setHeader('Authorization', `Bearer ${token}`);
    }
    async request(url, config = {}) {
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
                    throw new SmartFetchError(`Server error with status ${response.status}`, response.status);
                }
                if (!response.ok) {
                    throw new SmartFetchError(`HTTP error! status: ${response.status}`, response.status);
                }
                const data = (await response.json());
                return {
                    data,
                    status: response.status,
                    statusText: response.statusText,
                    ok: response.ok,
                    headers: response.headers
                };
            }
            catch (err) {
                if (err.name === 'AbortError') {
                    throw new SmartFetchError('Request timeout exceeded', undefined, undefined, true);
                }
                throw err;
            }
            finally {
                cleanup(); // Limpiamos el timer del timeout al finalizar el intento
            }
        }, retries);
    }
    get(url, config) {
        return this.request(url, { ...config, method: 'GET' });
    }
    post(url, body, config) {
        return this.request(url, {
            ...config,
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json', ...config?.headers }
        });
    }
    put(url, body, config) {
        return this.request(url, {
            ...config,
            method: 'PUT',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json', ...config?.headers }
        });
    }
    patch(url, body, config) {
        return this.request(url, {
            ...config,
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json', ...config?.headers }
        });
    }
    delete(url, config) {
        return this.request(url, { ...config, method: 'DELETE' });
    }
}
__decorate([
    AuditMetrics(),
    MeasureTime(1000),
    LogRequest(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SmartFetch.prototype, "request", null);
//# sourceMappingURL=SmartFetch.js.map