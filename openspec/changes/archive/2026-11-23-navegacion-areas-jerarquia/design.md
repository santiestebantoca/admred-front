# Design

## Context

Ver `proposal.md` para la motivación. El estado actual relevante:

- `src/components/features/admin/areas/ListaGrid.vue` pinta una `BTable` paginada y filtra por `search`, `nombre`, `nivel`, `padre` y `rol_key`.
- `useAreasLista` combina `useAreasFiltro` con paginación de servidor; `useAreasQuery` usa Pinia Colada y `queryKeys.areas.lista(params)`.
- `GET /areas/areas` devuelve `id`, `nombre`, `padre` (nombre), `nivel` (nombre) y `rol_key`. La vista `areas` ya tiene `padre_id` y `nivel_id`, pero el controlador no los proyecta.
- La jerarquía corregida es: 1→2→3, 4→5→5… y 6→7. El nivel 5 puede colgar de 4 o de 5 y puede tener hijas de nivel 5.
- La base local quedó sin auto-padres y sin inconsistencias según el diagnóstico de la exploración. Producción debe verificarse con el mismo diagnóstico antes de desplegar.

## Goals / Non-Goals

**Goals:**

- Añadir el modo Navegar sin perder el modo Lista ni sus filtros.
- Construir la navegación con los ids reales de la jerarquía, no con nombres.
- Mantener el alta contextual coherente con el punto de navegación.
- Permitir áreas de nivel 5 como padres de otras áreas de nivel 5 en formularios y filtros.

**Non-Goals:**

- No se modifica la autorización ni el borrado de áreas.
- No se incluye migración de datos; la corrección ya se aplicó.
- No se añade búsqueda dentro del modo Navegar.
- No se cambia el esquema de la base ni se añaden dependencias.

## Decisions

### 1. Modo Lista / Navegar en la misma ruta

`views/admin/areas/index.vue` mantiene el `router-view` del detalle y monta dos superficies con `v-show`: la lista actual y el navegador. Así el estado de navegación sobrevive al abrir el detalle y al alternar de modo.

- El modo se guarda en `sessionStorage` con `useStorage('admred_areas_modo', 'lista')`.
- El valor inicial es `lista` para conservar el comportamiento actual.
- El conmutador se coloca junto al botón «Agregar», fuera de la zona que cambia.

Alternativa descartada: rutas separadas (`/admin/areas/navegar`). Duplicaría el contenedor del detalle y rompería el contrato actual de `admin-areas`.

### 2. Una sola consulta de todas las áreas para navegar

En modo Navegar se usa `useAreasQuery({})` (sin filtros ni paginación) y se construye el árbol en el cliente:

```ts
const { areas, isPending, isLoading } = useAreasQuery({})

const porNivel = computed(() => agruparPor(areas.value ?? [], 'nivel_id'))
const porPadre = computed(() => agruparPor(areas.value ?? [], 'padre_id'))
```

Con 158 áreas hoy, una sola petición es suficiente. La clave resultante es `queryKeys.areas.lista({})`, que ya queda invalidada por `useAreaCreate/Update/Delete` mediante `queryKeys.areas.listas()`.

Ventajas:

- Sin peticiones por cada nivel o área.
- La carpeta puede mostrarse solo si el área tiene hijas reales.
- El orden alfabético se aplica sobre el conjunto completo, no sobre una página.

Alternativa descartada: consultar `?nivel=` o `?padre=` en cada paso. Obliga a más viajes, a estados de carga por nivel y a decidir la carpeta con heurísticas de nivel.

### 3. Modelo de nodos y migas de pan

El navegador guarda una pila de nodos:

```ts
type NodoNavegacion =
  | { tipo: 'nivel'; nivelId: number; label: string }
  | { tipo: 'area'; areaId: number; label: string }
```

- Pila vacía → raíz: niveles con `padre_id` nulo (1, 4 y 6), resueltos con `useNivelesQuery`.
- Nodo de nivel → áreas con `nivel_id === nivelId`.
- Nodo de área → áreas con `padre_id === areaId`.
- La primera fila de toda lista no raíz es «ir al nivel superior» y hace `pop()`.
- La pila alimenta una miga de pan y el contexto del alta.

El orden de las filas es alfabético por `nombre` con `localeCompare('es', { sensitivity: 'base' })`. Se aplica en cliente porque ya están todas las áreas.

### 4. Fila, detalle y carpeta

No se usa `BTable` en modo Navegar. Cada fila es un contenedor con dos zonas:

```text
[ nombre del area ................................. ] [carpeta]
```

- El nombre es un botón que llama a `setAreaId(area.id)` y abre el detalle actual.
- La carpeta es un botón independiente con `@click.stop` y `aria-label="Ver áreas hijas"`; hace `push()` del nodo de área.
- La carpeta solo se renderiza si `porPadre.get(area.id)?.length` es mayor que cero.
- La fila «ir al nivel superior» se renderiza como una fila más, con icono de flecha.

Se evita anidar un botón dentro de otro: el nombre y la carpeta son botones hermanos dentro de la fila. El estilo de hover y los bordes se alinean con el resto de listas del proyecto.

### 5. Alta contextual por query de ruta

`linkCrear` pasa de objeto a función en los props de ruta:

```ts
linkCrear: (contexto?: { nivel?: number; padre?: number | null }) => ({
  name: 'admin-areas-crear',
  query: {
    ...(contexto?.nivel ? { nivel: contexto.nivel } : {}),
    ...(contexto?.padre ? { padre: contexto.padre } : {}),
  },
})
```

- El modo Lista llama `linkCrear()` sin contexto.
- El navegador llama `linkCrear({ nivel, padre })` según el nodo actual.
- La ruta `admin-areas-crear` añade props `nivelInicial` y `padreInicial` leídos de `route.query` y convertidos a número.
- `crear.vue` inicializa el formulario con esos valores. El `watch` existente sobre `nivel` sigue reiniciando `padre` si el usuario cambia el nivel manualmente.

Cálculo del nivel hijo:

```ts
function nivelHijo(nivelId: number | null, niveles: NivelRow[]) {
  if (nivelId === 5) return 5
  return niveles.find(n => n.padre_id === nivelId)?.id
}
```

- Nodo de nivel N → `nivel = N`, `padre = null`.
- Nodo de área X → `nivel = nivelHijo(X.nivel_id)`, `padre = X.id`.
- Niveles 3 y 7 no tienen nivel hijo; no se navega a sus hijas porque la regla de datos no lo permite.

### 6. Padres de nivel 5 en formularios y filtros

El formulario actual calcula `nivelPadre` como un único id:

```ts
const nivelPadre = computed(() =>
  form.value.nivel
    ? niveles.value?.find(d => d.id === form.value.nivel)?.padre_id
    : undefined
)
```

Eso deja fuera los padres de nivel 5. Se sustituye por una lista de niveles padre:

```ts
const nivelesPadre = computed(() => {
  if (!form.value.nivel) return []
  if (form.value.nivel === 5) return [4, 5]
  const nivel = niveles.value?.find(d => d.id === form.value.nivel)
  return nivel?.padre_id ? [nivel.padre_id] : []
})
```

Las opciones se obtienen de la misma consulta de todas las áreas (`useAreasQuery({})`) filtrando por `nivel_id` y ordenando por nombre. Se reutiliza la caché que ya usa el navegador; si se abre el formulario directamente, se hace una sola petición de 158 filas.

La misma regla se aplica a `ListaFiltro.vue` para que el filtro «Padre» de nivel 5 ofrezca padres de nivel 4 y 5.

### 7. Cambios de backend mínimos

En `controllers/areas.py`:

- `padre()`: incluir `'6'` en la lista de niveles raíz.
- `GET`: añadir `db.areas.padre_id` y `db.areas.nivel_id` a `fds`.

No se añaden endpoints ni parámetros nuevos. Los campos extra son compatibles con los consumidores actuales, que los ignoran.

### 8. Tipos y capas

- `src/types/api.ts`: `AreaListaItem` pasa a incluir `padre_id` y `nivel_id`.
- `src/stores/areas/`: nuevo composable de navegación (árbol, nodos, opciones de padre) reutilizando `useAreasQuery` y `useNivelesQuery`. No se crea un store Pinia clásico.
- `src/components/features/admin/areas/`: nuevo componente de navegación; `ListaGrid.vue` y `ListaFiltro.vue` se ajustan solo en lo necesario.
- No se añaden claves nuevas a `queryKeys.areas`: la consulta sin filtros usa `lista({})`.

### 9. Carga y accesibilidad

- Carga inicial del navegador: `IndicadorCarga` en bloque con «Cargando áreas…».
- Refresco tras una mutación: `IndicadorCarga inline` con «Actualizando…» dentro de `.indicador-actualizacion`.
- Cada fila y el botón de carpeta son alcanzables por teclado; la carpeta tiene `aria-label`.
- La miga de pan y la lista usan `aria-current`/texto visible para orientar.
- Los estados vacíos distinguen «No hay áreas en este nivel» de «Esta área no tiene áreas hijas».

## Risks / Trade-offs

- **Datos de producción distintos a los locales** → antes de desplegar, ejecutar el diagnóstico de jerarquía y confirmar cero filas. La navegación usa `padre_id`; una jerarquía sucia se vería como ramas inesperadas.
- **Cargar todas las áreas** → hoy son 158 filas; si el catálogo crece mucho, la carga inicial y el render podrían pesar. Mitigación futura: virtualizar la lista o volver a consultas por rama.
- **Nivel 5 autorrecursivo** → la tabla `nivel` no expresa que el nivel 5 pueda tener hijos del 5; el frontend lo trata como caso especial. Si aparece otro nivel autorrecursivo, hay que actualizar `nivelHijo`.
- **Doble acción en la fila** → el clic en el nombre y el clic en la carpeta deben quedar separados. Se resuelve con botones hermanos y `@click.stop`, y se verifica manualmente.
- **Formulario de nivel 5** → si las opciones de padre se cargan de forma asíncrona y el `padre` inicial no está en la lista, el select puede mostrarse vacío. Se mitiga usando la consulta de todas las áreas, que ya contiene el padre, y esperando a `isPending` antes de habilitar el select.
- **Cambio de contrato del `GET`** → añadir campos no rompe a los consumidores actuales; el backend debe desplegarse antes que el frontend.
- **Sin tests automatizados** → la verificación es `npm run lint`, `npm run typecheck`, `npm run build` y prueba manual de los flujos de navegación, alta contextual y filtro de nivel 5.

## Migration Plan

1. Backend: desplegar `controllers/areas.py` con la proyección y el nivel 6 raíz.
2. Verificar en producción el diagnóstico de jerarquía y que `GET /areas/areas` devuelve `padre_id` y `nivel_id`.
3. Frontend: desplegar el modo Navegar y los ajustes de formularios/filtros.
4. Rollback: revertir el frontend; el backend con campos extra sigue siendo compatible. El cambio de nivel 6 raíz solo afecta escrituras de nivel 6, que ya debían ser raíz.

No hay migración de esquema ni de datos en este cambio.

### Verificación de datos en destino

Antes de desplegar, ejecutar en la base de destino:

```sql
SELECT a.id, a.nombre, a.nivel, a.padre, p.nivel AS nivel_padre
FROM area a
LEFT JOIN area p ON a.padre = p.id
WHERE a.padre = a.id
   OR (a.nivel IN (1,4,6) AND a.padre IS NOT NULL)
   OR (a.nivel = 2 AND (a.padre IS NULL OR a.padre <> 1))
   OR (a.nivel = 3 AND (p.id IS NULL OR p.nivel <> 2))
   OR (a.nivel = 5 AND (p.id IS NULL OR p.nivel NOT IN (4,5)))
   OR (a.nivel = 7 AND (p.id IS NULL OR p.nivel <> 6))
ORDER BY a.nivel, a.id;
```

Debe devolver 0 filas. Si devuelve alguna, la navegación mostrará ramas
inesperadas y hay que corregir los datos antes de desplegar.
