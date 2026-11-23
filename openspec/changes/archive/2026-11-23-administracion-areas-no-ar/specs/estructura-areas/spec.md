# Spec Delta

## MODIFIED Requirements

### Requirement: Autorización de escritura de áreas
El sistema SHALL permitir crear, editar y eliminar áreas a usuarios con membresía de administrador. Un administrador AR SHALL operar sobre cualquier área. Un administrador no AR SHALL operar solo dentro del subárbol de su propia área, con su área en solo lectura.

#### Scenario: Administrador AR
- **WHEN** un administrador de un área AR guarda un área
- **THEN** el sistema valida y persiste los cambios

#### Scenario: Administrador no AR
- **WHEN** un administrador de un área no AR guarda un área de su subárbol
- **THEN** el sistema valida y persiste los cambios

#### Scenario: Administrador no AR fuera del subárbol
- **WHEN** un administrador de un área no AR intenta guardar un área fuera de su subárbol
- **THEN** el backend rechaza la operación con error de autorización

#### Scenario: Administrador no AR sobre su propia área
- **WHEN** un administrador de un área no AR intenta editar o eliminar su propia área
- **THEN** el backend rechaza la operación con error de autorización

### Requirement: Navegación por niveles y áreas
En modo Navegar, la raíz SHALL depender del administrador: los niveles 1, 4 y 6 para un administrador AR, y una fila única con su propia área para uno no AR. Al elegir un nivel SHALL listarse las áreas de ese nivel. Al entrar en un área SHALL listarse sus áreas hijas, sin paginar. La primera fila SHALL permitir volver al nivel superior.

#### Scenario: Raíz de la navegación
- **WHEN** un administrador AR entra al modo Navegar
- **THEN** se muestran los niveles 1, 4 y 6 como entradas de la raíz

#### Scenario: Raíz del administrador no AR
- **WHEN** un administrador no AR entra al modo Navegar
- **THEN** se muestra una fila única con su propia área

#### Scenario: Lista de un nivel
- **WHEN** el usuario elige un nivel de la raíz
- **THEN** se muestran las áreas cuyo nivel coincide con el elegido

#### Scenario: Áreas hijas
- **WHEN** el usuario entra en un área
- **THEN** se muestran las áreas cuyo padre es esa área

#### Scenario: Áreas hijas del administrador no AR
- **WHEN** un administrador no AR entra en su propia área
- **THEN** se muestran sus áreas hijas y la primera fila vuelve a la fila del área propia

#### Scenario: Volver al nivel superior
- **WHEN** el usuario elige la primera fila «ir al nivel superior»
- **THEN** se muestra la lista anterior de la navegación

## ADDED Requirements

### Requirement: Ámbito de lectura de áreas
`GET /areas/areas` y `GET /areas/areas/:id` SHALL devolver al administrador no AR solo las áreas de su subárbol, incluida su propia área. Un administrador AR y el resto de usuarios conservan la lectura actual.

#### Scenario: Listado del administrador no AR
- **WHEN** un administrador no AR consulta el listado de áreas
- **THEN** el resultado incluye su propia área y sus descendientes, y ninguna otra

#### Scenario: Detalle fuera del subárbol
- **WHEN** un administrador no AR consulta el detalle de un área que no está en su subárbol
- **THEN** el backend rechaza la operación con error de autorización

#### Scenario: Lectura del administrador AR
- **WHEN** un administrador AR consulta el listado o un detalle
- **THEN** el resultado no se acota por subárbol

### Requirement: Alta de área por administrador no AR
Al crear un área, el sistema SHALL aceptar un `padre` del subárbol del administrador no AR y, si falta, SHALL usar su propia área. El `nivel` SHALL derivarse del padre: nivel 5 para una hija de nivel 5 y el nivel hijo del catálogo para el resto. Un padre sin nivel hijo SHALL rechazarse.

#### Scenario: Alta sin padre explícito
- **WHEN** un administrador no AR crea un área sin indicar padre
- **THEN** el sistema usa su propia área como padre y deriva el nivel

#### Scenario: Alta bajo un área del subárbol
- **WHEN** un administrador no AR crea un área bajo otra área de su subárbol
- **THEN** el sistema usa esa área como padre y deriva el nivel

#### Scenario: Alta bajo un área de nivel 5
- **WHEN** un administrador no AR crea un área bajo un área de nivel 5
- **THEN** el nivel resultante es 5

#### Scenario: Padre fuera del subárbol
- **WHEN** un administrador no AR indica un padre fuera de su subárbol
- **THEN** el backend rechaza la operación con error de autorización

#### Scenario: Padre sin nivel hijo
- **WHEN** un administrador no AR indica un padre de nivel 3 o 7
- **THEN** el backend rechaza la operación por no existir un nivel válido para la hija

#### Scenario: Formulario de alta del administrador no AR
- **WHEN** un administrador no AR abre el formulario de alta
- **THEN** no se ofrecen los selectores de nivel ni de padre y se muestra el área de contexto

#### Scenario: Alta con rol o estado manipulados
- **WHEN** un administrador no AR envía `rol_key` o `is_active` al crear un área
- **THEN** el sistema los ignora y el área se crea sin rol y activa

### Requirement: Edición de área por administrador no AR
El sistema SHALL permitir al administrador no AR cambiar solo el `nombre` de las áreas de su subárbol. Los valores de `padre` y `nivel` enviados SHALL ignorarse. Su propia área y las áreas fuera del subárbol SHALL rechazarse.

#### Scenario: Cambio de nombre
- **WHEN** un administrador no AR guarda un nuevo nombre para un área de su subárbol
- **THEN** el sistema actualiza el nombre y conserva padre y nivel

#### Scenario: Intento de cambiar padre o nivel
- **WHEN** un administrador no AR envía un padre o un nivel distintos
- **THEN** el sistema ignora esos valores y conserva los actuales

#### Scenario: Edición de su propia área
- **WHEN** un administrador no AR intenta editar su propia área
- **THEN** el backend rechaza la operación con error de autorización

#### Scenario: Edición fuera del subárbol
- **WHEN** un administrador no AR intenta editar un área fuera de su subárbol
- **THEN** el backend rechaza la operación con error de autorización

#### Scenario: Formulario de edición del administrador no AR
- **WHEN** un administrador no AR abre la edición de un área de su subárbol
- **THEN** el nombre es editable y el nivel y el padre se muestran como solo lectura

#### Scenario: Edición con rol o estado manipulados
- **WHEN** un administrador no AR envía `rol_key` o `is_active` al editar un área
- **THEN** el sistema conserva el rol y el estado actuales

### Requirement: Borrado de área por administrador no AR
El sistema SHALL permitir al administrador no AR borrar áreas de su subárbol, nunca su propia área, manteniendo las reglas de integridad del borrado.

#### Scenario: Borrado de un área del subárbol
- **WHEN** un administrador no AR confirma el borrado de un área de su subárbol sin referencias
- **THEN** el sistema elimina el área

#### Scenario: Borrado de su propia área
- **WHEN** un administrador no AR intenta borrar su propia área
- **THEN** el backend rechaza la operación con error de autorización

#### Scenario: Borrado de un área referenciada
- **WHEN** el área tiene hijas, usuarios o solicitudes
- **THEN** el sistema rechaza el borrado con un error de integridad

#### Scenario: Borrado fuera del subárbol
- **WHEN** un administrador no AR intenta borrar un área fuera de su subárbol
- **THEN** el backend rechaza la operación con error de autorización

### Requirement: Permiso de edición en el detalle del área
`GET /areas/areas/:id` SHALL devolver `permisos.editar`. SHALL ser verdadero para un administrador AR y para las áreas del subárbol de un no AR distintas de la propia, y falso para el área propia del no AR.

#### Scenario: Detalle con administrador AR
- **WHEN** un administrador AR consulta el detalle de un área
- **THEN** `permisos.editar` es verdadero

#### Scenario: Detalle de un área del subárbol
- **WHEN** un administrador no AR consulta el detalle de un área de su subárbol distinta de la propia
- **THEN** `permisos.editar` es verdadero

#### Scenario: Detalle de su propia área
- **WHEN** un administrador no AR consulta el detalle de su propia área
- **THEN** `permisos.editar` es falso y `permisos.eliminar` también

### Requirement: Interfaz de administración de áreas para el administrador no AR
La administración SHALL ofrecer «Áreas» a todo usuario con membresía de administrador. Para el administrador no AR, la lista SHALL estar acotada a su subárbol, el filtro de rol no SHALL mostrarse y la acción de alta solo SHALL ofrecerse cuando el área de contexto admite un nivel hijo.

#### Scenario: Menú de administración del no AR
- **WHEN** un administrador no AR entra a la administración
- **THEN** se ofrece la opción «Áreas»

#### Scenario: Filtro de rol
- **WHEN** un administrador no AR abre la lista de áreas
- **THEN** no se muestra el filtro de rol

#### Scenario: Alta sin nivel hijo
- **WHEN** el área de contexto no admite un nivel hijo
- **THEN** no se ofrece la acción de alta
