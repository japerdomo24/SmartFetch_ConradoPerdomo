# SmartFetch

[![npm version](https://img.shields.io/badge/npm-v1.0.0-blue.svg)](https://www.npmjs.com/)
[![build](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)]()
[![license](https://img.shields.io/badge/license-MIT-green.svg)]()

**SmartFetch** es un cliente HTTP de alto nivel ligero, resiliente y de cero dependencias externas (*zero-dependency*), diseñado como un *wrapper* avanzado sobre la API nativa `fetch` de JavaScript/Node.js.

Proporciona una interfaz limpia e intuitiva inspirada en Axios, eliminando los riesgos de vulnerabilidades por dependencias de terceros y agregando capacidades avanzadas de resiliencia (timeouts, reintentos automáticos) y arquitectura modular mediante **Programación Orientada a Aspectos (AOP)**.

---

## Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Uso Básico](#uso-básico)
  - [Con Async/Await](#con-asyncawait)
  - [Con Promesas (.then/.catch)](#con-promesas-thencatch)
- [Métodos HTTP](#métodos-http)
- [Estructura de la Respuesta (HttpResponse)](#estructura-de-la-respuesta-httpresponse)
- [Configuración Avanzada](#configuración-avanzada)
  - [Uso de Encabezados (Headers)](#uso-de-encabezados-headers)
  - [Timeout Máximo de Espera](#timeout-máximo-de-espera)
  - [Reintentos Automáticos (Retries)](#reintentos-automáticos-retries)
- [Arquitectura y Patrones](#arquitectura-y-patrones)
  - [Programación Orientada a Aspectos (AOP)](#programación-orientada-a-aspectos-aop)
- [Ejemplos de Uso (example.ts)](#ejemplos-de-uso-examplets)
- [Pruebas Automatizadas](#pruebas-automatizadas)
- [Integrantes del Equipo](#integrantes-del-equipo)
- [Licencia](#licencia)

---

## Características

- 🚀 **Zero Dependencies**: Utiliza la API nativa `fetch` internamente sin acoplarse a paquetes de terceros vulnerables.
- ⏱️ **Timeouts Configurables**: Cancelación automática de peticiones si el servidor excede el tiempo límite establecido.
- 🔄 **Reintentos Automáticos (Retries)**: Estrategia de reintento automático ante fallos de red o errores de servidor (5xx).
- 🛠️ **Soporte Completo de Métodos HTTP**: Métodos nativos para `GET`, `POST`, `PUT`, `PATCH` y `DELETE`.
- 🔀 **Soporte DUAL**: Uso nativo mediante `async/await` o manejo tradicional de Promesas.
- 🧩 **AOP (Programación Orientada a Aspectos)**: Decoradores reutilizables para auditoría de métricas, logeo transparente y control de tiempo de ejecución.
- 📘 **TypeScript First & JSDoc**: Tipado estático estricto con autocompletado y documentación JSDoc integrada.

---

## Instalación

Puedes instalar la librería desde el repositorio de GitHub:

```bash
npm install github:japerdomo24/SmartFetch_ConradoPerdomo
```

Una vez instalada la librería, si estás trabajando en un proyecto Node.js nuevo, debes asegurarte de tener un archivo `package.json` configurado con `"type": "module"` para permitir el uso de módulos ES (`import`/`export`):

1. Inicializa tu proyecto (si aún no lo has hecho):
   ```bash
   npm init -y
   ```

2. Abre tu `package.json` y añade la propiedad `"type": "module"`:
   ```json
   {
     "name": "mi-proyecto",
     "version": "1.0.0",
     "type": "module",
     "dependencies": {
       "smartfetch_conradoperdomo": "^1.0.0"
     }
   }
   ```

---

## Uso Básico

### Con Async/Await

```javascript
import { SmartFetch } from 'smartfetch_conradoperdomo';

const client = new SmartFetch({
  timeout: 5000, // 5 segundos
  retries: 3     // 3 reintentos automáticos
});

async function obtenerProducto() {
  try {
    const producto = await client.get('https://dummyjson.com/products/1');
    console.log('Producto:', producto);
  } catch (error) {
    console.error('Error al obtener producto:', error.message);
  }
}

obtenerProducto();
```

### Con Promesas (.then/.catch)

```javascript
import { SmartFetch } from 'smartfetch_conradoperdomo';

const client = new SmartFetch();

client.get('https://dummyjson.com/products/1')
  .then((data) => {
    console.log('Respuesta:', data);
  })
  .catch((error) => {
    console.error('Fallo en la petición:', error.message);
  });
```

---

## Métodos HTTP

SmartFetch proporciona alias convenientes para los métodos HTTP más utilizados pasando la URL de destino:

### `GET`
```typescript
const data = await client.get<UserData>('https://dummyjson.com/users/1');
```

### `POST`
```typescript
const newUser = await client.post<UserData>('https://dummyjson.com/users/add', {
  firstName: 'Jose',
  lastName: 'Perdomo',
  email: 'jose@example.com'
});
```

### `PUT`
```typescript
const updatedUser = await client.put<UserData>('https://dummyjson.com/users/1', {
  firstName: 'Jose Updated'
});
```

### `PATCH`
```typescript
const patchedUser = await client.patch<UserData>('https://dummyjson.com/users/1)', {
  age: 25
});
```

### `DELETE`
```typescript
const response = await client.delete('https://dummyjson.com/users/1');
```

---

## Estructura de la Respuesta (`HttpResponse`)

Todas las peticiones resueltas por **SmartFetch** devuelven un objeto estandarizado con la interfaz `HttpResponse<T>`, el cual envuelve la respuesta procesada del servidor:

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| **`data`** | `T` | Contenido procesado de la respuesta (usualmente objeto JSON). |
| **`status`** | `number` | Código numérico del estado HTTP (ej. `200`, `201`, `404`). |
| **`statusText`** | `string` | Descripción textual asociada al código de estado HTTP (ej. `"OK"`). |
| **`ok`** | `boolean` | `true` si el código HTTP está entre 200 y 299. |
| **`headers`** | `Headers` | Objeto `Headers` nativo con los encabezados recibidos. |

---

### 💻 Cómo acceder a cada propiedad en tu código

```typescript
import { SmartFetch, HttpResponse } from 'smartfetch_conradoperdomo';

interface User {
  id: number;
  firstName: string;
  email: string;
}

const client = new SmartFetch();

async function obtenerUsuario() {
  // Recibimos el objeto de tipo HttpResponse<User>
  const response: HttpResponse<User> = await client.get<User>('https://dummyjson.com/users/1');

  // 1. Acceso a los datos procesados (data)
  console.log('ID:', response.data.id);
  console.log('Nombre:', response.data.firstName);

  // 2. Acceso al código de estado (status)
  console.log('Código HTTP:', response.status); // ej: 200

  // 3. Acceso a la descripción del estado (statusText)
  console.log('Mensaje de estado:', response.statusText); // ej: "OK"

  // 4. Verificación de éxito (ok)
  if (response.ok) {
    console.log('Petición completada con éxito (rango 200-299)');
  }

  // 5. Acceso a los encabezados HTTP (headers)
  console.log('Tipo de contenido:', response.headers.get('content-type'));
}

obtenerUsuario();
```

---

## Configuración Avanzada

### Uso de Encabezados (Headers)

SmartFetch permite configurar encabezados globales en la instancia o personalizados por petición:

```javascript
// 1. Encabezados globales en la instancia
const client = new SmartFetch({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 2. Encabezados específicos por petición
const response = await client.post(
  'https://dummyjson.com/products/add',
  { title: 'Nuevo Producto' },
  {
    headers: {
      'Authorization': 'Bearer token_secreto_123'
    }
  }
);
```

### Timeout Máximo de Espera

Si el servidor no responde dentro del límite configurado, la petición se cancela automáticamente mediante `AbortController` y lanza un error controlado de tipo `SmartFetchError`.

```javascript
const client = new SmartFetch({
  timeout: 2000 // Cancela la petición si tarda más de 2000ms
});
```

### Reintentos Automáticos (Retries)

Ante errores con códigos de estado HTTP `5xx` (Server Error) o fallos mecánicos de red, SmartFetch reintentará la comunicación automáticamente hasta el número de veces configurado antes de lanzar una excepción.

```javascript
const client = new SmartFetch({
  retries: 3 // Realiza hasta 3 reintentos si falla con 5xx/red
});
```

---

## Arquitectura y Patrones

### Programación Orientada a Aspectos (AOP)

Para mantener una separación limpia de incumbencias (*Separation of Concerns*), las tareas transversales como el logeo, la recolección de métricas y la auditoría de tiempos se implementan mediante **Decoradores TypeScript (Aspectos)**:

- **`@LogRequest()`**: Realiza un seguimiento transparente del inicio, éxito o error de cada solicitud HTTP.
- **`@MeasureTime(thresholdMs)`**: Mide la latencia de las llamadas y emite advertencias si superan el umbral estipulado.
- **`@AuditMetrics()`**: Colecciona métricas operacionales del cliente para monitoreo de estado.

```typescript
// Aplicación interna en el núcleo de SmartFetch
@AuditMetrics()
@MeasureTime(1000)
@LogRequest()
async request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  // Lógica principal de ejecución de Fetch
}
```

---

## Ejemplos de Uso (`example.ts`)

El repositorio incluye un archivo **`example.ts`** en la raíz que demuestra de forma práctica las principales capacidades de **SmartFetch**:
- Peticiones `GET`, `POST`, `PUT`, `PATCH` y `DELETE`.
- Manejo de tiempos de espera (*timeouts*).
- Reintentos automáticos (*retries*) ante fallos de servidor.
- Intercepción de logs y métricas mediante aspectos AOP.

### 🚀 Cómo ejecutar el ejemplo localmente

Si estás evaluando o revisando el proyecto, sigue estos sencillos pasos para clonar el repositorio y ejecutar la demostración completa en tu terminal:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/japerdomo24/SmartFetch_ConradoPerdomo.git
   cd SmartFetch_ConradoPerdomo
   ```

2. **Instalar las dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar el script de ejemplo:**
   ```bash
   npm run start:example
   ```

---

## Pruebas Automatizadas

El proyecto cuenta con una suite completa de pruebas unitarias implementada con **Jest**, garantizando la estabilidad de las peticiones HTTP, el cumplimiento de los *timeouts*, la estrategia de reintentos (*retries*) y la intercepción de los aspectos AOP.

### 🚀 Cómo ejecutar las pruebas localmente

Si estás evaluando el repositorio, sigue estos pasos para correr los tests en tu entorno local:

1. **Clonar el repositorio e instalar dependencias:**
   ```bash
   git clone https://github.com/japerdomo24/SmartFetch_ConradoPerdomo.git
   cd SmartFetch_ConradoPerdomo
   npm install
   ```

2. **Ejecutar la suite de pruebas:**
   ```bash
   npm test
   ```

3. **Generar reporte de cobertura (Coverage):**
   ```bash
   npm run test:coverage
   ```

> **Nota:** El comando `npm run test:coverage` mostrará una tabla detallada en la consola con las métricas de código probado (Statements, Branches, Functions, Lines) y creará la carpeta `coverage/` con el reporte visual HTML (`coverage/lcov-report/index.html`).

---

## Integrantes del Equipo

- **Jose Perdomo** - *Desarrollador* - [japerdomo24](https://github.com/japerdomo24)
- **Andrés Conrado** - *Desarrollador* - [cnrdoao](https://github.com/cnrdoao)

---

## Licencia

Desarrollado para la materia **Tópicos Especiales de Programación** - UCAB 2026.  
Distribuido bajo la Licencia MIT.
