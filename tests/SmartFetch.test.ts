import { describe, test,beforeEach, expect } from '@jest/globals';
import { SmartFetch } from '../src/SmartFetch.js';

/**
 * Suite de pruebas unitarias para validar el comportamiento principal
 * de la clase SmartFetch.
 *
 * Verifica:
 *
 * - Creación correcta de instancias.
 * - Disponibilidad de métodos públicos.
 * - Ejecución de solicitudes HTTP GET.
 * - Manejo de errores ante URLs inválidas.
 *
 * Utiliza Jest como framework de pruebas y crea una nueva instancia
 * de SmartFetch antes de cada caso para garantizar aislamiento
 * entre pruebas.
 *
 * @test
 */
describe('SmartFetch Unit Tests', () => {
  let client: SmartFetch;


  /**
   * Inicializa una nueva instancia de SmartFetch antes de cada prueba.
   *
   * @testSetup
   */
  beforeEach(() => {
    client = new SmartFetch();
  });


  /**
   * Verifica la correcta creación e inicialización
   * del cliente SmartFetch.
   *
   * @test
   */
  describe('Instanciación e Inicialización', () => {

    /**
     * Comprueba que la instancia del cliente sea creada correctamente.
     *
     * @test
     */
    test('Debe crear la instancia de SmartFetch correctamente', () => {
      expect(client).toBeDefined();
    });


    /**
     * Comprueba que el método GET esté disponible
     * en la instancia creada.
     *
     * @test
     */
    test('Debe tener el método get definido', () => {
      expect(typeof client.get).toBe('function');
    });

  });


  /**
   * Verifica el comportamiento de las solicitudes HTTP
   * realizadas mediante el método GET.
   *
   * @test
   */
  describe('Peticiones HTTP (get)', () => {

    /**
     * Comprueba que SmartFetch pueda realizar una petición GET
     * exitosa y retornar los datos esperados.
     *
     * @test
     */
    test('Debe realizar una petición GET exitosa', async () => {
      const data = await client.get(
        'https://jsonplaceholder.typicode.com/todos/1'
      );

      expect(data).toBeDefined();
      expect(data.data.id).toBe(1);
    });


    /**
     * Comprueba que SmartFetch controle correctamente errores
     * generados por URLs inexistentes.
     *
     * @test
     */
    test('Debe manejar errores cuando la URL es inválida', async () => {
      await expect(
        client.get('https://domain-que-no-existe-12345.com')
      )
        .rejects
        .toThrow();
    });

  });

});