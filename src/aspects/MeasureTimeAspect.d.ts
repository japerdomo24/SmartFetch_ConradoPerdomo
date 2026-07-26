/**
 * Decorador AOP encargado de medir el tiempo de ejecución de métodos
 * asíncronos y generar alertas cuando superan un umbral determinado.
 *
 * Este aspecto permite realizar profiling de operaciones, identificando
 * solicitudes que presentan tiempos de respuesta elevados.
 *
 * La medición se realiza utilizando `performance.now()` para obtener
 * una precisión adecuada en la estimación del tiempo transcurrido.
 *
 * @function MeasureTime
 *
 * @param {number} [thresholdMs=500]
 * Tiempo máximo permitido en milisegundos antes de generar una alerta
 * de rendimiento.
 *
 * @returns {Function}
 * Decorador compatible con métodos de clase que intercepta su ejecución
 * para calcular la duración de la operación.
 *
 * @example
 * class ApiClient {
 *   @MeasureTime(1000)
 *   async request() {
 *     return fetch(url);
 *   }
 * }
 *
 * @remarks
 * El aspecto no modifica el resultado original del método decorado.
 * Únicamente registra advertencias cuando la duración supera
 * el límite configurado.
 */
export declare function MeasureTime(thresholdMs?: number): (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
//# sourceMappingURL=MeasureTimeAspect.d.ts.map