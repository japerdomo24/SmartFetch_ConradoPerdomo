export interface PerformanceMetrics {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTimeMs: number;
    statusCodes: Record<number, number>;
}
/**
 * Función pública para consultar el estado actual de la auditoría
 */
export declare function getMetricsReport(): PerformanceMetrics;
/**
 * Aspecto AOP: Intercepta cada llamada a la API para registrar estadísticas globales
 */
export declare function AuditMetrics(): (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
//# sourceMappingURL=MetricsAspect.d.ts.map