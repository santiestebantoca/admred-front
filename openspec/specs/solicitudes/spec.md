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

### Requirement: Selección automática con una única área destino
Cuando el catálogo de áreas destino contiene exactamente una área, el sistema SHALL fijarla como destino, mostrar su nombre en un campo de solo lectura y deshabilitar el botón del desplegable para impedir la apertura de un menú sin opciones.

#### Scenario: Única área destino disponible
- **WHEN** el usuario abre el formulario de alta o de reenvío de una solicitud y el catálogo contiene exactamente una área destino
- **THEN** el selector fija esa área como destino, muestra su nombre y el botón del desplegable queda deshabilitado

#### Scenario: Intento de abrir el desplegable deshabilitado
- **WHEN** el selector muestra una única área destino y el usuario intenta abrir el desplegable o escribir en el campo de búsqueda
- **THEN** el menú no se abre, el campo no admite texto y el destino seleccionado no cambia

#### Scenario: La única área cambia después de cargar
- **WHEN** el catálogo termina de cargar con una sola área o pasa de varias a una
- **THEN** el selector fija la nueva área, actualiza el nombre mostrado y deshabilita el botón del desplegable

### Requirement: Selección manual cuando hay varias áreas destino
Cuando el catálogo de áreas destino contiene más de una área, el sistema SHALL mantener habilitado el botón del desplegable y permitir buscar, consultar el historial y elegir el destino.

#### Scenario: Varias áreas destino
- **WHEN** el formulario de alta o de reenvío se muestra con más de una área destino en el catálogo
- **THEN** el botón del desplegable está habilitado y el usuario puede buscar y seleccionar el destino

#### Scenario: Catálogo en carga
- **WHEN** el catálogo de áreas destino aún no ha terminado de cargar
- **THEN** el botón del desplegable permanece habilitado y el menú muestra el indicador de carga
