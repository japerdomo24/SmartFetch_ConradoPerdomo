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
export declare function getMetricsReport(): PerformanceMetrics;
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
export declare function AuditMetrics(): (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
//# sourceMappingURL=MetricsAspect.d.ts.map