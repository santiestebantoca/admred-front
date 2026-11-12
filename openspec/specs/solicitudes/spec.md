# Solicitudes Specification

## Purpose
Define cómo se registran, asignan, reenvían, responden, aprueban, evalúan y consultan las solicitudes entre áreas, incluyendo permisos contextuales, bandejas, notas, adjuntos y notificaciones.

## Requirements

### Requirement: Registro de solicitud
El sistema SHALL crear una solicitud en estado Solicitado (1), con código `S-YY-NNNN`, origen tomado del área del usuario, remitente tomado del usuario autenticado y fecha de solicitud. El destino, el objetivo, el tipo y la fecha de cumplimiento los aporta el usuario.

#### Scenario: Alta de solicitud original
- **WHEN** un usuario autenticado envía destino, objetivo y tipo válidos
- **THEN** el sistema crea la solicitud en estado 1 con código, origen, remitente y `solicitado_en` asignados por el backend

#### Scenario: Error de validación en el alta
- **WHEN** el formulario envía datos inválidos o incompletos
- **THEN** el sistema devuelve errores por campo y no crea la solicitud

#### Scenario: Solicitud sin destino
- **WHEN** el usuario intenta enviar una solicitud sin seleccionar un área destino
- **THEN** la interfaz muestra un error local y no llama al backend

### Requirement: Reenvío de solicitud
El sistema SHALL permitir reenviar una solicitud creando una nueva solicitud hija vinculada mediante `padre`. Si el padre está en estado 1, el sistema SHALL pasarlo a estado 2 y asignarle como supervisor y tramitador al usuario que reenvía.

#### Scenario: Reenvío desde una solicitud solicitada
- **WHEN** un supervisor del área destino reenvía una solicitud en estado 1
- **THEN** se crea la hija con `padre`, y el padre pasa a estado 2 con el usuario actual como supervisor y tramitador

#### Scenario: Reenvío desde una solicitud en proceso
- **WHEN** el tramitador de una solicitud en estado 2 la reenvía a otra área
- **THEN** se crea la hija y el padre conserva su estado y asignación actuales

#### Scenario: Intento de reenvío sin permiso en la interfaz
- **WHEN** el usuario no cumple la condición de reenvío
- **THEN** la interfaz no ofrece la acción de reenvío

### Requirement: Asignación de tramitador
El sistema SHALL permitir asignar o reasignar un tramitador solo a un supervisor del área destino, y el tramitador SHALL pertenecer a esa misma área. La asignación SHALL registrar supervisor, fecha de asignación y estado En proceso (2).

#### Scenario: Asignación válida
- **WHEN** un supervisor del área destino asigna un tramitador de esa área
- **THEN** la solicitud queda en estado 2 con `supervisor`, `tramitador` y `tramitador_en` actualizados

#### Scenario: Tramitador de otra área
- **WHEN** se intenta asignar un tramitador que no pertenece al área destino
- **THEN** el backend rechaza la operación con error de autorización

#### Scenario: Usuario sin rol de supervisor
- **WHEN** un usuario que no es supervisor del área destino intenta asignar
- **THEN** el backend rechaza la operación con error de autorización

### Requirement: Respuesta del tramitador
El sistema SHALL permitir responder solo al tramitador asignado. La respuesta SHALL guardar observaciones, fecha de respuesta, adjuntos de respuesta y estado En evaluación (3).

#### Scenario: Respuesta válida
- **WHEN** el tramitador asignado envía una respuesta
- **THEN** la solicitud pasa a estado 3 y se guarda `respuesta_en`

#### Scenario: Sincronización de adjuntos de respuesta
- **WHEN** el tramitador responde con un conjunto de adjuntos
- **THEN** el sistema conserva los adjuntos incluidos y elimina los adjuntos de respuesta heredados que ya no se incluyen

#### Scenario: Usuario distinto al tramitador
- **WHEN** un usuario que no es el tramitador asignado intenta responder
- **THEN** el backend rechaza la operación con error de autorización

### Requirement: Aprobación y rechazo
El sistema SHALL permitir aprobar o rechazar solo al supervisor asignado. Aprobar SHALL pasar la solicitud a Terminada (4) y registrar la fecha de terminación; rechazar SHALL devolverla a En proceso (2).

#### Scenario: Aprobación
- **WHEN** el supervisor asignado aprueba una solicitud en estado 3
- **THEN** la solicitud pasa a estado 4 y se registra `terminado_en`

#### Scenario: Rechazo
- **WHEN** el supervisor asignado rechaza la respuesta de una solicitud en estado 3
- **THEN** la solicitud vuelve a estado 2 y puede añadirse una nota con el evento de respuesta rechazada

#### Scenario: Supervisor no asignado
- **WHEN** un supervisor distinto del asignado intenta aprobar o rechazar
- **THEN** el backend rechaza la operación con error de autorización

### Requirement: Evaluación del remitente
El sistema SHALL permitir evaluar solo al remitente, solo cuando la solicitud esté Terminada (4) y no tenga evaluación previa. La evaluación SHALL guardarse una única vez.

#### Scenario: Evaluación válida
- **WHEN** el remitente evalúa una solicitud terminada sin evaluación
- **THEN** el sistema guarda la calificación y deja de ofrecer la acción de evaluar

#### Scenario: Evaluación duplicada
- **WHEN** la solicitud ya tiene una evaluación
- **THEN** la interfaz no ofrece la acción de evaluar

#### Scenario: Usuario distinto al remitente
- **WHEN** un usuario que no es el remitente intenta evaluar
- **THEN** el backend rechaza la operación con error de autorización

### Requirement: Bandejas de solicitudes
El sistema SHALL separar las bandejas de recibidas y enviadas. Para supervisores, recibidas SHALL agrupar por área destino y enviadas por área origen; para el resto, recibidas SHALL agrupar por tramitador y enviadas por remitente.

#### Scenario: Bandeja de un supervisor
- **WHEN** un supervisor consulta sus solicitudes recibidas
- **THEN** ve las solicitudes cuyo destino es su área

#### Scenario: Bandeja de un tramitador
- **WHEN** un usuario sin rol de supervisor consulta sus solicitudes recibidas
- **THEN** ve las solicitudes que tiene asignadas como tramitador

#### Scenario: Filtro de pendientes
- **WHEN** el usuario selecciona la bandeja de pendientes
- **THEN** el sistema excluye las solicitudes en estado 4

#### Scenario: Filtro de terminadas por periodo
- **WHEN** el usuario selecciona terminadas y un periodo de 14 días, 1 mes, 6 meses o 1 año
- **THEN** el sistema devuelve solo las solicitudes terminadas dentro de esa ventana

### Requirement: Permisos contextuales
El detalle de una solicitud SHALL exponer los permisos `asignar`, `reenviar`, `responder`, `aprobar`, `evaluar` y `comentar`, calculados según el estado y la relación del usuario con la solicitud. La interfaz SHALL usar esos permisos para mostrar u ocultar acciones.

#### Scenario: Permisos de asignación
- **WHEN** el usuario es supervisor del área destino y la solicitud está en estado 1 o 2
- **THEN** el detalle devuelve `asignar: true`

#### Scenario: Permisos de comentario
- **WHEN** la solicitud no está terminada y el usuario es supervisor, tramitador o remitente
- **THEN** el detalle devuelve `comentar: true`

#### Scenario: Solicitud terminada
- **WHEN** la solicitud está en estado 4
- **THEN** el detalle no ofrece asignar, reenviar, responder ni comentar

### Requirement: Notas de seguimiento
El sistema SHALL permitir crear notas solo a usuarios relacionados con la solicitud: tramitador, remitente o supervisor. La nota SHALL registrar autor y rol de autoría.

#### Scenario: Nota del tramitador
- **WHEN** el tramitador escribe una nota
- **THEN** la nota se registra con autoría de tramitador

#### Scenario: Nota del remitente
- **WHEN** el remitente escribe una nota
- **THEN** la nota se registra con autoría de remitente y sin tramitador ni supervisor

#### Scenario: Usuario ajeno a la solicitud
- **WHEN** un usuario no relacionado intenta crear una nota
- **THEN** el backend rechaza la operación con error de autorización

### Requirement: Adjuntos de solicitud y respuesta
El sistema SHALL distinguir los adjuntos de la solicitud de los adjuntos de la respuesta. Los adjuntos de solicitud SHALL conservarse durante el ciclo de vida; los de respuesta SHALL sincronizarse al responder.

#### Scenario: Adjuntos en el alta
- **WHEN** el usuario adjunta documentos al crear o reenviar una solicitud
- **THEN** los documentos quedan asociados a la solicitud como adjuntos de tipo solicitud

#### Scenario: Adjuntos en la respuesta
- **WHEN** el tramitador responde con adjuntos
- **THEN** los documentos quedan asociados a la respuesta y son visibles en el detalle

### Requirement: Notificaciones de pendientes
El sistema SHALL exponer un resumen de solicitudes pendientes con totales de recibidas y enviadas, y listas de recibidas por asignar, por responder y por aprobar.

#### Scenario: Pendientes por asignar
- **WHEN** un supervisor consulta sus notificaciones
- **THEN** la lista de por asignar contiene las solicitudes en estado 1 de su área destino

#### Scenario: Pendientes por responder
- **WHEN** un tramitador consulta sus notificaciones
- **THEN** la lista de por responder contiene las solicitudes en estado 2 que tiene asignadas

#### Scenario: Pendientes por aprobar
- **WHEN** un supervisor consulta sus notificaciones
- **THEN** la lista de por aprobar contiene las solicitudes en estado 3 que supervisa
