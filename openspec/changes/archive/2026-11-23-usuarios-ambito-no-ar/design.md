# Design

## Context

Ver `proposal.md` para la motivación. El estado actual que condiciona el diseño:

- `controllers/usuarios.py` acota el listado no AR a `area_id == auth.user.area` o a usuarios sin área creados por él; el detalle no comprueba ámbito; el alta fuerza el área propia y la edición elimina el área del payload.
- `GET /areas/areas` ya está acotado al subárbol para el administrador no AR desde el cambio de áreas, y `useAreasOpcionesQuery` lo reutiliza.
- En el frontend, `showArea` depende de `authUser.AR` en el alta, la edición y el filtro; por eso el no AR no ve ningún selector de área.
- `UsuarioDetalle.area` es nullable, pero la edición actual hace `usuario.value.area.id`, lo que falla con un usuario sin área.
- El listado de usuarios no devuelve el área; solo `id`, `name`, `username` y `registration_key`.

## Goals / Non-Goals

**Goals:**

- Un único predicado de ámbito para listado, detalle y mutaciones.
- Permitir elegir el área dentro del subárbol sin abrir la puerta a áreas ajenas.
- Evitar que el administrador se quite a sí mismo el área o se elimine.
- Mostrar el área en el listado y en los formularios para que el ámbito sea comprensible.

**Non-Goals:**

- No se cambia la administración de áreas, tipos ni reportes.
- No se restringe el catálogo de grupos ni se revisa qué roles puede conceder un no AR.
- No se migran usuarios ni se crean áreas.
- No se modifica la autenticación, la personificación ni el estado de registro.

## Decisions

### 1. Ámbito en `usuarios.py` con un helper local

Se añade a `controllers/usuarios.py` un helper `_ids_subarbol(area_id)` equivalente al de `areas.py` y un predicado de ámbito para el no AR:

```text
area_id IN subárbol(auth.user.area)
OR (area_id IS NULL AND created_by == auth.user_id)
```

- **Por qué**: mantiene el cambio aislado en el controlador de usuarios y no vuelve a tocar la autorización de áreas ya desplegada. La tabla de áreas es pequeña y el recorrido es en memoria.
- **Alternativa considerada**: extraer un módulo compartido `modules/db/areas.py` y reutilizarlo desde `areas.py` y `usuarios.py`. Es más limpio a largo plazo, pero amplía el riesgo de un cambio ya liberado; se deja como refactor posterior si aparece un tercer consumidor.

### 2. Listado y detalle acotados

- `GET /usuarios/usuarios` aplica el predicado al query y sigue componiendo los filtros `area`, `rol`, `estado`, `search`.
- `GET /usuarios/usuarios/:id` comprueba el ámbito antes de cargar el detalle y responde 403 fuera de él.
- El comportamiento AR no se acota.

- **Por qué**: el detalle actual es la principal fuga de lectura; el listado ya estaba acotado, pero solo al área propia.
- **Consecuencia**: el enlace directo al detalle de un usuario ajeno deja de funcionar para el no AR; la UI solo ofrece usuarios del ámbito.

### 3. Alta: área dentro del ámbito, propia por defecto

Para el no AR, el `POST`:

1. toma `area` del cuerpo o, si falta, `auth.user.area`;
2. valida que esté en el subárbol;
3. si está fuera, responde 403;
4. conserva el resto de la validación de web2py.

- **Por qué**: permite crear usuarios en áreas hijas sin que un payload manipulado asigne un área ajena.
- **Alternativa descartada**: mantener el área forzada y obligar a AR a crear los usuarios de las áreas hijas; contradice el objetivo del cambio.

### 4. Edición: área dentro del ámbito y propia protegida

Para el no AR, el `PUT`:

1. comprueba que el usuario objetivo esté en el ámbito;
2. si el payload trae `area`, valida que esté en el subárbol; si está fuera, responde 403;
3. si el usuario objetivo es `auth.user_id`, conserva su área actual aunque el payload envíe otra;
4. mantiene la inmutabilidad de `username` cuando hay actividad y el resto de reglas actuales.

- **Por qué**: permite mover usuarios entre áreas del ámbito sin que el administrador pueda sacarse a sí mismo del ámbito.
- **Alternativa descartada**: bloquear todo cambio de área y exigir que AR mueva a los usuarios; impide el CRUD completo que pide el negocio.

### 5. Borrado: ámbito, integridad y propio usuario

- `DELETE` comprueba el ámbito antes de la regla de integridad.
- Rechaza `id == auth.user_id`.
- Conserva el 405 por actividad en solicitudes.
- `permisos.eliminar` del detalle es `false` para el propio usuario además de la regla de integridad.
- El detalle expone `permisos.editar_username` (verdadero sin actividad) para que la UI no dependa de `permisos.eliminar`, que ahora también es falso para el propio usuario.

- **Por qué**: evita que un administrador se elimine a sí mismo y mantiene la integridad existente.

### 6. Área en el listado

`GET /usuarios/usuarios` añade `area` (nombre) y `area_id` a la proyección de `vw_usuario`. `UsuarioListaItem` se amplía y `ListaGrid` añade la columna «Área».

- **Por qué**: con usuarios de varias áreas, el listado sin área es ambiguo y obliga a abrir cada detalle.
- **Alternativa descartada**: mostrar solo el filtro de área; no permite distinguir filas al revisar el ámbito completo.

### 7. Frontend: área visible para todo administrador

- `showArea` pasa de `authUser.AR` a la condición de administrador (la sección ya es solo para administradores).
- `useAreasOpcionesQuery` sigue alimentando el selector; para el no AR devuelve el subárbol porque el `GET` de áreas ya está acotado.
- El alta propone `authUser.area` como área inicial para el no AR; el AR sigue sin área preseleccionada.
- La edición usa `usuario.area?.id ?? null` para no romper con usuarios sin área.
- Si el usuario editado es el propio, el selector de área se deshabilita.
- `ListaFiltro` muestra el filtro de área a todo administrador.
- `[id]/index.vue` oculta «Eliminar» cuando `permisos.eliminar` es falso; el backend ya lo devuelve así para el propio usuario.

### 8. Tipos, claves y mutaciones

- `src/types/api.ts`: `UsuarioListaItem` añade `area` y `area_id`.
- `UsuarioDetalle`, `UsuarioCreate` y `UsuarioUpdate` no cambian de forma; el área sigue siendo `number | null` en el formulario y una fila en el detalle.
- `useUsuariosQuery`, `useUsuariosLista` y `useUsuarioUpdate` no cambian: las claves ya incluyen los filtros y las mutaciones invalidan listas y detalles.
- `useAreasOpcionesQuery` no cambia; el contrato de áreas ya está acotado.

## Risks / Trade-offs

- **Asignación de grupos**: el no AR ya puede conceder `administrador` en su área; al ampliar el ámbito podrá hacerlo en las áreas hijas. Es una expansión deliberada y fuera de alcance restringirla; conviene revisarla con el negocio y, si se limita, hacerlo en un cambio aparte.
- **Autoexclusión por grupos**: el propio usuario puede quitarse el grupo `administrador` al editarse; es un riesgo preexistente. Se protege el área y el borrado, no los grupos.
- **Usuarios sin área**: el listado solo mostraba los creados por el administrador, pero la validación aceptaba cualquiera sin área. Este cambio alinea detalle y mutaciones con el listado; verificar en datos que no hay casos legítimos de usuarios sin área creados por otro administrador.
- **Detalle antes sin ámbito**: enlaces directos a usuarios ajenos pasarán a 403; es el comportamiento deseado, pero conviene revisar marcadores o enlaces guardados.
- **Campo `area` en `vw_usuario`**: confirmar que la vista expone el nombre y el id con los nombres esperados antes de desplegar.
- **Orden de despliegue**: el frontend usa la nueva columna y la validación de área; backend y frontend deben desplegarse juntos.
- **Rendimiento**: el subárbol se calcula en memoria sobre una tabla pequeña; no se añade caché.

## Migration Plan

1. Verificar en datos el campo `area`/`area_id` de `vw_usuario` y los usuarios sin área existentes.
2. Desplegar el backend con el ámbito, la validación de área y la protección del propio usuario.
3. Desplegar el frontend con el selector, el filtro y la columna de área.
4. Probar con un administrador AR (sin regresiones) y con un no AR (lista, alta, edición, borrado, área ajena y propio usuario).
5. Rollback: revertir ambos despliegues. No hay cambios de datos ni migraciones pendientes.

## Open Questions

Ninguna que afecte al contrato o a las tareas. La política de grupos se mantiene como está y queda documentada como riesgo.
