# Gestión de Usuarios Specification

## Purpose
Define el alcance, las validaciones y las restricciones de integridad de la administración de usuarios, incluyendo roles, área, estado de registro y borrado.

## Requirements

### Requirement: Alcance del administrador
El sistema SHALL limitar la gestión de usuarios al ámbito del administrador. Un administrador AR SHALL gestionar todos los usuarios. Un administrador no AR SHALL gestionar los usuarios de su área y de sus descendientes, además de los usuarios sin área creados por él.

#### Scenario: Administrador AR
- **WHEN** un administrador pertenece a un área con rol AR
- **THEN** el listado y la gestión incluyen usuarios de todas las áreas

#### Scenario: Administrador de área no AR
- **WHEN** un administrador no pertenece a un área AR
- **THEN** el listado incluye los usuarios de su área, los de sus áreas descendientes y los usuarios sin área creados por él

#### Scenario: Edición fuera de alcance
- **WHEN** un administrador no AR intenta editar un usuario fuera de su ámbito
- **THEN** el backend rechaza la operación con error de autorización

#### Scenario: Lectura fuera de alcance
- **WHEN** un administrador no AR consulta el detalle de un usuario fuera de su ámbito
- **THEN** el backend rechaza la operación con error de autorización

#### Scenario: Usuario sin área de otro administrador
- **WHEN** un administrador no AR intenta acceder a un usuario sin área que no creó
- **THEN** el backend rechaza la operación con error de autorización

### Requirement: Alta de usuario
El sistema SHALL crear usuarios con nombre, apellidos, username, email, área, teléfonos y grupos. El username y el email SHALL ser únicos y no vacíos; la membresía SHALL crearse con los grupos indicados. El área SHALL pertenecer al ámbito del administrador; si falta, SHALL usarse el área propia del administrador no AR.

#### Scenario: Alta válida
- **WHEN** un administrador envía un usuario con username y email únicos
- **THEN** el sistema crea el usuario y su membresía con los grupos seleccionados

#### Scenario: Username duplicado
- **WHEN** el username ya existe
- **THEN** el sistema devuelve un error de validación y no crea el usuario

#### Scenario: Área forzada para administrador no AR
- **WHEN** un administrador no AR crea un usuario sin indicar área
- **THEN** el sistema asigna su propia área

#### Scenario: Alta en un área hija
- **WHEN** un administrador no AR crea un usuario en un área de su subárbol
- **THEN** el sistema crea el usuario con esa área

#### Scenario: Alta con área fuera del ámbito
- **WHEN** un administrador no AR indica un área fuera de su subárbol
- **THEN** el backend rechaza la operación con error de autorización

### Requirement: Edición de usuario
El sistema SHALL permitir editar datos de contacto, email, username, área y grupos según el alcance del administrador. Un administrador no AR SHALL poder cambiar el área solo dentro de su ámbito y SHALL conservar la de su propio usuario. El username SHALL ser inmutable cuando el usuario tiene actividad auditable.

#### Scenario: Edición de datos de contacto
- **WHEN** un administrador autorizado guarda cambios de nombre, teléfonos o grupos
- **THEN** el sistema actualiza el usuario y su membresía

#### Scenario: Cambio de área por administrador no AR
- **WHEN** un administrador no AR envía un área de su subárbol
- **THEN** el sistema actualiza el área del usuario

#### Scenario: Cambio de username con actividad
- **WHEN** el usuario aparece como tramitador, remitente o supervisor en alguna solicitud
- **THEN** el sistema ignora el nuevo username y conserva el actual

#### Scenario: Edición de un usuario de un área hija
- **WHEN** un administrador no AR edita un usuario de una de sus áreas descendientes
- **THEN** el sistema valida y persiste los cambios dentro de su ámbito

#### Scenario: Cambio de área fuera del ámbito
- **WHEN** un administrador no AR envía un área fuera de su subárbol
- **THEN** el backend rechaza la operación con error de autorización

#### Scenario: Cambio de área del propio usuario
- **WHEN** un administrador no AR envía un área distinta para su propio usuario
- **THEN** el sistema conserva su área actual

### Requirement: Estado de registro
El sistema SHALL usar `registration_key` para representar el estado de registro del usuario. El alta SHALL dejar los campos de registro en NULL y la edición SHALL permitir actualizar el estado cuando corresponda.

#### Scenario: Usuario recién creado
- **WHEN** se crea un usuario
- **THEN** `registration_key`, `reset_password_key` y `registration_id` quedan en NULL

#### Scenario: Cambio de estado
- **WHEN** un administrador actualiza `registration_key`
- **THEN** el listado refleja el nuevo estado del usuario

### Requirement: Borrado de usuario
El sistema SHALL permitir borrar físicamente un usuario solo si no está referenciado por ninguna solicitud como tramitador, remitente o supervisor. Si está referenciado, SHALL rechazar la operación por integridad. Un administrador no SHALL poder borrar su propio usuario y solo SHALL borrar usuarios de su ámbito.

#### Scenario: Usuario sin actividad
- **WHEN** el usuario no aparece en ninguna solicitud y el administrador confirma el borrado
- **THEN** el sistema elimina el usuario

#### Scenario: Usuario con actividad
- **WHEN** el usuario aparece en alguna solicitud
- **THEN** el sistema rechaza el borrado con un error de integridad y conserva el usuario

#### Scenario: Permiso de borrado en el detalle
- **WHEN** el detalle del usuario se consulta
- **THEN** `permisos.eliminar` es verdadero solo si el usuario no tiene actividad y no es el propio usuario

#### Scenario: Borrado del propio usuario
- **WHEN** un administrador intenta borrar su propio usuario
- **THEN** el backend rechaza la operación con error de autorización

### Requirement: Ámbito de lectura de usuarios
`GET /usuarios/usuarios` y `GET /usuarios/usuarios/:id` SHALL devolver al administrador no AR solo los usuarios de su subárbol y los usuarios sin área creados por él. Un administrador AR conserva la lectura completa.

#### Scenario: Listado del administrador no AR
- **WHEN** un administrador no AR consulta el listado de usuarios
- **THEN** el resultado incluye su área, sus descendientes y los usuarios sin área creados por él, y ninguna otra

#### Scenario: Detalle fuera del ámbito
- **WHEN** un administrador no AR consulta un usuario fuera de su ámbito
- **THEN** el backend rechaza la operación con error de autorización

#### Scenario: Lectura del administrador AR
- **WHEN** un administrador AR consulta el listado o un detalle
- **THEN** el resultado no se acota por subárbol

### Requirement: Permiso de edición de username en el detalle
`GET /usuarios/usuarios/:id` SHALL devolver `permisos.editar_username`, verdadero cuando el usuario no tiene actividad auditable.

#### Scenario: Usuario sin actividad
- **WHEN** el detalle del usuario se consulta y el usuario no aparece en ninguna solicitud
- **THEN** `permisos.editar_username` es verdadero

#### Scenario: Usuario con actividad
- **WHEN** el usuario aparece como tramitador, remitente o supervisor en alguna solicitud
- **THEN** `permisos.editar_username` es falso

### Requirement: Área del usuario en el listado
`GET /usuarios/usuarios` SHALL devolver `area` y `area_id` en cada fila. La lista SHALL mostrar el área de cada usuario.

#### Scenario: Fila con área
- **WHEN** se consulta el listado de usuarios
- **THEN** cada fila incluye el nombre y el id de su área

#### Scenario: Filtro por área
- **WHEN** un administrador no AR filtra por un área de su ámbito
- **THEN** el listado muestra solo los usuarios de esa área dentro del ámbito

### Requirement: Interfaz de selección de área para el administrador no AR
La administración de usuarios SHALL ofrecer el selector de área en el alta, la edición y el filtro del administrador no AR, con las opciones acotadas a su ámbito. El alta SHALL proponer el área propia y la edición del propio usuario SHALL mostrar el área en solo lectura.

#### Scenario: Alta con área
- **WHEN** un administrador no AR abre el formulario de alta
- **THEN** el selector de área ofrece su área y sus descendientes, con su área seleccionada por defecto

#### Scenario: Edición de un usuario de un área hija
- **WHEN** un administrador no AR edita un usuario de una de sus áreas descendientes
- **THEN** el selector de área ofrece el ámbito y mantiene el área actual del usuario

#### Scenario: Filtro de área
- **WHEN** un administrador no AR abre el filtro del listado
- **THEN** el selector de área ofrece solo las áreas de su ámbito

#### Scenario: Edición del propio usuario
- **WHEN** un administrador no AR edita su propio usuario
- **THEN** el área se muestra en solo lectura y no se puede cambiar
