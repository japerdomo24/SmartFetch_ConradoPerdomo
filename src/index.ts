/**
 * Punto de entrada principal de SmartFetch.
 *
 * Este módulo expone la API pública de la librería,
 * permitiendo acceder al cliente HTTP principal,
 * sus tipos asociados, errores personalizados y aspectos AOP.
 *
 * @module SmartFetch
 */


/**
 * Cliente HTTP avanzado basado en Fetch API.
 *
 * Proporciona funcionalidades adicionales como:
 * - Configuración global de solicitudes.
 * - Timeout automático.
 * - Reintentos ante errores.
 * - Manejo personalizado de excepciones.
 * - Métricas de rendimiento.
 * - Interceptores mediante aspectos.
 *
 * @see SmartFetch
 */
export { SmartFetch } from './SmartFetch.js';


/**
 * Tipos públicos utilizados por SmartFetch.
 *
 * Incluye:
 * - SmartFetchConfig: Opciones de configuración para solicitudes HTTP.
 * - HttpResponse: Estructura estándar de respuestas procesadas.
 */
export type {
  SmartFetchConfig,
  HttpResponse
} from './types/index.js';


/**
 * Error personalizado utilizado por SmartFetch.
 *
 * Permite identificar errores relacionados con:
 * - Fallos HTTP.
 * - Errores del servidor.
 * - Timeouts.
 * - Cancelaciones de solicitudes.
 *
 * @see SmartFetchError
 */
export { SmartFetchError } from './errors/SmartFetchError.js';


/**
 * Aspectos (AOP) y herramientas de monitoreo.
 *
 * Permiten inyectar comportamientos transversales como:
 * - Registro de logs automáticos.
 * - Alertas de tiempo de respuesta (Profiler).
 * - Generación de métricas globales de auditoría.
 */
export { LogRequest } from './aspects/LogAspect.js';
export { MeasureTime } from './aspects/MeasureTimeAspect.js';
export { AuditMetrics, getMetricsReport } from './aspects/MetricsAspect.js';
export type { PerformanceMetrics } from './aspects/MetricsAspect.js';