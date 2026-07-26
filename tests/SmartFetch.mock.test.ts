import { describe, test, beforeEach, afterEach, expect, jest } from '@jest/globals';
import { SmartFetch } from '../src/SmartFetch.js';
import { SmartFetchError } from '../src/errors/SmartFetchError.js';

/**
 * Construye una respuesta simulada compatible con la interfaz Response
 * de Fetch API para ser utilizada en las pruebas.
 *
 * Permite controlar los campos principales de la respuesta (estado,
 * texto de estado, indicador ok y cuerpo) sin realizar peticiones
 * reales a la red.
 *
 * @function mockResponse
 *
 * @param {any} body
 * Contenido que retornará el método json() de la respuesta simulada.
 *
 * @param {Partial<Response>} [init]
 * Valores opcionales para sobrescribir el estado por defecto
 * de la respuesta (ok, status, statusText).
 *
 * @returns {Response}
 * Objeto que emula una respuesta de Fetch API.
 */
function mockResponse(body: any, init: Partial<Response> = {}) {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    statusText: init.statusText ?? 'OK',
    headers: new Headers(),
    json: async () => body,
  } as unknown as Response;
}

/**
 * Suite de pruebas unitarias para SmartFetch utilizando un mock
 * de la función global fetch.
 *
 * A diferencia de las pruebas de integración, esta suite reemplaza
 * fetch por una función simulada, lo que permite:
 *
 * - Ejecutar pruebas sin acceso a la red.
 * - Controlar de forma determinista las respuestas y errores.
 * - Verificar los argumentos con los que se invoca fetch.
 *
 * Cubre:
 *
 * - Métodos HTTP (GET, POST, PUT, PATCH, DELETE).
 * - Manejo de errores HTTP 4xx y 5xx.
 * - Reintentos automáticos ante fallos del servidor.
 * - Conversión de errores de cancelación en timeouts.
 * - Configuración encadenada de la instancia.
 *
 * @test
 */
describe('SmartFetch con fetch mockeado', () => {
  let client: SmartFetch;
  let fetchMock: jest.Mock;

  /**
   * Inicializa una nueva instancia de SmartFetch y reemplaza la función
   * global fetch por un mock antes de cada prueba, garantizando
   * aislamiento entre casos.
   *
   * @testSetup
   */
  beforeEach(() => {
    client = new SmartFetch({ retries: 1, timeout: 5000 });
    fetchMock = jest.fn();
    global.fetch = fetchMock as any;
  });


  /**
   * Restaura todos los mocks al finalizar cada prueba para evitar
   * fugas de estado entre casos.
   *
   * @testTeardown
   */
  afterEach(() => {
    jest.restoreAllMocks();
  });


  /**
   * Verifica que cada método auxiliar de SmartFetch construya
   * correctamente la petición HTTP con el verbo y cuerpo esperados.
   *
   * @test
   */
  describe('Métodos HTTP', () => {

    /**
     * Comprueba que el método GET realice la petición con el verbo GET
     * y retorne la respuesta procesada correctamente.
     *
     * @test
     */
    test('GET debe hacer una petición con método GET', async () => {
      fetchMock.mockResolvedValue(mockResponse({ id: 1 }));
      const res = await client.get<{ id: number }>('https://api.test/todos/1');
      expect(res.data.id).toBe(1);
      expect(res.status).toBe(200);
      expect(res.ok).toBe(true);
      const [, options] = fetchMock.mock.calls[0];
      expect(options.method).toBe('GET');
    });


    /**
     * Comprueba que el método POST serialice el cuerpo a JSON
     * y establezca el header Content-Type correspondiente.
     *
     * @test
     */
    test('POST debe serializar el body y fijar Content-Type', async () => {
      fetchMock.mockResolvedValue(mockResponse({ creado: true }));
      await client.post('https://api.test/items', { nombre: 'x' });
      const [, options] = fetchMock.mock.calls[0];
      expect(options.method).toBe('POST');
      expect(options.body).toBe(JSON.stringify({ nombre: 'x' }));
      expect(options.headers['Content-Type']).toBe('application/json');
    });


    /**
     * Comprueba que el método PUT serialice el cuerpo enviado a JSON.
     *
     * @test
     */
    test('PUT debe serializar el body', async () => {
      fetchMock.mockResolvedValue(mockResponse({ ok: true }));
      await client.put('https://api.test/items/1', { nombre: 'y' });
      const [, options] = fetchMock.mock.calls[0];
      expect(options.method).toBe('PUT');
      expect(options.body).toBe(JSON.stringify({ nombre: 'y' }));
    });


    /**
     * Comprueba que el método PATCH serialice el cuerpo enviado a JSON.
     *
     * @test
     */
    test('PATCH debe serializar el body', async () => {
      fetchMock.mockResolvedValue(mockResponse({ ok: true }));
      await client.patch('https://api.test/items/1', { activo: false });
      const [, options] = fetchMock.mock.calls[0];
      expect(options.method).toBe('PATCH');
      expect(options.body).toBe(JSON.stringify({ activo: false }));
    });


    /**
     * Comprueba que el método DELETE realice la petición
     * utilizando el verbo DELETE.
     *
     * @test
     */
    test('DELETE debe usar el método DELETE', async () => {
      fetchMock.mockResolvedValue(mockResponse({ eliminado: true }));
      await client.delete('https://api.test/items/1');
      const [, options] = fetchMock.mock.calls[0];
      expect(options.method).toBe('DELETE');
    });
  });


  /**
   * Verifica el comportamiento de SmartFetch ante respuestas con
   * códigos de error HTTP y situaciones de cancelación.
   *
   * @test
   */
  describe('Manejo de errores HTTP', () => {

    /**
     * Comprueba que una respuesta 4xx genere un SmartFetchError
     * que incluya el código de estado en el mensaje.
     *
     * @test
     */
    test('debe lanzar SmartFetchError en error 4xx', async () => {
      fetchMock.mockResolvedValue(
        mockResponse(null, { ok: false, status: 404, statusText: 'Not Found' })
      );
      await expect(client.get('https://api.test/x')).rejects.toThrow(SmartFetchError);
      await expect(client.get('https://api.test/x')).rejects.toThrow(/404/);
    });


    /**
     * Comprueba que una respuesta 5xx genere un SmartFetchError
     * que incluya el código de estado en el mensaje.
     *
     * @test
     */
    test('debe lanzar SmartFetchError en error 5xx', async () => {
      fetchMock.mockResolvedValue(
        mockResponse(null, { ok: false, status: 500, statusText: 'Server Error' })
      );
      await expect(client.get('https://api.test/x')).rejects.toThrow(SmartFetchError);
      await expect(client.get('https://api.test/x')).rejects.toThrow(/500/);
    });


    /**
     * Comprueba que ante un error 5xx la petición se reintente
     * y finalice correctamente cuando un intento posterior tiene éxito.
     *
     * @test
     */
    test('debe reintentar en 5xx cuando hay reintentos y luego tener éxito', async () => {
      const c = new SmartFetch({ retries: 2, timeout: 5000 });
      fetchMock
        .mockResolvedValueOnce(
          mockResponse(null, { ok: false, status: 503, statusText: 'Unavailable' })
        )
        .mockResolvedValueOnce(mockResponse({ recuperado: true }));
      const res = await c.get('https://api.test/x');
      expect(res.data).toEqual({ recuperado: true });
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });


    /**
     * Comprueba que un error de cancelación (AbortError) se transforme
     * en un SmartFetchError marcado como timeout.
     *
     * @test
     */
    test('debe convertir AbortError en un timeout de SmartFetchError', async () => {
      const abortErr = new Error('The operation was aborted');
      abortErr.name = 'AbortError';
      fetchMock.mockRejectedValue(abortErr);
      try {
        await client.get('https://api.test/x');
        throw new Error('no debió llegar aquí');
      } catch (e) {
        expect(e).toBeInstanceOf(SmartFetchError);
        expect((e as SmartFetchError).isTimeout).toBe(true);
      }
    });
  });


  /**
   * Verifica los métodos de configuración de la instancia y su
   * capacidad de encadenamiento.
   *
   * @test
   */
  describe('Configuración de la instancia', () => {

    /**
     * Comprueba que setTimeout, setRetries y setHeader retornen
     * la propia instancia, permitiendo el encadenamiento de llamadas.
     *
     * @test
     */
    test('setTimeout, setRetries y setHeader deben encadenarse', () => {
      const result = client.setTimeout(1000).setRetries(3).setHeader('Accept', 'application/json');
      expect(result).toBe(client);
    });


    /**
     * Comprueba que setBearerToken agregue el header Authorization
     * con el formato Bearer correspondiente a las peticiones.
     *
     * @test
     */
    test('setBearerToken debe agregar el header Authorization', async () => {
      fetchMock.mockResolvedValue(mockResponse({ ok: true }));
      client.setBearerToken('abc123');
      await client.get('https://api.test/x');
      const [, options] = fetchMock.mock.calls[0];
      expect(options.headers.Authorization).toBe('Bearer abc123');
    });


    /**
     * Comprueba que getMetrics retorne un reporte de métricas definido
     * tras haber realizado al menos una petición.
     *
     * @test
     */
    test('getMetrics debe retornar un reporte de métricas', async () => {
      fetchMock.mockResolvedValue(mockResponse({ ok: true }));
      await client.get('https://api.test/x');
      const metrics = client.getMetrics();
      expect(metrics).toBeDefined();
    });
  });
});