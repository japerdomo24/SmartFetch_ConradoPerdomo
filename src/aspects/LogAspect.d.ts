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
export declare function LogRequest(): (_target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
//# sourceMappingURL=LogAspect.d.ts.map