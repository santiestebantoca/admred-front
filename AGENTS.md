# AGENTS.md

## Idioma

- Responder **siempre en español**, en todas las respuestas y en cualquier sesión.
- El código, los nombres de archivos, los identificadores y los mensajes de commit se mantienen en el idioma en que ya esté el proyecto; esta preferencia aplica a la comunicación con el usuario.

## Contexto del sistema

Este repositorio es el **frontend** (Vue 3 + Vite) de `admred`.
El **backend** es la aplicación web2py `admred`, en `D:\proyectos\web2py\applications\admred`
(models, controllers y vistas web2py). Ambos forman un mismo sistema: al cambiar un
contrato de API conviene revisar los dos lados.

Correspondencia habitual entre capas:

- `src/views/admin/<recurso>/` ↔ `controllers/admin_<recurso>.py`
- `src/stores/` ↔ controladores REST y modelos (`models/db.py`)
