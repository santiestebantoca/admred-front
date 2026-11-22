# Tasks

## 1. Deshabilitar el desplegable con una única área destino

- [x] 1.1 Enlazar la prop `disabled` del desplegable del selector de destino a la existencia de una opción única (`Boolean(singleOption)`) y verificar con `npm run typecheck` que el componente compila y que, con una sola área, el botón se renderiza deshabilitado y no abre el menú
- [x] 1.2 Verificar en el formulario de alta y en el de reenvío que con cero o varias áreas destino el botón sigue habilitado y que la búsqueda y el historial siguen funcionando (la prop solo se activa cuando `singleOption` deja de ser `null`; el resto del flujo no cambia)
- [x] 1.3 Confirmar que el delta de `solicitudes` describe el comportamiento implementado (autoselección, campo de solo lectura y desplegable deshabilitado) ejecutando `openspec validate --all --strict` sin errores

## 2. Verificación final

- [x] 2.1 Ejecutar `npm run lint` sin errores
- [x] 2.2 Ejecutar `npm run typecheck` sin errores

## Workflow follow-up

- Archivar el cambio para fusionar el delta en `openspec/specs/solicitudes/spec.md`.
- Confirmar que la spec base resultante conserva el requisito de selección del área destino.
