# Proposal

## Why

Hoy la administración de áreas está reservada a los administradores cuya área tiene `rol_key = 'AR'`: el backend rechaza cualquier escritura de un administrador no AR y la interfaz ni siquiera le ofrece la opción. Esa restricción obliga a concentrar en AR la gestión de toda la jerarquía, aunque cada área no AR conoce mejor sus propias subáreas. El negocio necesita que el administrador de un área no AR administre el subárbol que cuelga de su área, sin poder tocar su propia área ni romper la jerarquía.

## What Changes

- Un administrador con membresía `administrador` y área no AR SHALL poder crear, renombrar y eliminar áreas del subárbol de su propia área (incluida ella misma como raíz visible).
- Su propia área queda en **solo lectura**: no se puede editar ni eliminar.
- El `padre` y el `nivel` de las áreas que administra son inmutables: al editar solo cambia el nombre; al crear, el padre lo determina el contexto y el nivel se deriva de la jerarquía.
- `GET /areas/areas` y `GET /areas/areas/:id` SHALL acotarse al subárbol del administrador no AR. AR y el resto de usuarios conservan el comportamiento actual.
- El detalle de área expone `permisos.editar` además de `permisos.eliminar`, y ambos reflejan el ámbito y la condición de área propia.
- La interfaz de administración SHALL ofrecer «Áreas» a cualquier administrador. Para el no AR, la lista se muestra acotada, el filtro de rol desaparece y el modo Navegar arranca en una fila única con su propia área.
- **BREAKING** (contrato interno): `GET /areas/areas/:id` añade `permisos.editar`; el requisito de autorización de escritura deja de ser «solo AR».

Fuera de alcance:

- No se amplía el ámbito de usuarios: el administrador no AR sigue gestionando solo los usuarios de su área y los usuarios sin área creados por él.
- No se modifican tipos de solicitud ni reportes globales; siguen reservados a AR.
- No se añaden, mueven ni migran áreas, ni se corrige la jerarquía existente.
- No se permite mover un área de padre ni cambiar su nivel, ni siquiera dentro del subárbol.
- No se añaden endpoints nuevos.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `estructura-areas`: cambia la autorización de escritura para incluir al administrador no AR dentro del subárbol de su área, se acota la lectura, se fijan padre y nivel, se añade el permiso de edición al detalle y se define la navegación del no AR desde su propia área.

## Impact

- Frontend:
  - `src/composables/useNavigation.ts`: «Áreas» para todo administrador.
  - `src/views/admin/areas/crear.vue` y `src/views/admin/areas/[id]/editar.vue`: padre y nivel no editables para no AR.
  - `src/views/admin/areas/[id]/index.vue`: acciones según `permisos.editar` y `permisos.eliminar`.
  - `src/components/features/admin/areas/` (`ListaGrid`, `ListaFiltro`, `ListaNavegador`) y `src/stores/areas/useAreasNavegacion.ts`: lista acotada, filtro de rol oculto y raíz de navegación en el área propia.
  - `src/types/models.ts`: `AreaDetalle.permisos` pasa a `{ editar, eliminar }`.
- Backend web2py (`D:\proyectos\web2py\applications\admred`):
  - `controllers/areas.py`: validador de ámbito local, filtrado del `GET`, `permisos` del detalle, alta con nivel derivado y `PUT` que descarta `padre` y `nivel` para no AR.
  - Sin cambios en `controllers/tipos.py` ni `controllers/reportes.py`: cada uno tiene su propio `Validate.auth_from_AR`.
- Contrato de API:
  - `GET /areas/areas` y `GET /areas/areas/:id` devuelven solo el subárbol para el administrador no AR.
  - `GET /areas/areas/:id` añade `permisos.editar`.
  - `POST /areas/areas` deriva `nivel` del `padre` para el no AR.
  - `PUT /areas/areas/:id` ignora `padre` y `nivel` para el no AR.
  - `DELETE /areas/areas/:id` rechaza el área propia y las áreas fuera del subárbol.
- Documentación:
  - Delta de `openspec/specs/estructura-areas/spec.md`.
  - `specs/_baseline/administracion.md`, `specs/_baseline/README.md` y `project-context.md` para distinguir el alcance de áreas del de tipos y usuarios.
- Sin dependencias nuevas ni cambios de configuración de publicación.
