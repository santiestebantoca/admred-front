# Tipos de Solicitud Specification

## Purpose
Define el catálogo de tipos de solicitud, su nivel de uso y las restricciones para crearlos, editarlos y eliminarlos.

## Requirements

### Requirement: Catálogo de tipos
El sistema SHALL mantener un catálogo de tipos con nombre y descripción, editable por administradores de áreas AR. Los tipos SHALL poder filtrarse por nombre, descripción y nivel de uso.

#### Scenario: Alta de tipo
- **WHEN** un administrador AR guarda un tipo con nombre válido
- **THEN** el sistema crea el tipo y lo ofrece en los formularios de solicitud

#### Scenario: Edición de tipo
- **WHEN** un administrador AR modifica el nombre o la descripción de un tipo
- **THEN** el sistema actualiza el tipo aunque esté en uso

#### Scenario: Usuario no autorizado
- **WHEN** un usuario que no es administrador AR intenta crear o editar un tipo
- **THEN** el backend rechaza la operación con error de autorización

### Requirement: Uso del tipo
El sistema SHALL calcular en vivo la cantidad de solicitudes que usan cada tipo. El filtro de uso SHALL permitir seleccionar tipos sin uso o con un máximo de solicitudes.

#### Scenario: Tipo sin uso
- **WHEN** se filtra por uso igual a cero
- **THEN** el sistema devuelve solo los tipos que no tienen solicitudes asociadas

#### Scenario: Tipo con uso limitado
- **WHEN** se filtra por un máximo de N solicitudes
- **THEN** el sistema devuelve los tipos cuya cantidad de solicitudes es menor o igual a N

#### Scenario: Detalle de tipo
- **WHEN** se consulta el detalle de un tipo
- **THEN** el sistema devuelve su cantidad de uso actual

### Requirement: Borrado de tipo
El sistema SHALL eliminar un tipo solo si no tiene solicitudes asociadas. Si está en uso, SHALL rechazar la operación por integridad.

#### Scenario: Tipo sin solicitudes
- **WHEN** el tipo no tiene solicitudes y el administrador AR confirma el borrado
- **THEN** el sistema elimina el tipo

#### Scenario: Tipo en uso
- **WHEN** el tipo tiene al menos una solicitud asociada
- **THEN** el sistema rechaza el borrado con un error de integridad

#### Scenario: Permiso de borrado en el detalle
- **WHEN** se consulta el detalle de un tipo
- **THEN** `permisos.eliminar` es verdadero solo si su uso es cero
