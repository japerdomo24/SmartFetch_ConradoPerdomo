import { describe, test, expect } from '@jest/globals';
import { SmartFetchError } from '../src/errors/SmartFetchError.js';

/**
 * Suite de pruebas unitarias para la clase SmartFetchError.
 *
 * Verifica:
 *
 * - Creación del error con valores por defecto.
 * - Almacenamiento correcto de status y data.
 * - Marcado del indicador de timeout.
 * - Preservación de la cadena de prototipos para instanceof.
 *
 * Utiliza Jest como framework de pruebas.
 *
 * @test
 */
describe('SmartFetchError', () => {

  /**
   * Comprueba que el error se cree únicamente con el mensaje,
   * asignando los valores predeterminados al resto de propiedades.
   *
   * @test
   */
  test('debe crear el error con solo el mensaje y valores por defecto', () => {
    const err = new SmartFetchError('algo falló');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(SmartFetchError);
    expect(err.name).toBe('SmartFetchError');
    expect(err.message).toBe('algo falló');
    expect(err.status).toBeUndefined();
    expect(err.data).toBeUndefined();
    expect(err.isTimeout).toBe(false);
  });


  /**
   * Comprueba que el error almacene correctamente el código de estado
   * HTTP y los datos adicionales cuando se proporcionan.
   *
   * @test
   */
  test('debe guardar status y data cuando se proporcionan', () => {
    const err = new SmartFetchError('no encontrado', 404, { detalle: 'x' });
    expect(err.status).toBe(404);
    expect(err.data).toEqual({ detalle: 'x' });
    expect(err.isTimeout).toBe(false);
  });


  /**
   * Comprueba que el indicador isTimeout se establezca en true
   * cuando el error corresponde a una expiración de tiempo.
   *
   * @test
   */
  test('debe marcar isTimeout en true cuando corresponde', () => {
    const err = new SmartFetchError('timeout', undefined, undefined, true);
    expect(err.isTimeout).toBe(true);
  });


  /**
   * Comprueba que la cadena de prototipos se mantenga correctamente,
   * permitiendo identificar el error mediante instanceof dentro
   * de bloques catch.
   *
   * @test
   */
  test('debe mantener la cadena de prototipos para instanceof y catch', () => {
    try {
      throw new SmartFetchError('prueba');
    } catch (e) {
      expect(e instanceof SmartFetchError).toBe(true);
    }
  });

});