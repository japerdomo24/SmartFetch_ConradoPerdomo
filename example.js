import { SmartFetch, SmartFetchError } from './src/index.js';
/**
 * Cliente principal de SmartFetch configurado con parámetros globales.
 *
 * @constant
 * @type {SmartFetch}
 * @property {number} timeout - Tiempo máximo de espera para cada petición en milisegundos.
 * @property {number} retries - Cantidad de reintentos automáticos ante fallos.
 */
const client = new SmartFetch({
    timeout: 5000,
    retries: 2
});
/**
 * Ejecuta una batería completa de pruebas para validar
 * las funcionalidades principales de la librería SmartFetch.
 *
 * Las pruebas incluyen:
 * - Solicitudes GET.
 * - Creación de recursos mediante POST.
 * - Actualizaciones mediante PUT.
 * - Eliminación mediante DELETE.
 * - Manejo de timeout.
 * - Sistema de reintentos automáticos.
 * - Medición de rendimiento mediante profiler.
 * - Obtención de métricas de auditoría AOP.
 *
 * @async
 * @function runAllDemos
 * @returns {Promise<void>} Promesa que finaliza cuando todas las pruebas terminan.
 */
async function runAllDemos() {
    console.log('======================================');
    console.log('       EJECUTANDO PRUEBAS SMARTFETCH  ');
    console.log('======================================\n');
    /**
     * Prueba de petición GET.
     *
     * Realiza una consulta a un endpoint externo y valida
     * la recepción correcta de datos tipados mediante genéricos.
     */
    try {
        console.log('1. Probando GET...');
        const res = await client.get('https://jsonplaceholder.typicode.com/posts/1');
        console.log(' Status:', res.status);
        console.log(' Título:', res.data.title, '\n');
    }
    catch (err) {
        handleError(err);
    }
    /**
     * Prueba de petición POST.
     *
     * Envía información nueva al servidor simulando
     * la creación de un recurso.
     */
    try {
        console.log('2. Probando POST...');
        const res = await client.post('https://jsonplaceholder.typicode.com/posts', {
            title: 'Prueba',
            body: 'Contenido de prueba',
            userId: 1
        });
        console.log(' Status:', res.status);
        console.log(' Creado:', res.data, '\n');
    }
    catch (err) {
        handleError(err);
    }
    /**
     * Prueba de actualización mediante método PUT.
     *
     * Verifica que SmartFetch pueda enviar datos
     * modificados hacia un recurso existente.
     */
    try {
        console.log('3. Probando PUT...');
        const putRes = await client.put('https://jsonplaceholder.typicode.com/posts/1', {
            title: 'Actualizado',
            body: 'Cuerpo',
            userId: 1
        });
        console.log(' Status PUT:', putRes.status, '\n');
    }
    catch (err) {
        handleError(err);
    }
    /**
     * Prueba de eliminación de recursos.
     *
     * Comprueba el correcto funcionamiento del método DELETE.
     */
    try {
        console.log('4. Probando DELETE...');
        const delRes = await client.delete('https://jsonplaceholder.typicode.com/posts/1');
        console.log(' Status DELETE:', delRes.status, '\n');
    }
    catch (err) {
        handleError(err);
    }
    /**
     * Prueba de timeout.
     *
     * Fuerza un tiempo límite reducido para comprobar
     * el manejo de errores por expiración de espera.
     */
    try {
        console.log('5. Probando Timeout (debe fallar)...');
        await client.get('https://jsonplaceholder.typicode.com/posts/1', { timeout: 10 });
    }
    catch (err) {
        handleError(err);
    }
    /**
     * Prueba del sistema de reintentos automáticos.
     *
     * Se utiliza un endpoint que devuelve error HTTP 500
     * para comprobar la política de recuperación.
     */
    try {
        console.log('\n6. Probando Reintentos con Error 500...');
        await client.get('https://tools-httpstatus.pickup-services.com/500', {
            retries: 3,
            timeout: 8000
        });
    }
    catch (err) {
        handleError(err);
    }
    /**
     * Prueba del profiler interno.
     *
     * Realiza una petición con retraso controlado para
     * medir tiempos de respuesta.
     */
    try {
        console.log('\n7. Probando Profiler con petición lenta...');
        // Endpoint utilizado para simular una respuesta retardada.
        await client.get('https://dummyjson.com/http/200?delay=1200');
    }
    catch (err) {
        handleError(err);
    }
    console.log('\n======================================');
    console.log('     ¡TODAS LAS PRUEBAS FINALIZADAS!  ');
    console.log('======================================');
    /**
     * Obtención de métricas generadas durante la ejecución.
     *
     * Incluye información como:
     * - Cantidad de solicitudes realizadas.
     * - Tiempo promedio de respuesta.
     * - Distribución por códigos HTTP.
     */
    console.log('\n======================================');
    console.log('    MÉTRICAS DE AUDITORÍA (AOP)       ');
    console.log('======================================');
    const { statusCodes, ...summary } = client.getMetrics();
    console.log('\n Resumen de Rendimiento:');
    console.table(summary);
    console.log(' Desglose por Código de Estado HTTP:');
    console.table(statusCodes);
}
/**
 * Procesa y muestra errores generados durante las pruebas.
 *
 * Diferencia errores propios de SmartFetch de errores genéricos
 * del entorno de ejecución.
 *
 * @function handleError
 *
 * @param {Error|SmartFetchError} error - Error capturado durante una petición.
 *
 * @returns {void}
 *
 * @example
 * handleError(new SmartFetchError('Timeout'));
 */
function handleError(error) {
    if (error instanceof SmartFetchError) {
        console.error(' [SmartFetchError Capturado]:', error.message);
        console.error('   Status:', error.status ?? 'N/A');
        console.error('   Fue Timeout?:', error.isTimeout);
    }
    else {
        console.error(' [Error]:', error);
    }
}
/**
 * Punto de entrada principal del programa.
 *
 * Ejecuta todas las demostraciones de SmartFetch.
 *
 * @async
 * @returns {Promise<void>}
 */
runAllDemos();
//# sourceMappingURL=example.js.map