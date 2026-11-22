# Proposal

## Why

Cuando el catálogo de áreas destino contiene una sola opción, el selector de destino de una solicitud ya fija esa área automáticamente y deja el campo de texto en solo lectura, pero el botón del desplegable sigue activo y abre un menú sin opciones (`destinos` solo se llena cuando hay más de un área). El resultado es un control que parece ofrecer una elección que no existe y un desplegable vacío que confunde.

## What Changes

- El botón del desplegable del selector de destino SHALL quedar deshabilitado cuando el catálogo tenga exactamente una área destino, de modo que no se pueda abrir un menú sin opciones.
- El comportamiento actual se conserva cuando hay cero o más de una área: el botón sigue habilitado, el campo permite buscar y el menú muestra historial y resultados.
- Se documenta el comportamiento del selector de destino (autoselección con una única área, campo de solo lectura y desplegable deshabilitado) como requisito de la capacidad `solicitudes`.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `solicitudes`: se añade el requisito de selección del área destino, que describe la autoselección cuando existe una única área, el campo de solo lectura y el desplegable deshabilitado, además del comportamiento con varias áreas.

## Impact

- Frontend: `src/components/features/solicitudes/[id]/SeleccionarDestino.vue`; consumido por `src/views/solicitudes/crear.vue` y `src/views/solicitudes/[id]/reenviar.vue`.
- Estado de datos: `src/stores/destinos/useDestinosSelectQuery.ts` (`singleOption` contiene la única área o `null`); no se modifica.
- Backend web2py: sin cambios; no se alteran endpoints, contratos ni validaciones.
- API: sin cambios.
- Fuera de alcance: cambiar la autoselección, el historial de destinos, los demás selectores del formulario (tipo, cumplimiento, adjuntos), añadir tooltips o mensajes nuevos, y modificar la carga del catálogo de destinos.
