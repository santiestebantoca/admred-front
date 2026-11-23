# Tasks

## 1. Verificaciones previas

- [x] 1.1 Confirmar en el backend que `db.areas.id` (vista) y `db.area.id` (tabla) identifican la misma área; verificar con una consulta que devuelva el mismo conjunto de ids y nombres.
- [x] 1.2 Confirmar en datos que no existe un administrador no AR en el área 1 (o documentar el resultado para decidir antes del despliegue); verificar listando los usuarios con membresía `administrador` y `area = 1` y revisando el `rol_key` del área.
- [x] 1.3 Confirmar que los niveles 3 y 7 no tienen nivel hijo en `db.nivel`; verificar que `nivelHijo()` devuelve vacío para ambos y que el recorrido del subárbol no encuentra ciclos.

## 2. Backend: ámbito y autorización de áreas

- [x] 2.1 Añadir en `controllers/areas.py` un helper que determine si el usuario es administrador no AR y otro que devuelva el conjunto de ids del subárbol de `auth.user.area` (incluida el área propia, con conjunto de visitados); verificar con un usuario no AR que el conjunto contiene su área y sus descendientes y excluye el resto.
- [x] 2.2 Acotar `GET /areas/areas` y `GET /areas/areas/:id` al subárbol cuando el usuario sea administrador no AR, comprobando `auth.user` antes de leer el área; verificar que la lista solo devuelve el subárbol, que el detalle ajeno responde 403 y que un administrador AR no cambia de comportamiento.
- [x] 2.3 Añadir `permisos.editar` al detalle del área y ajustar `permisos.eliminar` para el área propia; verificar AR (`editar = true`), no AR hija (`editar = true`) y no AR propia (`editar = false`, `eliminar = false`).
- [x] 2.4 Sustituir `Validate.auth_from_AR` en `areas.py` por el validador de ámbito en `POST`, `PUT` y `DELETE`, sin tocar las clases `Validate` de `tipos.py` ni `reportes.py`; verificar que AR conserva el comportamiento y que el no AR fuera del subárbol recibe 403.
- [x] 2.5 Implementar el alta del no AR: padre del cuerpo o área propia, validación de ámbito, nivel derivado (5 para nivel 5; `nivel.padre_id` para el resto) y rechazo 422 para padres de nivel 3 o 7; verificar altas 4→5, 5→5, 6→7 y 1→2, y los errores de padre ajeno (403) y sin nivel hijo (422).
- [x] 2.6 Implementar la edición del no AR descartando `padre` y `nivel` y bloqueando el área propia y las áreas ajenas; verificar que un envío con otro padre u otro nivel deja los valores originales y que propia/ajena responden 403.
- [x] 2.7 Implementar el borrado del no AR bloqueando el área propia y las áreas ajenas, y conservando la regla de integridad; verificar el borrado de una hija sin referencias, el 403 de la propia/ajena y el 405 de un área referenciada.

## 3. Frontend: stores y navegación

- [x] 3.1 Crear `useAreaPropiaQuery()` en `src/stores/areas/` sobre `useAreasQuery({})` y exportarlo en el barrel; verificar con `npm run typecheck` que los tipos cuadran y que la consulta no genera una petición adicional cuando el navegador ya cargó el listado.
- [x] 3.2 Adaptar `useAreasNavegacion()` con `esAR`, la raíz de una fila con el área propia, `contextoCrear` sin `nivel` para el no AR, `entrarNivel` inactivo y `puedeCrear`; verificar con un área de nivel 5 que la raíz muestra su área, la carpeta entra en las hijas y el alta propone el padre correcto.
- [x] 3.3 Actualizar `src/composables/useNavigation.ts` para ofrecer «Áreas» a todo administrador y mantener «Tipos» bajo `AR`; verificar que un administrador no AR ve la opción y que un usuario sin membresía no ve la administración.
- [x] 3.4 Añadir `PermisosArea { editar, eliminar }` en `src/types/models.ts` y usarlo en `AreaDetalle`; verificar con `npm run typecheck` que ningún consumidor queda roto.

## 4. Frontend: vistas y componentes

- [x] 4.1 Adaptar `src/views/admin/areas/crear.vue`: para el no AR, ocultar los selectores de nivel y padre, mostrar el área de contexto y usar `props.padreInicial ?? authUser.area` como padre; verificar el alta desde la lista (área propia) y desde la navegación (nodo actual) con `npm run dev`.
- [x] 4.2 Adaptar `src/views/admin/areas/[id]/editar.vue`: para el no AR, dejar solo el nombre editable y mostrar nivel y padre como texto; verificar que un intento de cambiar el padre o el nivel no altera el área.
- [x] 4.3 Adaptar `src/views/admin/areas/[id]/index.vue` para mostrar «Editar» según `permisos.editar`; verificar que el área propia no muestra editar ni eliminar y que una hija del subárbol sí.
- [x] 4.4 Añadir `mostrarRolKey` a `src/components/features/admin/areas/ListaFiltro.vue`, pasarlo desde `ListaGrid.vue` con `authUser.AR` y ocultar «Agregar» cuando `puedeCrear` sea falso; verificar la lista con un no AR (sin filtro de rol) y con un área de nivel 3 o 7 (sin alta).
- [x] 4.5 Revisar los flujos modificados para no duplicar el toast global de 403 y mantener `BotonEnvio` e `IndicadorCarga` en los formularios y listas; verificar que las acciones ocultas no generan errores visibles.

## 5. Documentación

- [x] 5.1 Actualizar `specs/_baseline/administracion.md` (acceso y alcance, sección de áreas: autorización, listado, detalle, alta, edición, borrado y navegación); verificar que el texto coincide con el delta de `estructura-areas`.
- [x] 5.2 Actualizar `specs/_baseline/README.md` y `project-context.md` para distinguir el alcance de áreas (AR global, no AR su subárbol) del de tipos y reportes; verificar que no queda la frase que reduce la administración de áreas a AR.
- [x] 5.3 Revisar el delta de `estructura-areas` y ejecutar `openspec.cmd validate --all --strict`; verificar que termina sin errores ni advertencias.

## 6. Verificación de integración

- [x] 6.1 Ejecutar `npm run lint` y `npm run typecheck`; verificar 0 errores.
- [x] 6.2 Ejecutar `npm run build_admred`; verificar que compila con la base de publicación y que las rutas de assets siguen siendo correctas.
- [x] 6.3 Probar en el entorno de destino con un administrador AR (sin regresiones en listado, detalle, alta, edición y borrado) y con un administrador no AR (lista acotada, raíz en su área, alta/edición/borrado dentro del subárbol, 403 fuera y 403 sobre su propia área).
- [x] 6.4 Ejecutar `openspec.cmd validate --all --strict` y `openspec.cmd status --change administracion-areas-no-ar`; verificar que todos los artefactos están completos.

## Workflow follow-up

- Archivar el cambio cuando la implementación esté desplegada y revisada.
- Verificar el resultado archivado en `openspec/specs/estructura-areas/spec.md`.
