# Spec base: Administración

> Comportamiento actual de la administración de **usuarios**, **áreas** y **tipos de
> solicitud**.
> Backend: `controllers/usuarios.py`, `controllers/areas.py`, `controllers/tipos.py`,
> `models/db.py`, `models/db_callbacks.py`.
> Frontend: `src/views/admin/`, `src/stores/{usuarios,areas,tipos}/`,
> `src/api/{usuarios,areas,tipos}.ts`.

---

## 1. Propósito y alcance

La sección `admin` permite:

- gestionar usuarios, sus datos de contacto, roles y estado de registro;
- mantener la estructura de áreas y su jerarquía;
- mantener el catálogo de tipos de solicitud.

Fuera de alcance: autenticación (ver README), solicitudes y reportes.

---

## 2. Acceso y alcance

### Requisitos comunes

- Sesión iniciada.
- Membresía `administrador` para **escritura** de usuarios.
- Para áreas y tipos, además, el área del usuario debe tener `rol_key = 'AR'`.
- La lectura de catálogos está disponible para usuarios autenticados.

### Alcance de usuarios

| Administrador | Puede ver / gestionar |
| --- | --- |
| Área `AR` | Todos los usuarios |
| Área distinta de `AR` | Usuarios de su misma área y usuarios sin área creados por él |

Detalles del backend:

- El listado no-AR filtra por `area_id == auth.user.area` **o**
  (`area_id == None` **y** `created_by == auth.user_id`).
- La validación de escritura (`user_in_scope`) acepta usuarios de la misma área,
  usuarios sin área, o cualquiera si el administrador es AR.
- Un administrador no-AR **no puede cambiar** el área de un usuario: el campo se elimina
  del payload.
- En el alta, un administrador no-AR fuerza `area = auth.user.area`.

> Matiz conocido: el listado solo muestra usuarios sin área creados por el propio
> administrador, pero la validación de edición acepta cualquier usuario sin área.

---

## 3. Usuarios

### Modelo de formulario

```ts
{
  first_name, last_name, username, email,
  area, fijo, movil, grupos: number[]
}
```

En edición se añade `id` y, opcionalmente, `registration_key`.

### Endpoints

```http
GET    /usuarios/usuarios
GET    /usuarios/usuarios/:id
POST   /usuarios/usuarios
PUT    /usuarios/usuarios/:id
DELETE /usuarios/usuarios/:id
```

#### Listado

Parámetros: `search`, `search_in`, `nombre`, `area`, `rol`, `estado`, `page`, `limit`.

- `rol` filtra por `auth_membership.group_id`.
- `estado` filtra por `registration_key`.
- Devuelve `id`, `name`, `username`, `registration_key` desde `vw_usuario`.
- Respuesta paginada `{ data, meta }` o `{ data, meta: { total } }`.

#### Detalle

Devuelve:

- datos de `auth_user`;
- `area` expandida a fila;
- `grupos` como filas de `auth_group`;
- `modified_by` como nombre del usuario;
- `permisos.eliminar`.

`permisos.eliminar` es `true` solo si el usuario **no** aparece como `tramitador`,
`remitente` ni `supervisor` en ninguna solicitud.

#### Alta

- Exige `email` y `username` no vacíos y no repetidos.
- El backend crea la membresía con `grupos`.
- Los campos de registro (`registration_key`, `reset_password_key`,
  `registration_id`) se fuerzan a `NULL`.
- Un administrador no-AR no elige área.

#### Edición

- `email` y `username` no vacíos y no repetidos.
- Un administrador no-AR no puede cambiar `area`.
- `username` **no se puede cambiar** si el usuario tiene actividad auditable
  (es tramitador, remitente o supervisor de alguna solicitud).
- La membresía se reemplaza con `grupos`.

#### Borrado

- Bloqueado con HTTP 405 si el usuario está referenciado por alguna solicitud como
  `tramitador`, `remitente` o `supervisor`.
- Mensaje: «No permitido por una regla de integridad.»

### Reglas de negocio

1. `username` es identificador estable una vez que el usuario participa en solicitudes.
2. `email` y `username` son únicos.
3. El área solo la decide un administrador AR.
4. Un usuario no se borra si tiene historial; se desactiva con `registration_key`.
5. Los grupos definen roles (`administrador`, `supervisor`); no se guardan en
   `auth_user`.
6. El borrado es físico (`DELETE`), no lógico.

---

## 4. Áreas

### Modelo de formulario

```ts
{ nombre, padre: number | null, nivel: number | null }
```

### Endpoints

```http
GET    /areas/areas
GET    /areas/areas/:id
POST   /areas/areas
PUT    /areas/areas/:id
DELETE /areas/areas/:id
```

#### Listado

Parámetros: `search`, `search_in`, `nombre`, `padre`, `nivel`, `rol_key`,
`page`, `limit`.

`rol_key` actúa como booleano: filtra las áreas que tienen rol definido.

El listado también expone `padre_id` y `nivel_id`. La navegación usa esos ids para
construir la jerarquía sin depender de los nombres.

#### Modos de visualización

La vista de áreas ofrece dos modos:

- **Lista**: la tabla paginada con sus filtros.
- **Navegar**: raíz con los niveles 1, 4 y 6. Al elegir un nivel se listan sus áreas;
  al entrar en un área se listan sus hijas. La primera fila de toda lista no raíz
  vuelve al nivel superior. En este modo no hay paginación ni filtro.

En navegación, el clic en el nombre abre el detalle y el icono de carpeta entra en las
hijas. La carpeta solo aparece si el área tiene hijas reales.

#### Detalle

- `nivel` y `padre` expandidos a fila.
- `modified_by` como nombre.
- `permisos.eliminar` es `true` solo si el área no está referenciada por:
  - otra área como padre;
  - un usuario (`auth_user.area`);
  - una solicitud como origen o destino.

#### Alta y edición

Antes de guardar se aplica la lógica de jerarquía:

| `nivel` | `padre` resultante |
| --- | --- |
| `1` | `NULL` (raíz) |
| `4` | `NULL` (raíz) |
| `6` | `NULL` (raíz) |
| `2` | `1` (VPOR) |
| `5` | `4` o `5` (se respeta el valor recibido) |
| otros | Se respeta el valor recibido |

> El nivel 5 es autorrecursivo: puede colgar de un área de nivel 4 o de otra de
> nivel 5 y puede tener hijas de nivel 5.

Al crear desde el navegador:

- desde la lista de un nivel: `nivel = N`, `padre = null`;
- desde las hijas del área X: `padre = X`, `nivel = nivel de las hijas`;
- para un área de nivel 5, el nivel hijo es 5.

Cuando el nivel es 5, el selector «Pertenece a» y el filtro «Padre» ofrecen áreas de
nivel 4 y de nivel 5.

#### Borrado

- Exige ser AR y `administrador`.
- Bloqueado con HTTP 405 si el área es padre de otra, tiene usuarios o aparece en
  solicitudes.

### Reglas de negocio

1. Los niveles 1, 4 y 6 son raíz y no tienen padre.
2. El nivel 2 siempre cuelga del área 1.
3. El nivel 5 puede colgar de un área de nivel 4 o de otra de nivel 5 y puede tener hijas de nivel 5.
4. No se puede borrar un área en uso.
5. `rol_key = 'AR'` habilita reportes globales y administración de áreas/tipos.
6. Cambiar `rol_key` cambia permisos de todos los usuarios del área.

---

## 5. Tipos de solicitud

### Modelo de formulario

```ts
{ nombre, descripcion }
```

### Endpoints

```http
GET    /tipos/tipos
GET    /tipos/tipos/:id
POST   /tipos/tipos
PUT    /tipos/tipos/:id
DELETE /tipos/tipos/:id
```

#### Listado

Parámetros: `search`, `search_in`, `nombre`, `descripcion`, `uso`, `page`, `limit`.

- `uso = "0"` devuelve los tipos sin solicitudes.
- `uso = N` devuelve los tipos con **N o menos** solicitudes.
- El listado devuelve `id`, `nombre`, `descripcion`.

#### Detalle

- `uso` es un campo virtual con la cantidad de solicitudes del tipo.
- `modified_by` como nombre.
- `permisos.eliminar` es `true` solo si `uso == 0`.

#### Alta y edición

- Exigen `administrador` y área AR.
- Validación estándar de web2py; errores → HTTP 422.

#### Borrado

- Exige `administrador` y área AR.
- Bloqueado con HTTP 405 si existe alguna solicitud con ese tipo.

### Reglas de negocio

1. Un tipo usado no se puede borrar.
2. `uso` se calcula en vivo; no se almacena.
3. Nombre y descripción son editables aunque el tipo esté en uso.

---

## 6. Frontend

### Rutas

```text
/admin                          admin-index
/admin/usuarios                 admin-usuarios
/admin/usuarios/crear           admin-usuarios-crear
/admin/usuarios/:id             admin-usuario
/admin/usuarios/:id/editar      admin-usuario-editar
/admin/usuarios/:id/eliminar    admin-usuario-eliminar
/admin/areas                    admin-areas
/admin/areas/crear              admin-areas-crear
/admin/areas/:id                admin-area
/admin/areas/:id/editar         admin-area-editar
/admin/areas/:id/eliminar       admin-area-eliminar
/admin/tipos                    admin-tipos
/admin/tipos/crear              admin-tipos-crear
/admin/tipos/:id                admin-tipo
/admin/tipos/:id/editar         admin-tipo-editar
/admin/tipos/:id/eliminar       admin-tipo-eliminar
```

### Archivos

| Recurso | API | Store | Vistas |
| --- | --- | --- | --- |
| Usuarios | `src/api/usuarios.ts` | `src/stores/usuarios/` | `src/views/admin/usuarios/` |
| Áreas | `src/api/areas.ts` | `src/stores/areas/` | `src/views/admin/areas/` |
| Tipos | `src/api/tipos.ts` | `src/stores/tipos/` | `src/views/admin/tipos/` |

### Patrón de vistas

```text
index.vue        lista + RouterView (lista visible con v-show)
crear.vue        formulario de alta
[id]/index.vue   detalle + provide del recurso
[id]/editar.vue  formulario de edición
[id]/eliminar.vue confirmación de borrado
```

- `index.vue` provee el id seleccionado, `linkCrear` y `setXId`.
- El detalle provee `usuario:usuario`, `area:area` o `tipo:tipo`.
- Las acciones de detalle se anidan para no desmontar la vista padre.
- Los formularios usan `BotonEnvio`, validación local y `errorDeApi`.
- Los permisos de borrado vienen del detalle (`permisos.eliminar`), no se calculan en
  el cliente.
- Al mutar se invalidan `listas()` y `detalles()` del recurso.

### Catálogos de apoyo

- Grupos: `GET /auth_groups/auth_groups`.
- Niveles: `GET /niveles/niveles`.
- Los selects de BVN usan el id numérico de la fila.

---

## 7. Casos límite conocidos

- `registration_key` controla el estado de registro, pero el frontend lo trata como
  campo opcional de edición.
- Un usuario con actividad no puede cambiar `username` ni borrarse.
- Un administrador no-AR puede editar usuarios sin área que no creó, aunque no los vea
  en el listado.
- El borrado de áreas y tipos devuelve 405, no 409.
- El nivel 5 es autorrecursivo: la tabla `nivel` no expresa que pueda tener hijas de su mismo nivel; el frontend lo trata como caso especial.
- Cambiar `rol_key` de un área tiene efecto inmediato en reportes y administración.

---

## 8. Criterios de verificación

- [ ] Un administrador AR ve y gestiona todos los usuarios.
- [ ] Un administrador no-AR solo ve su área y sus usuarios sin área.
- [ ] Un no-AR no puede cambiar el área de un usuario.
- [ ] `username` queda bloqueado si el usuario tiene solicitudes asociadas.
- [ ] El borrado de usuario, área o tipo referenciado devuelve 405 y no borra.
- [ ] Niveles 1, 4 y 6 guardan `padre = null`; nivel 2 guarda `padre = 1`; nivel 5 conserva padre 4 o 5.
- [ ] La vista de áreas alterna entre Lista y Navegar; la raíz muestra 1, 4 y 6 y el detalle se abre desde la fila.
- [ ] El alta desde un nivel y desde un área propone el nivel y el padre correctos.
- [ ] `permisos.eliminar` coincide con la validación del backend.
- [ ] Áreas y tipos solo se escriben desde un área AR.
- [ ] `npm run lint` y `npm run typecheck` terminan sin errores.
