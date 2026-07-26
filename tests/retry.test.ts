import { describe, test, expect, jest } from '@jest/globals';
import { executeWithRetry } from '../src/utils/retry.js';

/**
 * Suite de pruebas unitarias para la función executeWithRetry.
 *
 * Verifica:
 *
 * - Retorno inmediato del resultado ante un éxito temprano.
 * - Reintento y recuperación tras un fallo intermedio.
 * - Lanzamiento del último error al agotar los intentos.
 *
 * Utiliza mocks de Jest para simular funciones que fallan
 * o tienen éxito de forma controlada.
 *
 * @test
 */
describe('executeWithRetry', () => {

  /**
   * Comprueba que la función retorne el resultado sin reintentar
   * cuando la operación tiene éxito en el primer intento.
   *
   * @test
   */
  test('debe retornar el resultado si la función tiene éxito al primer intento', async () => {
    const fn = jest.fn().mockResolvedValue('ok');
    const result = await executeWithRetry(fn, 3);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });


  /**
   * Comprueba que la función reintente tras un fallo inicial
   * y retorne el resultado cuando un intento posterior tiene éxito.
   *
   * @test
   */
  test('debe reintentar y tener éxito en un intento posterior', async () => {
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('fallo 1'))
      .mockResolvedValue('ok');
    const result = await executeWithRetry(fn, 3);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(2);
  });


  /**
   * Comprueba que la función lance el último error capturado
   * cuando se agotan todos los intentos disponibles.
   *
   * @test
   */
  test('debe lanzar el último error cuando se agotan los reintentos', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('siempre falla'));
    await expect(executeWithRetry(fn, 3)).rejects.toThrow('siempre falla');
    expect(fn).toHaveBeenCalledTimes(3);
  });
/**
   * Comprueba que la función utilice el valor de reintentos por defecto
   * cuando no se proporciona el segundo argumento.
   *
   * @test
   */
  test('debe usar el número de reintentos por defecto si no se especifica', async () => {
    const fn = jest.fn().mockResolvedValue('ok');
    const result = await executeWithRetry(fn);
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});