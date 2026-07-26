import { describe, test, expect, jest } from '@jest/globals';
import { createTimeoutSignal } from '../src/utils/timeout.js';

/**
 * Suite de pruebas unitarias para la función createTimeoutSignal.
 *
 * Verifica:
 *
 * - Comportamiento cuando no se especifica un tiempo límite.
 * - Cancelación automática de la señal al superar el tiempo.
 * - Limpieza del temporizador sin abortar cuando se invoca
 *   cleanup de forma anticipada.
 *
 * Utiliza temporizadores falsos de Jest para simular el paso
 * del tiempo de forma controlada.
 *
 * @test
 */
describe('createTimeoutSignal', () => {

  /**
   * Comprueba que, al no proporcionar un tiempo límite, se retorne
   * una señal indefinida junto con una función de limpieza vacía.
   *
   * @test
   */
  test('debe retornar signal undefined y cleanup vacío cuando no hay timeout', () => {
    const { signal, cleanup } = createTimeoutSignal();
    expect(signal).toBeUndefined();
    expect(() => cleanup()).not.toThrow();
  });


  /**
   * Comprueba que la señal generada se aborte automáticamente
   * una vez transcurrido el tiempo máximo configurado.
   *
   * @test
   */
  test('debe crear una señal que se aborta al superar el tiempo', () => {
    jest.useFakeTimers();
    const { signal, cleanup } = createTimeoutSignal(5000);
    expect(signal).toBeDefined();
    expect(signal!.aborted).toBe(false);
    jest.advanceTimersByTime(5000);
    expect(signal!.aborted).toBe(true);
    cleanup();
    jest.useRealTimers();
  });


  /**
   * Comprueba que invocar cleanup antes de que expire el tiempo
   * cancele el temporizador y evite que la señal se aborte.
   *
   * @test
   */
  test('cleanup debe limpiar el timer sin abortar si se llama antes', () => {
    jest.useFakeTimers();
    const { signal, cleanup } = createTimeoutSignal(5000);
    cleanup();
    jest.advanceTimersByTime(5000);
    expect(signal!.aborted).toBe(false);
    jest.useRealTimers();
  });

});