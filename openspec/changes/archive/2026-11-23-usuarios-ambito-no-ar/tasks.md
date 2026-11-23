# Tasks

## 1. Verificaciones previas

- [x] 1.1 Confirmar en el backend que `vw_usuario.area` devuelve el nombre del área y `vw_usuario.area_id` el id; verificar con una consulta que ambos coinciden con la tabla `area`.
- [x] 1.2 Revisar los usuarios sin área existentes y su `created_by`; verificar cuáles quedarían dentro del ámbito de un administrador no AR y documentar el resultado antes de desplegar.
- [x] 1.3 Registrar el comportamiento actual con un administrador no AR (listado, detalle, alta y edición) para comparar después; verificar con el entorno local que la lista solo muestra su área y que el detalle ajeno es accesible hoy.

## 2. Backend: ámbito de lectura

- [x] 2.1 Añadir en `controllers/usuarios.py` el helper `_ids_subarbol(area_id)` y el predicado de ámbito del no AR (subárbol o usuario sin área creado por él); verificar con un administrador no AR que el conjunto incluye su área y sus descendientes, y excluye el resto.
- [x] 2.2 Acotar `GET /usuarios/usuarios` con el predicado, manteniendo los filtros `area`, `rol`, `estado`, `search`, `page` y `limit`; verificar que aparecen los usuarios de áreas hijas, que no aparecen los ajenos y que AR conserva el listado completo.
- [x] 2.3 Acotar `GET /usuarios/usuarios/:id` y responder 403 fuera del ámbito; verificar el detalle de un usuario del subárbol, el de un usuario ajeno y el de un usuario sin área creado por el administrador.

## 3. Backend: alta, edición y borrado

- [x] 3.1 Implementar el alta del no AR: área del cuerpo o área propia, validación en el subárbol y 403 fuera; verificar un alta sin área (usa la propia), un alta en un área hija y un alta con área ajena (403).
- [x] 3.2 Implementar la edición del no AR: comprobar el ámbito del usuario, validar un área del subárbol, conservar el área del propio usuario y responder 403 fuera; verificar el cambio de área dentro del ámbito, el intento de mover a un área ajena y el cambio sobre el propio usuario.
- [x] 3.3 Implementar el borrado del no AR: comprobar el ámbito, bloquear el propio usuario y conservar la integridad; verificar el borrado de un usuario del subárbol, el 403 del propio usuario, el 403 de un usuario ajeno y el 405 de un usuario con actividad.
- [x] 3.4 Ajustar `permisos.eliminar` del detalle para que sea falso en el propio usuario y añadir `permisos.editar_username` para no depender del permiso de borrado; verificar el detalle propio, el de un usuario del subárbol y el de un usuario con actividad.
- [x] 3.5 Verificar que el administrador AR conserva listado completo, detalle, alta, edición y borrado sin cambios; probar al menos un alta y una edición con un AR.

## 4. Backend: área en el listado

- [x] 4.1 Añadir `db.vw_usuario.area` y `db.vw_usuario.area_id` a la proyección de `GET /usuarios/usuarios`; verificar que cada fila incluye ambos campos y que el total y la paginación no cambian.

## 5. Frontend: tipos, listado y filtro

- [x] 5.1 Ampliar `UsuarioListaItem` en `src/types/api.ts` con `area` y `area_id`; verificar con `npm run typecheck` que los consumidores siguen compilando.
- [x] 5.2 Añadir la columna «Área» a `src/components/features/admin/usuarios/ListaGrid.vue`; verificar con un administrador no AR que se ve el área de cada usuario y que la tabla sigue paginando.
- [x] 5.3 Mostrar el filtro de área en `src/components/features/admin/usuarios/ListaFiltro.vue` para todo administrador y comprobar que las opciones de un no AR se limitan a su subárbol; verificar una búsqueda por área hija y una por área ajena sin resultados.

## 6. Frontend: formularios y detalle

- [x] 6.1 Adaptar `src/views/admin/usuarios/crear.vue`: mostrar el selector de área al no AR, proponer su área por defecto y mantener las opciones acotadas; verificar un alta en el área propia y otra en un área hija.
- [x] 6.2 Adaptar `src/views/admin/usuarios/[id]/editar.vue`: mostrar el selector de área al no AR, usar `usuario.area?.id ?? null` para usuarios sin área, deshabilitar el selector para el propio usuario y usar `permisos.editar_username` para el campo de username; verificar un cambio de área dentro del ámbito, que el área propia no cambia y que el username sigue editable sin actividad.
- [x] 6.3 Ajustar `src/views/admin/usuarios/[id]/index.vue` para que «Eliminar» dependa de `permisos.eliminar`; verificar que el propio usuario no muestra la acción y que un usuario del subárbol sí.
- [x] 6.4 Revisar los flujos modificados para no duplicar el toast global de 403 y mantener `BotonEnvio` e `IndicadorCarga`; verificar que las acciones ocultas no generan errores visibles.

## 7. Documentación

- [x] 7.1 Actualizar `specs/_baseline/administracion.md` (alcance de usuarios, listado, detalle, alta, edición, borrado y UI del área); verificar que coincide con el delta de `gestion-usuarios`.
- [x] 7.2 Revisar `project-context.md` y `specs/_baseline/README.md` para que no quede una descripción que reduzca el ámbito de usuarios al área propia; verificar que el texto sigue siendo coherente con el backend.
- [x] 7.3 Revisar el delta de `gestion-usuarios` y ejecutar `openspec.cmd validate --all --strict`; verificar que termina sin errores ni advertencias.

## 8. Verificación de integración

- [x] 8.1 Ejecutar `npm run lint` y `npm run typecheck`; verificar 0 errores.
- [x] 8.2 Ejecutar `npm run build_admred`; verificar que compila con la base de publicación y que las rutas de assets siguen siendo correctas.
- [x] 8.3 Probar en el entorno de destino con un administrador no AR: listado de áreas hijas, alta de un usuario en un área hija, edición de área dentro del ámbito, cambio de área del propio usuario, borrado de un usuario del subárbol, 403 fuera del ámbito, 403 sobre el propio usuario y 405 por integridad.
- [x] 8.4 Probar con un administrador AR que el listado completo, la columna de área, el alta, la edición y el borrado siguen funcionando; verificar que no hay regresiones.
- [x] 8.5 Ejecutar `openspec.cmd validate --all --strict` y `openspec.cmd status --change usuarios-ambito-no-ar`; verificar que todos los artefactos están completos.

## Workflow follow-up

- Archivar el cambio cuando la implementación esté desplegada y revisada.
- Verificar el resultado archivado en `openspec/specs/gestion-usuarios/spec.md`.
