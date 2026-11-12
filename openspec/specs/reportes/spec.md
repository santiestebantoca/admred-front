# Reportes Specification

## Purpose
Define los reportes operativos y globales del sistema, sus filtros, restricciones de acceso, cálculos de demora y reglas de exportación.

## Requirements

### Requirement: Control de acceso a reportes
El sistema SHALL permitir los reportes de pendientes, indicadores por persona y búsqueda por código a cualquier usuario autenticado. Los reportes de áreas consultadas, solicitudes externas, internas y crudas SHALL requerir que el área del usuario tenga rol AR.

#### Scenario: Usuario con área AR
- **WHEN** un usuario de un área AR abre un reporte global
- **THEN** el sistema devuelve los datos solicitados

#### Scenario: Usuario sin área AR
- **WHEN** un usuario de un área sin rol AR intenta abrir un reporte global
- **THEN** el backend rechaza la operación con error de autorización

#### Scenario: Reporte operativo
- **WHEN** un usuario autenticado consulta sus pendientes
- **THEN** el sistema devuelve únicamente la información que le corresponde por área o usuario

### Requirement: Pendientes del área
El sistema SHALL devolver los pendientes como árboles de reenvíos, excluyendo las solicitudes terminadas. Para supervisores SHALL usar el área origen; para el resto, el remitente.

#### Scenario: Pendientes de un supervisor
- **WHEN** un supervisor consulta los pendientes del área
- **THEN** el sistema incluye las solicitudes no terminadas con origen en su área y sus descendientes

#### Scenario: Pendientes de un usuario
- **WHEN** un usuario sin rol de supervisor consulta los pendientes
- **THEN** el sistema incluye las solicitudes no terminadas de las que es remitente

#### Scenario: Solicitud terminada
- **WHEN** una solicitud está en estado 4
- **THEN** no aparece en el reporte de pendientes

### Requirement: Indicadores por persona
El sistema SHALL devolver las solicitudes de un usuario por mes y año, incluyendo las terminadas en el periodo y las pendientes solicitadas en o antes del periodo. Cada fila SHALL indicar si el usuario actuó como supervisor o tramitador.

#### Scenario: Actividad como supervisor
- **WHEN** el usuario supervisó solicitudes en el periodo
- **THEN** el reporte devuelve esas filas con `supervisor` verdadero

#### Scenario: Actividad como tramitador
- **WHEN** el usuario tramitó solicitudes en el periodo
- **THEN** el reporte devuelve esas filas con `tramitador` verdadero y las fechas de sus hijas

#### Scenario: Periodo sin actividad
- **WHEN** el usuario no tiene solicitudes en el periodo
- **THEN** el reporte devuelve una lista vacía

### Requirement: Cálculo de demoras laborables
El sistema SHALL calcular las demoras en minutos laborables, de lunes a viernes, de 8:00 a 12:00 y de 12:30 a 17:30, con cierre a las 16:30 los viernes. La presentación SHALL convertir los minutos a días y horas laborables.

#### Scenario: Demora de asignación
- **WHEN** se calcula la demora entre la solicitud y la asignación
- **THEN** solo se cuentan los minutos dentro de la jornada laboral

#### Scenario: Fin de semana
- **WHEN** el intervalo incluye sábado o domingo
- **THEN** esos días no aportan minutos a la demora

#### Scenario: Conversión a días y horas
- **WHEN** la demora supera una jornada laboral de 528 minutos
- **THEN** la presentación muestra los días y las horas laborables equivalentes

### Requirement: Búsqueda por código
El sistema SHALL buscar solicitudes por coincidencia parcial de código y devolver como máximo diez resultados con el nombre del área origen y destino.

#### Scenario: Coincidencia parcial
- **WHEN** el usuario introduce parte de un código
- **THEN** el sistema devuelve hasta diez solicitudes que contienen ese texto

#### Scenario: Sin coincidencias
- **WHEN** ningún código contiene el texto buscado
- **THEN** el sistema devuelve una lista vacía

### Requirement: Áreas consultadas
El sistema SHALL agrupar las solicitudes por área destino y calcular presentadas, terminadas, eficacia y demora promedio. El reporte SHALL añadir una fila de subtotal con la suma de todas las áreas.

#### Scenario: Agrupación por destino
- **WHEN** se genera el reporte de áreas consultadas para un rango de fechas
- **THEN** cada fila representa un área destino con sus totales

#### Scenario: Cálculo de eficacia
- **WHEN** un área tiene solicitudes presentadas y terminadas
- **THEN** la eficacia se calcula como terminadas entre presentadas, expresada en porcentaje con un decimal

#### Scenario: Subtotal
- **WHEN** el reporte tiene varias áreas
- **THEN** la última fila muestra el subtotal de presentadas, terminadas y demora promedio

### Requirement: Solicitudes internas y externas
El sistema SHALL listar solicitudes internas solo para solicitudes originales de áreas internas, excluyendo las áreas AR cuando no se indica origen. Las externas SHALL usar áreas de nivel externo y destino Dirección de Administración.

#### Scenario: Reporte interno sin origen
- **WHEN** se genera el reporte interno sin indicar área origen
- **THEN** el sistema usa las áreas internas y excluye las áreas AR

#### Scenario: Reporte interno con origen
- **WHEN** se indica un área origen
- **THEN** el sistema filtra por esa área y mantiene solo solicitudes originales

#### Scenario: Reporte externo sin origen
- **WHEN** se genera el reporte externo sin indicar área origen
- **THEN** el sistema usa las áreas cuyo nivel tiene alcance externo y destino la Dirección de Administración

### Requirement: Reporte crudo de solicitudes
El sistema SHALL generar un reporte crudo por rango de fechas y área destino, incluyendo los datos de la solicitud y de su hija, para el análisis de efectividad.

#### Scenario: Reporte crudo válido
- **WHEN** un usuario AR indica rango de fechas y área destino
- **THEN** el sistema devuelve las solicitudes y sus hijas ordenadas por código

#### Scenario: Falta el área destino
- **WHEN** no se indica área destino
- **THEN** el sistema no genera el reporte

### Requirement: Rangos de fechas y exportación
El sistema SHALL interpretar el rango de fechas como inclusivo, incluyendo el día final completo. La exportación SHALL generar un CSV con los valores mostrados en el reporte.

#### Scenario: Día final incluido
- **WHEN** el rango termina el 31 de un mes
- **THEN** se incluyen las solicitudes con fecha y hora de ese día

#### Scenario: Exportación CSV
- **WHEN** el usuario exporta un reporte con resultados
- **THEN** el sistema descarga un CSV con las mismas columnas y valores visibles
