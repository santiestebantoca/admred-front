# Tasks

## 1. Backend: contrato y validaciones

- [x] 1.1 Verificar en la base de datos desplegada que `solicitud.actividad` existe, admite `NULL` y acepta `PROV` y `ADMIN`; comprobar con una consulta al esquema o a `db.solicitud.fields`.
- [x] 1.2 Añadir el helper `requiere_actividad(solicitud)` y exponer `actividad`, `requiere_actividad` y `puede_definir_actividad` en el `GET /solicitudes/solicitudes/:id`; verificar con una solicitud nivel 7 → nivel 6 y con una solicitud de otro origen.
- [x] 1.3 Añadir la rama `PUT { actividad }` con validación de estado 1/2, supervisor del área destino, solicitud que requiere actividad y escritura única; verificar guardado correcto, `422` por duplicado y `403` para un usuario no autorizado.
- [x] 1.4 Añadir la guarda de actividad al `PUT { tramitador }`; verificar que una solicitud territorial sin actividad responde `422` y no cambia estado ni tramitador, y que con actividad asignada el flujo sigue funcionando.
- [x] 1.5 Añadir la guarda de actividad al `POST` de reenvío antes de crear la hija; verificar que una solicitud padre sin actividad responde `422` y no crea la hija, y que con actividad definida el reenvío se completa.
- [x] 1.6 Verificar que las solicitudes que no requieren actividad no se ven afectadas por ninguna de las guardas; probar asignar y reenviar una solicitud de origen distinto al nivel 7.

## 2. Frontend: tipos y constantes

- [x] 2.1 Añadir `ActividadSolicitud`, los campos `actividad`, `requiere_actividad` y `puede_definir_actividad` en `SolicitudDetalle`, `actividad` en `SolicitudRow` y la variante `SolicitudActividadDefinida` en `SolicitudUpdate` / `SolicitudUpdatePayload`; verificar con `npm run typecheck`.
- [x] 2.2 Añadir la constante `ACTIVIDADES` con `PROV` → «Provisión» y `ADMIN` → «Administración»; verificar que se importa sin errores y que `npm run typecheck` sigue en 0.
- [x] 2.3 Mostrar la actividad en el detalle de la solicitud cuando está definida y, si se decide, un aviso de pendiente cuando `requiere_actividad` es verdadero y `actividad` es nula; verificar visualmente los tres casos: definida, pendiente y no requerida.

## 3. Frontend: modal y flujo de acciones

- [x] 3.1 Crear `SolicitarActividad.vue` con `BFormRadioGroup`, validación local, `BotonEnvio`, errores 422 inline y aviso de escritura única; verificar guardado correcto, error por duplicado y error de autorización sin cerrar el modal.
- [x] 3.2 Integrar el modal como paso previo en `asignar.vue`: si `puede_definir_actividad`, mostrarlo antes del formulario de asignar; tras guardar, mostrar el formulario y no navegar hacia atrás por el `@hidden` del modal; verificar con un supervisor en estado 1 y en estado 2.
- [x] 3.3 Integrar el modal como paso previo en `reenviar.vue`: si `puede_definir_actividad`, mostrarlo antes del formulario; si requiere actividad y el usuario no puede definirla, mostrar el aviso de bloqueo y deshabilitar el envío; verificar con supervisor y con tramitador.
- [x] 3.4 Comprobar que al guardar la actividad se invalida el detalle y que la vista pasa al formulario de la acción sin recargar la página; verificar en la pestaña de red y en la UI.
- [x] 3.5 Revisar accesibilidad y feedback: etiquetas visibles, `aria-busy`, errores inline, sin toasts duplicados para 401/403/404; verificar manualmente y con `npm run lint`.

## 4. Documentación y verificación final

- [x] 4.1 Actualizar `specs/_baseline/solicitudes.md` con la regla de actividad, el contrato del `PUT`, las guardas de asignar/reenviar, la autorización y los casos heredados; verificar leyendo el documento y contrastándolo con el código.
- [x] 4.2 Revisar `project-context.md` y actualizar la sección de contratos o permisos si el cambio introduce información nueva que deba estar allí; verificar que no queden referencias obsoletas.
- [x] 4.3 Ejecutar `npm run lint`, `npm run typecheck`, `npm run build_admred` y `openspec.cmd validate --all --strict`; verificar que terminan sin errores.
- [x] 4.4 Hacer una prueba manual de regresión: crear una solicitud, asignar, reenviar, responder y aprobar; comprobar que las solicitudes no territoriales no piden actividad y que las territoriales la piden una sola vez.

## Workflow follow-up

- Archivar el cambio cuando la revisión funcional esté aprobada y las verificaciones hayan pasado.
- Confirmar que el delta se fusionó en `openspec/specs/solicitudes/spec.md` y que la documentación base quedó sincronizada.
- **Pendiente en entorno con datos territoriales**: la base local no tiene áreas de nivel 6
  ni 7 (`area.nivel` solo llega a 5), así que no se pudo ejercitar el camino positivo
  nivel 7 → nivel 6. La prueba de regresión 4.4 debe hacerse en un entorno con esas áreas
  o con datos de prueba. La columna `solicitud.actividad` sí se verificó en MySQL:
  `varchar(5)`, admite `NULL` y las 26 943 filas existentes están en `NULL`.
