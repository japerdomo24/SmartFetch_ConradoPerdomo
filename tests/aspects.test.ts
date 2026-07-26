import { describe, test, beforeEach, afterEach, expect, jest } from '@jest/globals';
import { SmartFetch } from '../src/SmartFetch.js';
import { MeasureTime } from '../src/aspects/MeasureTimeAspect.js';
import { AuditMetrics } from '../src/aspects/MetricsAspect.js';

/**
 * Suite de pruebas unitarias para los aspectos AOP y las ramas
 * de configuración por defecto no cubiertas por otras suites.
 *
 * Verifica:
 *
 * - La alerta de rendimiento cuando una petición supera el umbral.
 * - El registro de métricas cuando el resultado no incluye status.
 * - La ejecución de request sin configuración explícita.
 *
 * @test
 */
describe('Aspectos AOP y ramas por defecto', () => {

  /**
   * Verifica el comportamiento del aspecto MeasureTime cuando la
   * duración de la operación supera el umbral configurado.
   *
   * @test
   */
  describe('MeasureTime', () => {

    /**
     * Restaura los mocks tras cada prueba para evitar fugas de estado.
     *
     * @testTeardown
     */
    afterEach(() => {
      jest.restoreAllMocks();
    });


    /**
     * Comprueba que se genere una advertencia de rendimiento cuando
     * el tiempo de ejecución supera el umbral establecido.
     *
     * Simula una duración elevada controlando performance.now().
     *
     * @test
     */
    test('debe advertir cuando la petición supera el umbral', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const nowSpy = jest.spyOn(performance, 'now');
      nowSpy.mockReturnValueOnce(0).mockReturnValueOnce(2000);

      class Servicio {
        @MeasureTime(1000)
        async operacion(_url: string) {
          return { ok: true };
        }
      }

      const servicio = new Servicio();
      await servicio.operacion('https://api.test/lento');

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toContain('PROFILER-WARNING');
    });
    /**
     * Comprueba que el decorador funcione con el umbral por defecto
     * cuando se aplica sin proporcionar un valor explícito.
     *
     * @test
     */
    test('debe funcionar con el umbral por defecto', async () => {
      class Servicio {
        @MeasureTime()
        async operacion(_url: string) {
          return { ok: true };
        }
      }

      const servicio = new Servicio();
      const resultado = await servicio.operacion('https://api.test/x');
      expect(resultado).toEqual({ ok: true });
    });
    /**
     * Comprueba que NO se genere advertencia cuando la duración de la
     * operación permanece por debajo del umbral configurado.
     *
     * @test
     */
    test('no debe advertir cuando la petición es más rápida que el umbral', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const nowSpy = jest.spyOn(performance, 'now');
      nowSpy.mockReturnValueOnce(0).mockReturnValueOnce(100);

      class Servicio {
        @MeasureTime(1000)
        async operacion(_url: string) {
          return { ok: true };
        }
      }

      const servicio = new Servicio();
      await servicio.operacion('https://api.test/rapido');

      expect(warnSpy).not.toHaveBeenCalled();
    });
    /**
 * Comprueba que el aspecto MeasureTime utilice "Desconocida"
 * como valor por defecto cuando no se proporciona una URL
 * como primer argumento del método decorado.
 *
 * Simula una operación cuya duración supera el umbral configurado
 * para provocar la advertencia de rendimiento y verificar que
 * el mensaje generado incluya el valor "Desconocida".
 *
 * Esto permite cubrir la rama alternativa de la asignación de URL
 * utilizada internamente por el decorador.
 *
 * @test
 */
test('debe usar "Desconocida" cuando no se proporciona una URL', async () => {
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const nowSpy = jest.spyOn(performance, 'now');

  nowSpy
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(1000);

  class Servicio {
    @MeasureTime(500)
    async operacion() {
      return { ok: true };
    }
  }

  const servicio = new Servicio();
  const resultado = await servicio.operacion();

  expect(resultado).toEqual({ ok: true });

  expect(warnSpy).toHaveBeenCalledTimes(1);
  expect(warnSpy).toHaveBeenCalledWith(
    expect.stringContaining('Desconocida')
  );
});

  });


  /**
   * Verifica el comportamiento del aspecto AuditMetrics cuando el
   * resultado de la operación no contiene un código de estado.
   *
   * @test
   */
  describe('AuditMetrics', () => {

    /**
     * Comprueba que las métricas se registren correctamente aunque
     * el resultado no incluya la propiedad status, sin lanzar errores.
     *
     * @test
     */
    test('debe registrar la petición aunque el resultado no tenga status', async () => {
      class Servicio {
        @AuditMetrics()
        async operacion(_url: string) {
          return { sinStatus: true };
        }
      }

      const servicio = new Servicio();
      const resultado = await servicio.operacion('https://api.test/x');
      expect(resultado).toEqual({ sinStatus: true });
    });
  });


  /**
   * Verifica la rama de configuración por defecto del método request.
   *
   * @test
   */
  describe('request sin configuración', () => {
    let client: SmartFetch;
    let fetchMock: jest.Mock;

    /**
     * Inicializa el cliente y reemplaza fetch por un mock antes
     * de cada prueba.
     *
     * @testSetup
     */
    beforeEach(() => {
      client = new SmartFetch({ retries: 1, timeout: 5000 });
      fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        json: async () => ({ ok: true }),
      });
      global.fetch = fetchMock as any;
    });


    /**
     * Restaura los mocks tras cada prueba.
     *
     * @testTeardown
     */
    afterEach(() => {
      jest.restoreAllMocks();
    });


    /**
     * Comprueba que request pueda ejecutarse sin proporcionar el
     * argumento de configuración, utilizando el valor por defecto.
     *
     * @test
     */
    test('debe ejecutar request usando la configuración por defecto', async () => {
      const res = await client.request('https://api.test/x');
      expect(res.status).toBe(200);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

});