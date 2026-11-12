# Estructura de Áreas Specification

## Purpose
Define la jerarquía de áreas, las reglas de asignación de área padre y las restricciones de integridad para crear, editar y eliminar áreas.

## Requirements

### Requirement: Jerarquía de áreas
El sistema SHALL organizar las áreas por niveles y área padre. Los niveles 1 y 4 SHALL ser raíz y no tener padre; el nivel 2 SHALL tener como padre el área 1. Los demás niveles SHALL respetar el padre recibido.

#### Scenario: Área de nivel 1
- **WHEN** se guarda un área con nivel 1
- **THEN** el sistema guarda `padre` en NULL

#### Scenario: Área de nivel 4
- **WHEN** se guarda un área con nivel 4
- **THEN** el sistema guarda `padre` en NULL

#### Scenario: Área de nivel 2
- **WHEN** se guarda un área con nivel 2
- **THEN** el sistema guarda `padre` con el área 1

### Requirement: Autorización de escritura de áreas
El sistema SHALL permitir crear, editar y eliminar áreas solo a usuarios con membresía de administrador y área con rol AR.

#### Scenario: Administrador AR
- **WHEN** un administrador de un área AR guarda un área
- **THEN** el sistema valida y persiste los cambios

#### Scenario: Administrador no AR
- **WHEN** un administrador de un área sin rol AR intenta guardar un área
- **THEN** el backend rechaza la operación con error de autorización

### Requirement: Borrado de área
El sistema SHALL eliminar un área solo si no es padre de otra área, no tiene usuarios asociados y no aparece como origen o destino de una solicitud. Si está referenciada, SHALL rechazar la operación por integridad.

#### Scenario: Área sin referencias
- **WHEN** el área no tiene hijas, usuarios ni solicitudes y el administrador confirma el borrado
- **THEN** el sistema elimina el área

#### Scenario: Área padre de otra área
- **WHEN** el área tiene al menos una hija
- **THEN** el sistema rechaza el borrado con un error de integridad

#### Scenario: Área con usuarios o solicitudes
- **WHEN** el área tiene usuarios asociados o aparece en solicitudes
- **THEN** el sistema rechaza el borrado con un error de integridad

#### Scenario: Permiso de borrado en el detalle
- **WHEN** se consulta el detalle de un área
- **THEN** `permisos.eliminar` es verdadero solo si no tiene hijas, usuarios ni solicitudes
