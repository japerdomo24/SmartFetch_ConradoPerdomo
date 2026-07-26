// Objeto singleton interno para acumular la auditoría
const globalMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTimeMs: 0,
    totalDurationMs: 0,
    statusCodes: {}
};
/**
 * Función pública para consultar el estado actual de la auditoría
 */
export function getMetricsReport() {
    const { totalDurationMs, ...report } = globalMetrics;
    return { ...report };
}
/**
 * Aspecto AOP: Intercepta cada llamada a la API para registrar estadísticas globales
 */
export function AuditMetrics() {
    return function (_target, _propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const startTime = Date.now();
            globalMetrics.totalRequests++;
            try {
                const result = await originalMethod.apply(this, args);
                const duration = Date.now() - startTime;
                // Actualizar métricas de éxito
                globalMetrics.successfulRequests++;
                globalMetrics.totalDurationMs += duration;
                globalMetrics.averageResponseTimeMs = Math.round(globalMetrics.totalDurationMs / globalMetrics.totalRequests);
                // Registrar código de estado HTTP
                if (result?.status) {
                    globalMetrics.statusCodes[result.status] =
                        (globalMetrics.statusCodes[result.status] || 0) + 1;
                }
                return result;
            }
            catch (error) {
                const duration = Date.now() - startTime;
                // Actualizar métricas de fallo
                globalMetrics.failedRequests++;
                globalMetrics.totalDurationMs += duration;
                globalMetrics.averageResponseTimeMs = Math.round(globalMetrics.totalDurationMs / globalMetrics.totalRequests);
                if (error?.status) {
                    globalMetrics.statusCodes[error.status] =
                        (globalMetrics.statusCodes[error.status] || 0) + 1;
                }
                throw error; // Mantenemos el flujo original lanzando la excepción
            }
        };
        return descriptor;
    };
}
//# sourceMappingURL=MetricsAspect.js.map