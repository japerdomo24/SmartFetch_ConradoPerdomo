/**
 * Decorador AOP encargado de registrar información sobre la ejecución
 * de métodos asíncronos relacionados con solicitudes HTTP.
 *
 * Este aspecto permite realizar trazabilidad de las operaciones,
 * registrando:
 *
 * - Inicio de la solicitud.
 * - Resultado exitoso y tiempo de respuesta.
 * - Errores ocurridos durante la ejecución.
 *
 * Facilita la depuración y monitoreo del comportamiento de SmartFetch
 * sin modificar la lógica principal del método interceptado.
 *
 * @function LogRequest
 *
 * @returns {Function}
 * Decorador compatible con métodos de clase que intercepta la ejecución
 * original para añadir registros de auditoría.
 *
 * @example
 * class ApiClient {
 *   @LogRequest()
 *   async request() {
 *     return fetch(url);
 *   }
 * }
 *
 * @remarks
 * El aspecto conserva el comportamiento original del método decorado,
 * retornando sus resultados y propagando las excepciones generadas.
 */
export function LogRequest() {
    return function (_target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const url = args[0];
            const start = Date.now();
            console.log(`\n [AOP-LOG] Iniciando ${propertyKey.toUpperCase()} a -> ${url}`);
            try {
                const result = await originalMethod.apply(this, args);
                const duration = Date.now() - start;
                console.log(` [AOP-LOG] Éxito en ${url} (${duration}ms) - Status: ${result.status}`);
                return result;
            }
            catch (error) {
                const duration = Date.now() - start;
                console.error(` [AOP-LOG] Error en ${url} (${duration}ms): ${error.message}`);
                throw error;
            }
        };
        return descriptor;
    };
}
//# sourceMappingURL=LogAspect.js.map