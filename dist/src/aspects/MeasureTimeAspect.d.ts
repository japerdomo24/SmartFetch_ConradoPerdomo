/**
 * Aspecto AOP (Legacy Decorator): Profiling de tiempo de ejecución.
 * Emite una alerta únicamente si la petición supera el umbral configurado.
 */
export declare function MeasureTime(thresholdMs?: number): (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
//# sourceMappingURL=MeasureTimeAspect.d.ts.map