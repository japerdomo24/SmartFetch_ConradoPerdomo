import { SmartFetch, SmartFetchError } from './src/index.js';

const client = new SmartFetch({
  timeout: 5000,
  retries: 2
});

interface Post {
  id?: number;
  title: string;
  body: string;
  userId: number;
}

async function runAllDemos() {
  console.log('======================================');
  console.log('       EJECUTANDO PRUEBAS SMARTFETCH  ');
  console.log('======================================\n');

  // 1. GET
  try {
    console.log('1. Probando GET...');
    const res = await client.get<Post>('https://jsonplaceholder.typicode.com/posts/1');
    console.log(' Status:', res.status);
    console.log(' Título:', res.data.title, '\n');
  } catch (err) {
    handleError(err);
  }

  // 2. POST
  try {
    console.log('2. Probando POST...');
    const res = await client.post<Post>('https://jsonplaceholder.typicode.com/posts', {
      title: 'Prueba',
      body: 'Contenido de prueba',
      userId: 1
    });
    console.log(' Status:', res.status);
    console.log(' Creado:', res.data, '\n');
  } catch (err) {
    handleError(err);
  }

  // 3. PUT & PATCH
  try {
    console.log('3. Probando PUT...');
    const putRes = await client.put<Post>('https://jsonplaceholder.typicode.com/posts/1', {
      title: 'Actualizado',
      body: 'Cuerpo',
      userId: 1
    });
    console.log(' Status PUT:', putRes.status, '\n');
  } catch (err) {
    handleError(err);
  }

  // 4. DELETE
  try {
    console.log('4. Probando DELETE...');
    const delRes = await client.delete('https://jsonplaceholder.typicode.com/posts/1');
    console.log(' Status DELETE:', delRes.status, '\n');
  } catch (err) {
    handleError(err);
  }

  // 5. TIMEOUT (Forzado)
  try {
    console.log('5. Probando Timeout (debe fallar)...');
    await client.get('https://jsonplaceholder.typicode.com/posts/1', { timeout: 10 });
  } catch (err) {
    handleError(err);
  }

  // 6. RETRIES & ERROR 500
    try {
    console.log('\n6. Probando Reintentos con Error 500...');
    await client.get('https://tools-httpstatus.pickup-services.com/500', { retries: 3, timeout: 8000 });
    } catch (err) {
    handleError(err);
    }

  // 7. Petición lenta (Sin pasarse del tiempo límite)
  try {
    console.log('\n7. Probando Profiler con petición lenta...');
    // Hacemos una consulta a un endpoint que simula un retraso de 1200ms
    await client.get('https://dummyjson.com/http/200?delay=1200');
  } catch (err) {
    handleError(err);
  }

  console.log('\n======================================');
  console.log('     ¡TODAS LAS PRUEBAS FINALIZADAS!  ');
  console.log('======================================');

  console.log('\n======================================');
  console.log('    MÉTRICAS DE AUDITORÍA (AOP)       ');
  console.log('======================================');

  const { statusCodes, ...summary } = client.getMetrics();

  console.log('\n Resumen de Rendimiento:');
  console.table(summary);

  console.log(' Desglose por Código de Estado HTTP:');
  console.table(statusCodes);
}

function handleError(error: any) {
  if (error instanceof SmartFetchError) {
    console.error(' [SmartFetchError Capturado]:', error.message);
    console.error('   Status:', error.status ?? 'N/A');
    console.error('   Fue Timeout?:', error.isTimeout);
  } else {
    console.error(' [Error]:', error);
  }
}

runAllDemos();