# Tasks

## 1. Contrato de backend y jerarquía

- [x] 1.1 Añadir `db.areas.padre_id` y `db.areas.nivel_id` a `fds` en `GET /areas/areas`; verificar con una consulta al endpoint que cada fila incluye ambos campos.
- [x] 1.2 Incluir el nivel `'6'` en la rama raíz de `padre()` y actualizar su docstring; verificar creando o editando un área de nivel 6 y comprobando que guarda `padre = null`.
- [x] 1.3 Extender `AreaListaItem` en `src/types/api.ts` con `padre_id` y `nivel_id`; verificar con `npm run typecheck`.
- [x] 1.4 Actualizar `specs/_baseline/administracion.md` con las raíces 1, 4 y 6 y la regla del nivel 5 con hijas de nivel 5; verificar que coincide con el delta de `estructura-areas`.

## 2. Datos de navegación

- [x] 2.1 Crear el composable de navegación con `useAreasQuery({})`, `useNivelesQuery`, mapas por nivel y padre, raíz de niveles y pila de nodos; verificar con los datos actuales que la raíz muestra 1, 4 y 6 y que cada área aparece bajo su padre.
- [x] 2.2 Implementar `nivelHijo()` con el caso especial del nivel 5 y las opciones de padre para nivel 5 (niveles 4 y 5); verificar con un área de nivel 5 con padre de nivel 4 y otra con padre de nivel 5.
- [x] 2.3 Añadir una consulta reutilizable de opciones de padre para formularios y filtro; verificar que usa la caché de la consulta general y que las opciones se ordenan por nombre.

## 3. Interfaz de navegación

- [x] 3.1 Añadir el conmutador Lista/Navegar en `views/admin/areas/index.vue`, con persistencia en `sessionStorage`, y mantener montadas ambas superficies con `v-show`; verificar que al abrir y cerrar el detalle se conserva el modo y el punto de navegación.
- [x] 3.2 Crear el componente de navegación sin `BTable`: raíz de niveles, lista de áreas, miga de pan, fila «ir al nivel superior», orden alfabético, estados de carga y vacío, y fila con nombre y carpeta; verificar manualmente los flujos de raíz, nivel, área con hijas y área sin hijas.
- [x] 3.3 Separar las acciones de la fila: el nombre abre el detalle y la carpeta entra en las hijas con `@click.stop`, mostrando la carpeta solo si hay hijas; verificar que el clic en la carpeta no abre el detalle y que el teclado alcanza ambos controles.
- [x] 3.4 Cambiar `linkCrear` a función con contexto y actualizar el uso en el modo Lista; verificar que el alta desde la lista no lleva valores iniciales.
- [x] 3.5 Actualizar la sección de navegación y modos de `specs/_baseline/administracion.md`; verificar que el texto describe el comportamiento implementado.

## 4. Alta contextual y padres de nivel 5

- [x] 4.1 Añadir `nivelInicial` y `padreInicial` a los props de `admin-areas-crear` y usarlos para inicializar `crear.vue`; verificar el alta desde un nivel (`nivel = N`, `padre = null`) y desde un área (`nivel = hijo`, `padre = X`).
- [x] 4.2 Ajustar `editar.vue` para que el selector de padre de un área de nivel 5 ofrezca niveles 4 y 5; verificar que el padre actual aparece seleccionado y que se puede guardar.
- [x] 4.3 Ajustar `ListaFiltro.vue` para que al elegir nivel 5 el filtro de padre ofrezca niveles 4 y 5; verificar una búsqueda por un padre de nivel 5.
- [x] 4.4 Actualizar la sección de alta y filtro de `specs/_baseline/administracion.md`; verificar que coincide con los formularios.

## 5. Integración y verificación

- [x] 5.1 Ejecutar `npm run lint` y corregir los avisos introducidos.
- [x] 5.2 Ejecutar `npm run typecheck` y confirmar 0 errores.
- [x] 5.3 Ejecutar `npm run build` (o `build_admred`) y verificar que compila.
- [x] 5.4 Probar el flujo completo en el navegador: raíz 1/4/6, navegación 1→2→3, 4→5→5, 6→7, detalle, alta contextual y filtro de nivel 5.
- [x] 5.5 Ejecutar el diagnóstico de jerarquía en el entorno de destino y confirmar que no devuelve filas antes de desplegar; verificar también que `GET /areas/areas` devuelve `padre_id` y `nivel_id`.
- [x] 5.6 Ejecutar `openspec.cmd validate --all --strict` y confirmar que el cambio valida.

## Workflow follow-up

- Archivar el cambio después de la revisión y del despliegue acordado.
- Verificar que `openspec/specs/estructura-areas/spec.md` quedó fusionada y que `specs/_baseline/administracion.md` no quedó obsoleto.
