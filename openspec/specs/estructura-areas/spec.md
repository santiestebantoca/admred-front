# Estructura de Áreas Specification

## Purpose
Define la jerarquía de áreas, las reglas de asignación de área padre y las restricciones de integridad para crear, editar y eliminar áreas.

## Requirements

### Requirement: Jerarquía de áreas
El sistema SHALL organizar las áreas por niveles y área padre. Los niveles 1, 4 y 6 SHALL ser raíz y no tener padre; el nivel 2 SHALL tener como padre el área 1. Los niveles 3 y 7 SHALL colgar del nivel inmediato superior (2 y 6). El nivel 5 SHALL poder colgar de un área de nivel 4 o de otra de nivel 5, y SHALL poder tener hijas de su mismo nivel.

#### Scenario: Área de nivel 1
- **WHEN** se guarda un área con nivel 1
- **THEN** el sistema guarda `padre` en NULL

#### Scenario: Área de nivel 4
- **WHEN** se guarda un área con nivel 4
- **THEN** el sistema guarda `padre` en NULL

#### Scenario: Área de nivel 6
- **WHEN** se guarda un área con nivel 6
- **THEN** el sistema guarda `padre` en NULL

#### Scenario: Área de nivel 2
- **WHEN** se guarda un área con nivel 2
- **THEN** el sistema guarda `padre` con el área 1

#### Scenario: Área de nivel 5 bajo un área de nivel 4
- **WHEN** se guarda un área de nivel 5 con un padre de nivel 4
- **THEN** el sistema conserva ese padre

#### Scenario: Área de nivel 5 bajo un área de nivel 5
- **WHEN** se guarda un área de nivel 5 con un padre de nivel 5
- **THEN** el sistema conserva ese padre

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

### Requirement: Modos de visualización de áreas
La administración de áreas SHALL ofrecer un modo Lista y un modo Navegar. El modo Lista SHALL conservar la lista paginada con sus filtros. El modo Navegar SHALL reemplazar la lista y el filtro por la navegación jerárquica.

#### Scenario: Modo Lista
- **WHEN** el usuario elige el modo Lista
- **THEN** se muestra la lista paginada de áreas con sus filtros

#### Scenario: Modo Navegar
- **WHEN** el usuario elige el modo Navegar
- **THEN** se muestra la raíz de la navegación y no se muestra el filtro de la lista

### Requirement: Navegación por niveles y áreas
En modo Navegar, la raíz SHALL ser los niveles 1, 4 y 6. Al elegir un nivel SHALL listarse todas las áreas de ese nivel. Al entrar en un área SHALL listarse sus áreas hijas, sin paginar. La primera fila SHALL permitir volver al nivel superior.

#### Scenario: Raíz de la navegación
- **WHEN** el usuario entra al modo Navegar
- **THEN** se muestran los niveles 1, 4 y 6 como entradas de la raíz

#### Scenario: Lista de un nivel
- **WHEN** el usuario elige un nivel de la raíz
- **THEN** se muestran las áreas cuyo nivel coincide con el elegido

#### Scenario: Áreas hijas
- **WHEN** el usuario entra en un área
- **THEN** se muestran las áreas cuyo padre es esa área

#### Scenario: Volver al nivel superior
- **WHEN** el usuario elige la primera fila «ir al nivel superior»
- **THEN** se muestra la lista anterior de la navegación

### Requirement: Acciones sobre las filas en modo navegar
En modo Navegar, un clic en la fila SHALL abrir el detalle del área. Un clic en el icono de carpeta SHALL entrar en sus áreas hijas. La carpeta SHALL mostrarse solo si el área tiene al menos un área hija.

#### Scenario: Abrir el detalle
- **WHEN** el usuario hace clic en la fila de un área
- **THEN** se abre el detalle de esa área

#### Scenario: Entrar en las áreas hijas
- **WHEN** el usuario hace clic en el icono de carpeta de un área
- **THEN** se listan las áreas hijas de esa área y no se abre el detalle

#### Scenario: Área sin hijas
- **WHEN** un área no tiene áreas hijas
- **THEN** no se muestra el icono de carpeta en su fila

### Requirement: Alta contextual de áreas
Al crear un área desde la lista de un nivel, el formulario SHALL proponer `nivel` igual al nivel mostrado y `padre` en NULL. Al crear desde las hijas de un área X, SHALL proponer `padre = X` y `nivel` igual al nivel de las hijas. Para un área de nivel 5, el nivel propuesto SHALL ser 5.

#### Scenario: Alta desde un nivel
- **WHEN** el usuario crea un área desde la lista del nivel 4
- **THEN** el formulario propone `nivel = 4` y `padre = null`

#### Scenario: Alta desde un área
- **WHEN** el usuario crea un área desde las hijas de un área X
- **THEN** el formulario propone `padre = X` y el nivel correspondiente a sus hijas

#### Scenario: Alta desde un área de nivel 5
- **WHEN** el usuario crea un área desde las hijas de un área de nivel 5
- **THEN** el formulario propone `nivel = 5` y `padre = X`

### Requirement: Opciones de área padre para el nivel 5
Cuando el nivel seleccionado sea 5, el selector de área padre SHALL ofrecer áreas de nivel 4 y de nivel 5. La misma regla SHALL aplicarse al filtro por padre del modo Lista.

#### Scenario: Crear o editar un área de nivel 5
- **WHEN** el usuario selecciona el nivel 5 en el formulario de área
- **THEN** el selector de padre ofrece áreas de nivel 4 y de nivel 5

#### Scenario: Filtrar áreas de nivel 5 por padre
- **WHEN** el usuario selecciona el nivel 5 en el filtro del modo Lista
- **THEN** el filtro de padre ofrece áreas de nivel 4 y de nivel 5

### Requirement: Identificadores de jerarquía en el listado de áreas
`GET /areas/areas` SHALL devolver `padre_id` y `nivel_id` en cada fila para que la navegación identifique la jerarquía sin depender de los nombres.

#### Scenario: Fila con padre
- **WHEN** se consulta el listado de áreas
- **THEN** cada fila incluye `padre_id` y `nivel_id`

#### Scenario: Área raíz
- **WHEN** el área no tiene padre
- **THEN** su `padre_id` es `null`
