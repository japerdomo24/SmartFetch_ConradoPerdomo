/**
 * Aspecto de Logging:
 * Intercepta la ejecución de un método asíncrono para registrar
 * el inicio, el éxito (con su tiempo de respuesta) o la falla.
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