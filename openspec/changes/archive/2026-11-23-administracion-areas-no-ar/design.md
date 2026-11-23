# Design

## Context

Ver `proposal.md` para la motivación. Este diseño se apoya en el estado actual:

- `controllers/areas.py` concentra el CRUD y su propia clase `Validate`. `tipos.py` y `reportes.py` tienen clases `Validate` independientes, así que el cambio de autorización es local a áreas.
- El `GET` de áreas no exige login y no acota por usuario. El frontend solo lo consume desde administración de áreas y desde el selector de área de usuarios (que un no AR no ve).
- La vista `areas` ya expone `padre_id` y `nivel_id`; la tabla `area` tiene `padre` y `nivel`. No hay columna de ruta materializada.
- El frontend ya tiene `useAreasQuery({})` (todas las áreas), `useAreaQuery(id)`, `useAreasNavegacion()` y `nivelHijo()`; `auth.user()` trae `AR`, `area` y `area_nombre`, pero no el nivel del área.
- `ListaGrid` y `ListaNavegador` se montan a la vez en `views/admin/areas/index.vue` con `v-show`, por lo que la consulta de todas las áreas ya está disponible en ambos modos.

## Goals / Non-Goals

**Goals:**

- Un único cálculo de ámbito en el backend, reutilizado por listado, detalle y mutaciones.
- Que la jerarquía no se pueda romper desde la interfaz ni desde una petición manual.
- UI coherente con el backend: no ofrecer acciones que vayan a devolver 403.
- Mantener intacto el comportamiento AR.

**Non-Goals:**

- No se cambia el ámbito de usuarios ni la autorización de tipos o reportes.
- No se añade una columna de ruta ni se migran datos.
- No se permite mover áreas entre padres ni cambiar niveles.
- No se rediseña el modo Navegar de AR.

## Decisions

### 1. Ámbito calculado en memoria a partir de `padre`

El backend obtiene el subárbol con una sola lectura de `db.area` (`id`, `padre`) y un recorrido en memoria con un conjunto de visitados. Se devuelve el conjunto de ids que incluye el área propia.

- **Por qué**: la tabla es pequeña, no hay columna de ruta y una consulta recursiva en SQL complicaría el DAL. El conjunto de visitados evita un bucle infinito si los datos trajeran un ciclo.
- **Alternativa descartada**: repetir `db(db.area.padre == id).select()` por nivel; más consultas y más código.
- **Alternativa descartada**: añadir una vista o columna de ruta; es una migración de datos que queda fuera de alcance.

### 2. Validador de ámbito local a `areas.py`

Se mantiene `@auth.requires_membership('administrador')` y se sustituye `Validate.auth_from_AR` por un validador propio de áreas que:

- deja pasar a AR sin cambios;
- para un no AR, exige que el área objetivo (o el padre en el alta) esté en el conjunto del subárbol;
- bloquea explícitamente el área propia en `PUT` y `DELETE`.

No se toca `Validate` de `tipos.py` ni de `reportes.py`.

- **Por qué**: la autorización de áreas ahora depende de la jerarquía, no solo de `rol_key`. Mantener la clase local evita efectos colaterales en tipos y reportes.

### 3. Lectura acotada solo para el administrador no AR

`GET /areas/areas` añade `id IN subárbol` cuando el usuario es administrador y su área no es AR. `GET /areas/areas/:id` responde 403 si el id no está en el subárbol. AR y el resto de usuarios no se acotan.

- **Por qué**: la UI no debe ofrecer lo que el backend va a rechazar, y el detalle no debe filtrar áreas ajenas.
- **Cuidado**: el `GET` no tiene decorador de login; hay que comprobar `auth.user` antes de leer `auth.user.area` para no romper llamadas anónimas.
- **Alternativa descartada**: añadir un parámetro `scope` al `GET`; el cliente podría omitirlo y el contrato quedaría a medias. El ámbito se impone en el servidor.

### 4. Nivel derivado del padre en el alta

Para el no AR, el `POST`:

1. toma `padre` del cuerpo o, si falta, `auth.user.area`;
2. valida que el padre esté en el subárbol;
3. calcula el nivel hijo: `5` si el padre es de nivel 5, y si no el `nivel.id` cuyo `padre_id` coincide con el nivel del padre;
4. si no hay nivel hijo (padres de nivel 3 o 7), responde 422;
5. ignora cualquier `nivel` enviado por el cliente.

Para AR se conserva la función `padre()` actual.

- **Por qué**: fijar el padre sin derivar el nivel permitiría guardar combinaciones incoherentes. Derivarlo en el servidor elimina la posibilidad de manipularlo.
- **Alternativa descartada**: validar el nivel enviado contra el padre; más reglas y más superficie de error.
- **Seguridad**: el alta solo acepta `nombre`, `padre` y `nivel`; `rol_key` e `is_active` se descartan para que un no AR no pueda crear un área AR ni desactivarla.

### 5. `PUT` del no AR: solo nombre

Para el no AR, el `PUT` elimina `padre` y `nivel` de las variables antes de `validate_and_update`. Solo queda `nombre` (y la firma de auditoría que añade web2py). El formulario puede seguir enviando los valores actuales; el backend los descarta.

- **Por qué**: es la forma más simple de garantizar que el padre y el nivel no cambian, incluso si alguien manipula la petición.
- **Seguridad**: tampoco se aceptan `rol_key` ni `is_active`; el rol y el estado del área se conservan aunque el cliente los envíe.
- **Alternativa descartada**: comparar los valores enviados con los actuales y responder error; añade casos y mensajes sin mejorar la garantía.

### 6. `permisos.editar` en el detalle

Se añade `permisos.editar` a `GET /areas/areas/:id`:

| Usuario | `editar` | `eliminar` |
| --- | --- | --- |
| AR | `true` | Integridad (sin cambios) |
| No AR, área del subárbol | `true` | Integridad |
| No AR, área propia | `false` | `false` |
| No AR, fuera del subárbol | No se devuelve (403) | No se devuelve (403) |

- **Por qué**: la vista de detalle oculta Editar según el contrato, igual que ya hace con Eliminar, en vez de comparar ids en el cliente.
- **Nota**: el área propia siempre tiene al menos al administrador como usuario, así que la integridad ya la marcaría como no borrable; el `false` explícito documenta la regla.

### 7. Frontend: una sola fuente para el área propia

Se añade `useAreaPropiaQuery()` en `src/stores/areas/`. Reutiliza `useAreasQuery({})` (misma clave de caché que el navegador, sin petición adicional cuando ya está montado) y devuelve el `AreaListaItem` del área propia a partir de `authUser.area`. Expone también el nivel hijo disponible con `nivelHijo()`.

- **Por qué**: tanto la lista como la navegación necesitan la fila del área propia y saber si admite hijas. Una sola implementación evita dos fuentes de verdad.
- **Alternativa descartada**: ampliar `auth.user()` con el nivel del área; es un cambio de contrato innecesario cuando el listado acotado ya trae `nivel_id`.

### 8. Navegación del no AR

En `useAreasNavegacion()`:

- `esAR` sale de `useAuthQuery()`.
- En la raíz, AR sigue mostrando los niveles 1, 4 y 6; el no AR muestra una fila única con `areaPropia`.
- `contextoCrear` para el no AR devuelve `{ padre }` (el área propia en la raíz o el nodo actual), sin `nivel`.
- `entrarNivel` queda inactivo para el no AR.
- La miga de pan y el «ir al nivel superior» se mantienen: al entrar en el área propia se ve su nombre y la primera fila vuelve a la raíz de una fila.

- **Por qué**: el modelo «mi área es la raíz» encaja con el ámbito y evita raíces vacías cuando el área es de nivel 5.

### 9. Lista, formularios y detalle

- `useNavigationAdmin()`: «Áreas» para todo administrador; «Tipos» sigue bajo `AR`.
- `ListaFiltro`: nuevo prop `mostrarRolKey`; `ListaGrid` lo pasa con `authUser.AR`. El filtro de nivel y padre se mantienen; el selector de padre ya viene acotado por el `GET`.
- `ListaGrid`: oculta «Agregar» cuando `puedeCrear` es falso. Para AR `puedeCrear` es siempre verdadero; para no AR exige un nivel hijo para el área de contexto.
- `crear.vue`: si no es AR, no muestra los selectores de nivel ni de padre; muestra el nombre del área de contexto como texto. El `padre` por defecto es `props.padreInicial ?? authUser.area`. El payload envía `nivel: null`; el backend lo deriva.
- `editar.vue`: si no es AR, solo el nombre es editable; nivel y «Pertenece a» se muestran como texto. Se envían los valores actuales y el backend los descarta.
- `[id]/index.vue`: «Editar» se muestra con `area.permisos.editar`; «Eliminar» sigue con `area.permisos.eliminar`.

### 10. Tipos, claves de query y mutaciones

- `src/types/models.ts`: nuevo `PermisosArea { editar, eliminar }`; `AreaDetalle.permisos` pasa a ese tipo. `PermisosEliminar` sigue para tipos y usuarios.
- `src/lib/query-keys.ts`: sin cambios. El ámbito es del servidor y las claves actuales (`areas.lista`, `areas.detalle`) siguen siendo válidas por sesión.
- Mutaciones `useAreaCreate`, `useAreaUpdate` y `useAreaDelete`: sin cambios; ya invalidan listas y detalles.

## Risks / Trade-offs

- **El `GET` no exige login** → comprobar `auth.user` antes de calcular el ámbito; no añadir una restricción nueva que rompa llamadas existentes.
- **La vista `areas` y la tabla `area` deben compartir el mismo `id`** → verificar con una consulta antes de desplegar; si no coincidiera, el filtro `belongs` daría resultados incorrectos.
- **Ciclos o datos huérfanos** → recorrido con conjunto de visitados y sin asumir que todo padre existe.
- **Administrador no AR en el área 1** → su subárbol incluiría el área 2 (AR). La regla de negocio dice que no ocurre; verificar en datos antes de desplegar. No se añade una exclusión por `rol_key`.
- **403 global** → el interceptor ya muestra el toast; la UI debe ocultar las acciones para no provocarlo. No se añaden toasts manuales.
- **Áreas de nivel 3 o 7** → no tienen nivel hijo; el backend responde 422 y la UI oculta el alta. La página sigue mostrando el área propia en solo lectura.
- **Rendimiento** → la tabla de áreas es pequeña y el recorrido es en memoria; no se introduce caché adicional.
- **Compatibilidad** → el contrato AR no cambia; el frontend del no AR depende del `GET` acotado, por lo que backend y frontend deben desplegarse juntos.

## Migration Plan

1. Desplegar el backend con el ámbito y `permisos.editar`.
2. Desplegar el frontend con el menú y los formularios adaptados.
3. Verificar con un administrador AR que no hay regresiones y con un administrador no AR que la lista, el alta, la edición y el borrado quedan acotados.
4. Rollback: revertir ambos despliegues. No hay cambios de datos ni migraciones pendientes.

## Open Questions

Ninguna que afecte al contrato o a las tareas. La única comprobación pendiente es de datos (existencia de un administrador no AR en el área 1), y se resuelve antes de desplegar sin cambiar el diseño.
