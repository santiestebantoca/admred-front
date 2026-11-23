# Proposal

## Why

La administración de áreas muestra una lista plana y paginada. Como las áreas se relacionan jerárquicamente, encontrar una rama concreta obliga a filtrar por nivel y padre, y la estructura real no se puede recorrer. Los dueños del negocio ya corrigieron los datos de la jerarquía; ahora hace falta una interfaz que la recorra de forma natural y un contrato de backend coherente con las raíces 1, 4 y 6.

## What Changes

- Añadir un conmutador **Lista / Navegar** en `/admin/areas`. En modo navegar se reemplaza toda la interfaz de lista, incluido el filtro.
- En modo navegar, la raíz son los niveles sin padre (1, 4 y 6). Al elegir un nivel se listan sus áreas; al entrar en un área se listan sus hijas. La primera fila es siempre «ir al nivel superior».
- Clic en una fila abre el detalle del área; el icono de carpeta entra en sus hijas. La carpeta solo se muestra si el área tiene hijas reales.
- Sin `BTable` y sin paginación en modo navegar: se cargan todas las áreas una vez y se construye el árbol en el cliente.
- El alta contextual usa el estado de navegación: desde un nivel, `nivel = N` y `padre = null`; desde las hijas del área X, `nivel = nivel hijo` y `padre = X.id`.
- Un área de nivel 5 puede tener hijas de nivel 5. El formulario de crear/editar y el filtro «Padre» deben ofrecer áreas de nivel 4 y 5 cuando el nivel sea 5.
- Backend: el nivel 6 se trata como raíz en la función `padre()` de `controllers/areas.py`; `GET /areas/areas` expone `padre_id` y `nivel_id` (la vista `areas` ya los tiene) para construir la navegación sin emparejar nombres.
- Actualizar la capacidad `estructura-areas` y la referencia `specs/_baseline/administracion.md`.

Fuera de alcance:

- No se modifica la autorización de escritura ni las reglas de borrado de áreas.
- No se incluye una migración de datos: la corrección de la jerarquía ya se aplicó y fue autorizada por los dueños del negocio.
- No se añade búsqueda global al modo navegar; para eso se conserva el modo lista.
- No se rediseñan los listados de usuarios o tipos.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `estructura-areas`: se amplía la jerarquía para tratar el nivel 6 como raíz y el nivel 5 como nivel que puede contener hijas de su mismo nivel; se añade el comportamiento de navegación por niveles y áreas, el alta contextual y la visibilidad de la carpeta según las hijas reales.

## Impact

- Frontend:
  - `src/views/admin/areas/index.vue` y `src/views/admin/areas/crear.vue`.
  - `src/views/admin/areas/[id]/editar.vue`.
  - `src/components/features/admin/areas/` (nuevo componente de navegación y ajustes de filtro).
  - `src/stores/areas/` (consulta de todas las áreas, niveles y opciones de padre).
  - `src/types/api.ts` (`AreaListaItem` con `padre_id` y `nivel_id`).
- Backend web2py:
  - `controllers/areas.py` (`padre()` y proyección del `GET`).
- Contrato de API:
  - `GET /areas/areas` añade `padre_id` y `nivel_id` a cada fila.
  - `POST/PUT /areas/areas` fuerza `padre = null` para el nivel 6.
- Documentación:
  - `openspec/specs/estructura-areas/spec.md` mediante el delta de este cambio.
  - `specs/_baseline/administracion.md`.
- Sin cambios de dependencias ni de configuración de publicación.
