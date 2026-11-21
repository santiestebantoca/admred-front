# Spec Delta

## ADDED Requirements

### Requirement: Actividad de solicitudes territoriales
El sistema SHALL clasificar como provisión (`PROV`) o administración (`ADMIN`) las solicitudes cuyo origen sea un área de nivel 7 y cuyo destino sea su área padre de nivel 6. La actividad SHALL definirla una única vez el supervisor del área destino, en estado 1 o 2, antes de asignar o reenviar. El detalle SHALL exponer `actividad`, `requiere_actividad` y `puede_definir_actividad`.

#### Scenario: Detección de solicitud territorial
- **WHEN** el origen de la solicitud es un área de nivel 7 y el destino es su área padre de nivel 6
- **THEN** el detalle marca `requiere_actividad` como verdadero

#### Scenario: Solicitud no territorial
- **WHEN** el origen de la solicitud no es un área de nivel 7 o el destino no es su área padre
- **THEN** el detalle marca `requiere_actividad` como falso y no se solicita actividad

#### Scenario: Definición por el supervisor
- **WHEN** el supervisor del área destino define `PROV` o `ADMIN` en una solicitud que requiere actividad y no la tiene
- **THEN** el sistema guarda el valor y el detalle deja de ofrecer la definición

#### Scenario: Definición única
- **WHEN** se intenta definir la actividad de una solicitud que ya la tiene
- **THEN** el sistema rechaza la operación con error de validación y conserva el valor original

#### Scenario: Usuario no autorizado
- **WHEN** un usuario que no es supervisor del área destino intenta definir la actividad
- **THEN** el sistema rechaza la operación con error de autorización

#### Scenario: Estado no permitido
- **WHEN** se intenta definir la actividad de una solicitud en estado 3 o 4
- **THEN** el sistema rechaza la operación

#### Scenario: Actividad visible en el detalle
- **WHEN** una solicitud tiene actividad definida
- **THEN** el detalle muestra «Provisión» o «Administración» según el valor

#### Scenario: Bloqueo al tramitador
- **WHEN** el tramitador de una solicitud en estado 2 sin actividad intenta reenviarla
- **THEN** la interfaz muestra un aviso de que el supervisor debe definir la actividad y no permite el envío

## MODIFIED Requirements

### Requirement: Reenvío de solicitud
El sistema SHALL permitir reenviar una solicitud creando una nueva solicitud hija vinculada mediante `padre`. Si el padre está en estado 1, el sistema SHALL pasarlo a estado 2 y asignarle como supervisor y tramitador al usuario que reenvía. Si el padre requiere actividad y no la tiene, el sistema SHALL impedir el reenvío.

#### Scenario: Reenvío desde una solicitud solicitada
- **WHEN** un supervisor del área destino reenvía una solicitud en estado 1
- **THEN** se crea la hija con `padre`, y el padre pasa a estado 2 con el usuario actual como supervisor y tramitador

#### Scenario: Reenvío desde una solicitud en proceso
- **WHEN** el tramitador de una solicitud en estado 2 la reenvía a otra área
- **THEN** se crea la hija y el padre conserva su estado y asignación actuales

#### Scenario: Intento de reenvío sin permiso en la interfaz
- **WHEN** el usuario no cumple la condición de reenvío
- **THEN** la interfaz no ofrece la acción de reenvío

#### Scenario: Reenvío bloqueado por actividad faltante
- **WHEN** se intenta reenviar una solicitud que requiere actividad y no la tiene
- **THEN** el sistema rechaza la operación con error de validación y no crea la solicitud hija

#### Scenario: Reenvío con actividad definida
- **WHEN** se reenvía una solicitud que requiere actividad y ya la tiene
- **THEN** el sistema crea la solicitud hija con el comportamiento normal de reenvío

### Requirement: Asignación de tramitador
El sistema SHALL permitir asignar o reasignar un tramitador solo a un supervisor del área destino, y el tramitador SHALL pertenecer a esa misma área. La asignación SHALL registrar supervisor, fecha de asignación y estado En proceso (2). Si la solicitud requiere actividad y no la tiene, el sistema SHALL impedir la asignación.

#### Scenario: Asignación válida
- **WHEN** un supervisor del área destino asigna un tramitador de esa área
- **THEN** la solicitud queda en estado 2 con `supervisor`, `tramitador` y `tramitador_en` actualizados

#### Scenario: Tramitador de otra área
- **WHEN** se intenta asignar un tramitador que no pertenece al área destino
- **THEN** el backend rechaza la operación con error de autorización

#### Scenario: Usuario sin rol de supervisor
- **WHEN** un usuario que no es supervisor del área destino intenta asignar
- **THEN** el backend rechaza la operación con error de autorización

#### Scenario: Asignación bloqueada por actividad faltante
- **WHEN** un supervisor del área destino intenta asignar una solicitud que requiere actividad y no la tiene
- **THEN** el sistema rechaza la operación con error de validación y no cambia el estado ni el tramitador

#### Scenario: Asignación con actividad definida
- **WHEN** se asigna una solicitud que requiere actividad y ya la tiene
- **THEN** la asignación se realiza con el comportamiento normal
