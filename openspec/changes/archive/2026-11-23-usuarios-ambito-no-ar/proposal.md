# Proposal

## Why

Hoy un administrador de un área no AR solo gestiona los usuarios de su propia área. Las áreas hijas quedan sin administración local y obligan a que AR gestione cada alta, edición o baja aunque el administrador del área superior conozca mejor sus dependencias. El ámbito de áreas ya se amplió al subárbol del administrador no AR; ahora debe ocurrir lo mismo con los usuarios.

## What Changes

- Un administrador con membresía `administrador` y área no AR SHALL gestionar los usuarios de **todo el subárbol de su área** (su área y sus descendientes), además de los usuarios sin área que haya creado.
- El listado y el detalle de usuarios SHALL acotarse a ese ámbito; el detalle de un usuario fuera del ámbito SHALL rechazarse.
- Al crear un usuario, el área SHALL elegirse dentro del ámbito; si no se indica, SHALL usarse el área propia.
- Al editar un usuario, el área SHALL poder cambiarse dentro del ámbito; un área fuera del ámbito SHALL rechazarse. El área del propio usuario SHALL conservarse.
- El formulario y el filtro de usuarios SHALL ofrecer el selector de área a los administradores no AR, con las opciones acotadas al ámbito.
- El listado SHALL mostrar el área de cada usuario y su filtro SHALL seguir funcionando dentro del ámbito.
- Un administrador no SHALL poder eliminarse a sí mismo; `permisos.eliminar` SHALL ser falso para su propio usuario.
- **BREAKING** (contrato interno): `GET /usuarios/usuarios` añade el área a cada fila; `POST` y `PUT` validan el área contra el subárbol; `GET /usuarios/usuarios/:id` pasa a estar acotado para el administrador no AR.

Fuera de alcance:

- No se cambia el ámbito de administración de áreas ni la administración de tipos o reportes.
- No se restringe la asignación de grupos: el administrador no AR sigue pudiendo asignar los grupos existentes, incluido `administrador`.
- No se modifica el catálogo de grupos, la autenticación ni la personificación.
- No se migran datos ni se reasignan usuarios existentes.
- No se añaden endpoints nuevos.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `gestion-usuarios`: se amplía el ámbito del administrador no AR al subárbol de su área, se permite elegir el área dentro del ámbito, se acota el listado y el detalle, se añade el área al listado y se protege al propio usuario.

## Impact

- Frontend:
  - `src/views/admin/usuarios/crear.vue` y `src/views/admin/usuarios/[id]/editar.vue`: selector de área visible para no AR, opciones acotadas y área propia por defecto; área de solo lectura para el propio usuario.
  - `src/views/admin/usuarios/[id]/index.vue`: «Eliminar» oculto para el propio usuario.
  - `src/components/features/admin/usuarios/ListaFiltro.vue`: filtro de área para no AR con opciones acotadas.
  - `src/components/features/admin/usuarios/ListaGrid.vue`: columna de área.
  - `src/types/api.ts`: `UsuarioListaItem` incluye el área.
- Backend web2py (`D:\proyectos\web2py\applications\admred`):
  - `controllers/usuarios.py`: helper de subárbol, filtrado de listado y detalle, validación de área en alta/edición, borrado dentro del ámbito y protección del propio usuario.
- Contrato de API:
  - `GET /usuarios/usuarios` devuelve el área en cada fila y acota el resultado al ámbito del no AR.
  - `GET /usuarios/usuarios/:id` responde 403 fuera del ámbito y devuelve `permisos.editar_username`.
  - `POST /usuarios/usuarios` acepta un área del ámbito; si falta, usa la propia.
  - `PUT /usuarios/usuarios/:id` valida el área del ámbito y conserva la del propio usuario.
  - `DELETE /usuarios/usuarios/:id` rechaza el propio usuario y los usuarios fuera del ámbito.
- Documentación:
  - Delta de `openspec/specs/gestion-usuarios/spec.md`.
  - `specs/_baseline/administracion.md` (alcance, listado, detalle, alta, edición y borrado de usuarios).
- Sin dependencias nuevas ni cambios de configuración de publicación.
