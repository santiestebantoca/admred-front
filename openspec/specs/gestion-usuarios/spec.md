# Gestión de Usuarios Specification

## Purpose
Define el alcance, las validaciones y las restricciones de integridad de la administración de usuarios, incluyendo roles, área, estado de registro y borrado.

## Requirements

### Requirement: Alcance del administrador
El sistema SHALL limitar la gestión de usuarios según el área del administrador. Un administrador de área AR SHALL gestionar todos los usuarios; un administrador de otra área SHALL gestionar los usuarios de su área y los usuarios sin área creados por él.

#### Scenario: Administrador AR
- **WHEN** un administrador pertenece a un área con rol AR
- **THEN** el listado y la gestión incluyen usuarios de todas las áreas

#### Scenario: Administrador de área no AR
- **WHEN** un administrador no pertenece a un área AR
- **THEN** el listado incluye solo usuarios de su área y usuarios sin área creados por él

#### Scenario: Edición fuera de alcance
- **WHEN** un administrador no AR intenta editar un usuario de otra área
- **THEN** el backend rechaza la operación con error de autorización

### Requirement: Alta de usuario
El sistema SHALL crear usuarios con nombre, apellidos, username, email, área, teléfonos y grupos. El username y el email SHALL ser únicos y no vacíos; la membresía SHALL crearse con los grupos indicados.

#### Scenario: Alta válida
- **WHEN** un administrador envía un usuario con username y email únicos
- **THEN** el sistema crea el usuario y su membresía con los grupos seleccionados

#### Scenario: Username duplicado
- **WHEN** el username ya existe
- **THEN** el sistema devuelve un error de validación y no crea el usuario

#### Scenario: Área forzada para administrador no AR
- **WHEN** un administrador no AR crea un usuario
- **THEN** el sistema asigna el área del administrador, aunque el formulario envíe otra

### Requirement: Edición de usuario
El sistema SHALL permitir editar datos de contacto, email, username, área y grupos según el alcance del administrador. Un administrador no AR SHALL NOT cambiar el área de un usuario. El username SHALL ser inmutable cuando el usuario tiene actividad auditable.

#### Scenario: Edición de datos de contacto
- **WHEN** un administrador autorizado guarda cambios de nombre, teléfonos o grupos
- **THEN** el sistema actualiza el usuario y su membresía

#### Scenario: Cambio de área por administrador no AR
- **WHEN** un administrador no AR envía un área distinta
- **THEN** el sistema ignora el cambio de área y conserva la actual

#### Scenario: Cambio de username con actividad
- **WHEN** el usuario aparece como tramitador, remitente o supervisor en alguna solicitud
- **THEN** el sistema ignora el nuevo username y conserva el actual

### Requirement: Estado de registro
El sistema SHALL usar `registration_key` para representar el estado de registro del usuario. El alta SHALL dejar los campos de registro en NULL y la edición SHALL permitir actualizar el estado cuando corresponda.

#### Scenario: Usuario recién creado
- **WHEN** se crea un usuario
- **THEN** `registration_key`, `reset_password_key` y `registration_id` quedan en NULL

#### Scenario: Cambio de estado
- **WHEN** un administrador actualiza `registration_key`
- **THEN** el listado refleja el nuevo estado del usuario

### Requirement: Borrado de usuario
El sistema SHALL permitir borrar físicamente un usuario solo si no está referenciado por ninguna solicitud como tramitador, remitente o supervisor. Si está referenciado, SHALL rechazar la operación por integridad.

#### Scenario: Usuario sin actividad
- **WHEN** el usuario no aparece en ninguna solicitud y el administrador confirma el borrado
- **THEN** el sistema elimina el usuario

#### Scenario: Usuario con actividad
- **WHEN** el usuario aparece en alguna solicitud
- **THEN** el sistema rechaza el borrado con un error de integridad y conserva el usuario

#### Scenario: Permiso de borrado en el detalle
- **WHEN** el detalle del usuario se consulta
- **THEN** `permisos.eliminar` es verdadero solo si el usuario no tiene actividad asociada
