# admred

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Indicadores de operaciones asincrónicas

La aplicación centraliza la retroalimentación de las operaciones asincrónicas para
que todas las pantallas se comporten igual:

- **Barra global** (`src/components/commons/BarraProgreso.vue`): aparece sola
  cuando hay peticiones HTTP en curso o navegaciones pendientes. Se alimenta del
  contador de `src/composables/useActividadRed.ts`, actualizado por los
  interceptores de `src/api/client/client.ts`. No hay que activarla desde cada
  vista.
- **Envío de datos** (`BotonEnvio`): úsalo en lugar de `BButton` para acciones
  que crean, actualizan o eliminan datos. Muestra el texto de progreso, deshabilita
  el botón mientras la mutación está en curso y evita envíos duplicados. Acompaña
  el `submit` con una guarda (`if (loading.value) return`) para cubrir el envío
  con Enter.
- **Carga de datos** (`IndicadorCarga`): bloque o línea con texto descriptivo y
  anuncio accesible (`role="status"`). Prefiere textos concretos
  («Cargando usuarios…») frente a un spinner sin contexto.
- **Listados** (`TablaEsqueleto`): esqueleto para la carga inicial. En los
  refrescos se conservan los datos anteriores (`placeholderData`) y se muestra un
  indicador discreto de «Actualizando…», evitando que la tabla desaparezca.
- **Semántica de consultas**: `isPending` es la ausencia inicial de datos;
  `isLoading` es una petición en curso (incluye refrescos). Los esqueletos usan
  `isPending`; los indicadores de refresco usan `isLoading`.
