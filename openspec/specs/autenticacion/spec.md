# Autenticación Specification

## Purpose
Define la sesión por cookie, el inicio y cierre de sesión, la personificación, los roles disponibles y la protección de rutas privadas.

## Requirements

### Requirement: Sesión por cookie
El sistema SHALL mantener la sesión mediante cookie y SHALL consultar el usuario autenticado al iniciar la aplicación. Las peticiones HTTP SHALL enviar credenciales y no SHALL usar tokens en el frontend.

#### Scenario: Sesión activa
- **WHEN** la aplicación consulta el usuario autenticado y existe una sesión válida
- **THEN** el sistema devuelve el usuario con sus roles y área

#### Scenario: Sesión ausente
- **WHEN** la aplicación consulta el usuario autenticado sin sesión
- **THEN** el sistema responde sin usuario y la aplicación redirige al login si la ruta es privada

### Requirement: Inicio de sesión
El sistema SHALL autenticar al usuario con sus credenciales y SHALL mostrar los errores de credenciales en el formulario, sin redirección ni notificación global.

#### Scenario: Credenciales válidas
- **WHEN** el usuario envía credenciales correctas
- **THEN** el sistema inicia la sesión y carga el usuario autenticado

#### Scenario: Credenciales inválidas
- **WHEN** el usuario envía credenciales incorrectas
- **THEN** el formulario muestra el error y no redirige

### Requirement: Cierre de sesión
El sistema SHALL cerrar la sesión al solicitar logout y SHALL limpiar el usuario en la caché del frontend.

#### Scenario: Logout manual
- **WHEN** el usuario ejecuta la acción de cerrar sesión
- **THEN** el sistema invalida la sesión y redirige al login

#### Scenario: Ruta de logout
- **WHEN** el usuario navega a una ruta marcada para logout
- **THEN** el sistema cierra la sesión después de completar la navegación

### Requirement: Protección de rutas privadas
El sistema SHALL proteger las rutas privadas y SHALL redirigir al login conservando la ruta solicitada cuando no haya sesión.

#### Scenario: Acceso sin sesión
- **WHEN** un usuario sin sesión intenta abrir una ruta privada
- **THEN** el sistema redirige al login con la ruta de retorno

#### Scenario: Sesión expirada
- **WHEN** una petición distinta del login devuelve no autorizado
- **THEN** el sistema redirige al login con la ruta actual como retorno

### Requirement: Personificación
El sistema SHALL ofrecer la personificación solo cuando el usuario tenga habilitado `can_impersonate`. El backend SHALL validar además que el usuario objetivo esté permitido.

#### Scenario: Usuario habilitado
- **WHEN** un usuario con `can_impersonate` selecciona una persona permitida
- **THEN** el sistema cambia la sesión al usuario personificado y lo indica en la interfaz

#### Scenario: Usuario no habilitado
- **WHEN** un usuario sin `can_impersonate` intenta personificar
- **THEN** la interfaz no ofrece la acción y el backend rechaza la petición

### Requirement: Roles y permisos de acceso
El sistema SHALL exponer los indicadores `admin`, `supervisor`, `AR` y `DAR` del usuario. `admin` SHALL habilitar la administración; `supervisor` SHALL habilitar la supervisión de su área; `AR` SHALL habilitar reportes globales y administración de áreas y tipos.

#### Scenario: Menú de administración
- **WHEN** el usuario tiene el indicador `admin`
- **THEN** la interfaz muestra la sección de administración

#### Scenario: Reportes globales
- **WHEN** el usuario tiene el indicador `AR`
- **THEN** la interfaz muestra los reportes globales y el backend los autoriza

#### Scenario: Supervisor de área
- **WHEN** el usuario tiene el indicador `supervisor`
- **THEN** las solicitudes de su área se rigen por las reglas de bandeja y permisos de supervisor
