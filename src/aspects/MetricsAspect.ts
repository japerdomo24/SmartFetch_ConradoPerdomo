/**
 * Representa las métricas acumuladas generadas durante la ejecución
 * de solicitudes realizadas mediante SmartFetch.
 *
 * Contiene información estadística sobre el rendimiento del cliente,
 * incluyendo cantidad de peticiones, resultados obtenidos, tiempos
 * promedio y distribución de códigos HTTP.
 *
 * @interface PerformanceMetrics
 *
 * @property {number} totalRequests
 * Cantidad total de solicitudes procesadas.
 *
 * @property {number} successfulRequests
 * Número de solicitudes completadas correctamente.
 *
 * @property {number} failedRequests
 * Cantidad de solicitudes que finalizaron con error.
 *
 * @property {number} averageResponseTimeMs
 * Tiempo promedio de respuesta de las solicitudes en milisegundos.
 *
 * @property {Record<number, number>} statusCodes
 * Registro agrupado de códigos de estado HTTP y la cantidad
 * de veces que fueron recibidos.
 */
export interface PerformanceMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTimeMs: number;
  statusCodes: Record<number, number>;
}

/**
 * Almacena las métricas globales acumuladas durante la ejecución
 * de SmartFetch.
 *
 * Mantiene el estado interno utilizado por el aspecto `AuditMetrics`
 * para registrar solicitudes realizadas, tiempos acumulados,
 * resultados exitosos, errores y distribución de códigos HTTP.
 *
 * La propiedad `totalDurationMs` se utiliza internamente para calcular
 * el tiempo promedio de respuesta y no forma parte del reporte público.
 *
 * @constant
 * @private
 * @type {PerformanceMetrics & { totalDurationMs: number }}
 */
const globalMetrics: PerformanceMetrics & { totalDurationMs: number } = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  averageResponseTimeMs: 0,
  totalDurationMs: 0,
  statusCodes: {}
};

/**
 * Obtiene el reporte actual de métricas acumuladas del sistema
 * de auditoría de SmartFetch.
 *
 * Retorna una copia del estado actual de las métricas sin exponer
 * directamente la estructura interna utilizada para almacenar
 * la información.
 *
 * @function getMetricsReport
 *
 * @returns {PerformanceMetrics}
 * Reporte con las estadísticas actuales de ejecución.
 *
 * @example
 * const metrics = getMetricsReport();
 *
 * console.log(metrics.totalRequests);
 */
export function getMetricsReport(): PerformanceMetrics {
  const { totalDurationMs, ...report } = globalMetrics;
  return { ...report };
}


/**
 * Decorador AOP encargado de interceptar métodos de solicitud HTTP
 * para registrar automáticamente métricas de rendimiento y auditoría.
 *
 * El aspecto mide tiempos de ejecución, contabiliza solicitudes
 * exitosas y fallidas, y registra los códigos de estado HTTP
 * obtenidos durante las operaciones.
 *
 * @function AuditMetrics
 *
 * @returns {Function}
 * Decorador compatible con métodos de clase que permite envolver
 * su ejecución original.
 *
 * @example
 * class ApiClient {
 *   @AuditMetrics()
 *   async request() {
 *     return fetch(url);
 *   }
 * }
 */
export function AuditMetrics() {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      globalMetrics.totalRequests++;

      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - startTime;

        globalMetrics.successfulRequests++;
        globalMetrics.totalDurationMs += duration;
        globalMetrics.averageResponseTimeMs = Math.round(
          globalMetrics.totalDurationMs / globalMetrics.totalRequests
        );

        if (result?.status) {
          globalMetrics.statusCodes[result.status] =
            (globalMetrics.statusCodes[result.status] || 0) + 1;
        }

        return result;
      } catch (error: any) {
        const duration = Date.now() - startTime;

        globalMetrics.failedRequests++;
        globalMetrics.totalDurationMs += duration;
        globalMetrics.averageResponseTimeMs = Math.round(
          globalMetrics.totalDurationMs / globalMetrics.totalRequests
        );

        if (error?.status) {
          globalMetrics.statusCodes[error.status] =
            (globalMetrics.statusCodes[error.status] || 0) + 1;
        }

        throw error;
      }
    };

    return descriptor;
  };
}