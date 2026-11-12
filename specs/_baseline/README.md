# Referencia base de ADM Red

> Detalle técnico del comportamiento **actual** del sistema, verificado contra el frontend
> (`D:\proyectos\vue-bs\admred`) y el backend web2py
> (`D:\proyectos\web2py\applications\admred`).
> Los contratos operativos viven en `openspec/specs/`. Última revisión: 2026-11-12.

---

## 1. Qué es esta referencia base

Esta carpeta describe lo que el sistema **ya hace** con detalle técnico: endpoints,
campos, tablas, archivos y casos límite. Sirve como:

- referencia profunda antes de cambiar un módulo;
- contrato técnico entre frontend y backend;
- apoyo para redactar las specs de OpenSpec.

Los contratos de comportamiento por capacidad están en `openspec/specs/`. Si el código y
una spec discrepan, **manda el código** hasta que se confirme un cambio de comportamiento.
En ese caso, corregir la capacidad OpenSpec y actualizar esta referencia si su detalle
técnico queda obsoleto.

---

## 2. Orden de lectura

Antes de tocar un módulo:

```text
project-context.md
  → openspec/specs/<capacidad>/spec.md
  → specs/_baseline/README.md
  → specs/_baseline/<módulo>.md
  → código real del módulo
  → controlador web2py si cambia el contrato
```


| Documento | Contenido |
| --- | --- |
| `../../project-context.md` | Stack, arquitectura, capas, convenciones y deuda técnica |
| `solicitudes.md` | Ciclo de vida, estados, permisos, notas, adjuntos y notificaciones |
| `administracion.md` | Usuarios, áreas y tipos de solicitud |
| `reportes.md` | Reportes, restricción AR, filtros y exportación |

La autenticación es **transversal** y se documenta en este README.

---

## 3. Convenciones de una spec

Cada spec de módulo usa estas secciones:

1. **Propósito y alcance**: qué resuelve y qué queda fuera.
2. **Actores y permisos**: quién puede hacer qué y con qué condición.
3. **Modelo y estados**: entidades, campos relevantes y transiciones.
4. **Endpoints**: método, ruta, parámetros y forma de respuesta.
5. **Reglas de negocio**: invariantes que no se pueden romper.
6. **Frontend**: archivos responsables y flujo de datos.
7. **Casos límite**: comportamientos conocidos que parecen errores pero son actuales.
8. **Criterios de verificación**: comprobaciones mínimas tras un cambio.

Reglas de redacción:

- Español, directo, sin marketing.
- Sin endpoints ni campos inventados.
- Distinguir siempre **frontend**, **backend** y **base de datos**.
- Las fechas se escriben como las devuelve el backend (`YYYY-MM-DD HH:mm:ss`).
- Los identificadores del backend no se traducen (`first_name`, `solicitado_en`, …).

---

## 4. Cambios de comportamiento con OpenSpec

El proyecto usa OpenSpec. Los cambios de comportamiento **no** se crean a mano en
`specs/`:

```text
openspec/changes/<cambio>/
├── .openspec.yaml # metadatos del cambio
├── proposal.md    # problema, alcance, capacidades e impacto
├── specs/         # deltas por capacidad
├── design.md      # contrato API, estados, permisos, archivos afectados
└── tasks.md       # pasos verificables
```

Flujo:

1. `/openspec-explore` para investigar una idea.
2. `/openspec-propose` para crear la propuesta y sus artefactos.
3. `/openspec-apply-change` para implementar `tasks.md`.
4. `/openspec-archive-change` para fusionar los deltas en `openspec/specs/`.

Reglas:

- Cada delta debe indicar la capacidad existente o nueva con su ruta exacta.
- Los cambios que solo corrigen un bug sin alterar contrato no necesitan spec nueva, pero
  sí revisar la capacidad para confirmar que el comportamiento esperado está claro.
- Al archivar, actualizar `project-context.md` y esta referencia si cambió el detalle
  técnico.

---

## 5. Autenticación y autorización (transversal)

### Sesión

- La sesión viaja por **cookie**; no hay tokens en el frontend.
- El cliente axios usa `withCredentials: true`.
- `GET /auth/login` devuelve el usuario autenticado o falla si no hay sesión.
- Login: `POST /auth/login` con credenciales.
- Logout: `DELETE /auth/login`.
- Personificación: `POST /auth/impersonate/:id`; solo si `AuthUser.can_impersonate`.
- Usuarios disponibles para personificar: `GET /auth/users`.

### Contrato `AuthUser`

```ts
{
  id, name, username, email, movil, fijo,
  admin, supervisor,
  user_groups,
  is_impersonating, can_impersonate,
  AR, DAR,
  area, area_nombre
}
```

Significado operativo:

| Campo | Uso real |
| --- | --- |
| `admin` | Acceso a la sección de administración |
| `supervisor` | Permisos de supervisión sobre el área destino/origen |
| `AR` | Reportes globales y administración de áreas/tipos |
| `DAR` | Presente en el contrato; el frontend no lo usa para menús |
| `area` | Área del usuario; base de casi todos los permisos contextuales |
| `can_impersonate` | Habilita el menú de personificación |

### Reglas de sesión en el frontend

- `useAuthQuery` usa `staleTime: Infinity`.
- `useLogin` y `useLogout` escriben directamente `queryKeys.auth.user()`.
- El guard `beforeEach` espera a que la sesión deje de estar pendiente.
- Sin sesión en ruta privada → `auth-login` con `?next=`.
- Un `401` fuera del login emite `unauthorized` y redirige al login.
- El fallo de login se muestra **inline**; no genera toast global.

### Reglas de autorización del backend

- La mayoría de controladores usa `@auth.requires_login()`.
- Administración exige `@auth.requires_membership('administrador')`.
- Reportes globales exigen `rol_key == 'AR'` del área del usuario.
- Los permisos contextuales de una solicitud se calculan en el **GET de detalle** y el
  backend los vuelve a validar en cada acción.
- **Nunca** confiar solo en `permisos` del frontend para autorizar: es una ayuda de UI.

### Roles observados

| Rol / grupo | Efecto |
| --- | --- |
| `administrador` | Gestiona usuarios de su alcance |
| `supervisor` | Asigna, reenvía, aprueba y ve solicitudes de su área |
| `tramitador` (implícito por asignación) | Responde y reenvía solicitudes asignadas |
| `remitente` (implícito por autoría) | Evalúa y comenta sus solicitudes |
| Área con `rol_key = 'AR'` | Acceso global a reportes y catálogos administrativos |

---

## 6. Índice de módulos

| Módulo | Capacidad OpenSpec | Referencia | Alcance |
| --- | --- | --- | --- |
| Solicitudes | `solicitudes` | `solicitudes.md` | Registro, asignación, reenvío, respuesta, aprobación, evaluación, notas y adjuntos |
| Usuarios | `gestion-usuarios` | `administracion.md` | Alta, edición, roles, estado y borrado |
| Áreas | `estructura-areas` | `administracion.md` | Jerarquía, autorización y borrado |
| Tipos | `tipos-solicitud` | `administracion.md` | Catálogo, uso y borrado |
| Reportes | `reportes` | `reportes.md` | Pendientes, indicadores, búsqueda, consultas y exportación |
| Autenticación | `autenticacion` | este README | Sesión, login, roles y personificación |
