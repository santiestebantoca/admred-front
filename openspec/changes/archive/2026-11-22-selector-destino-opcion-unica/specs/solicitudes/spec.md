# Spec Delta

## ADDED Requirements

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
