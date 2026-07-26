// src/aspects/MeasureTimeAspect.ts

/**
 * Aspecto AOP (Legacy Decorator): Profiling de tiempo de ejecución.
 * Emite una alerta únicamente si la petición supera el umbral configurado.
 */
export function MeasureTime(thresholdMs: number = 500) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const url = args[0] || 'Desconocida';
      const start = performance.now();

      try {
        const result = await originalMethod.apply(this, args);
        const duration = Math.round(performance.now() - start);

        if (duration > thresholdMs) {
          console.warn(
            ` [PROFILER-WARNING] Petición lenta en ${url} (${duration}ms > ${thresholdMs}ms)`
          );
        }

        return result;
      } catch (error: any) {
        throw error;
      }
    };

    return descriptor;
  };
}