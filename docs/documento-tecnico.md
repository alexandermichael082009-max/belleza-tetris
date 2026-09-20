# Documento Técnico — Belleza Tetris

## 1. Introducción

**Belleza Tetris** es un proyecto integrador compuesto por una aplicación comercial para un salón
de belleza y un videojuego tipo Tetris. El backend expone una API REST por capas y el frontend es
una SPA con JavaScript moderno (ES modules). El sistema incluye agendado de citas, cálculo de
precios con ITBIS, guardado de puntuaciones, un chatbot con salida por voz y temas claro/oscuro.

## 2. Arquitectura

### 2.1 Backend (por capas)

```
Solicitud HTTP
   │
   ▼
routes (definen rutas y validaciones con express-validator)
   │
   ▼
middlewares (validate-request, error-handler, not-found)
   │
   ▼
controllers (reciben req/res, delegan en servicios, responden JSON uniforme)
   │
   ▼
services (lógica de negocio, reglas de dominio)
   │
   ▼
repositories (acceso a datos con consultas parametrizadas)
   │
   ▼
models (definición de tablas y mapeo fila → entidad)
   │
   ▼
config (conexión SQLite, variables de entorno)
```

Flujo de una petición:

1. `server.js` aplica CORS, `express.json()` y monta los routers en `/api/*`.
2. Las rutas validan el cuerpo/parámetros con `express-validator`. Si falla la validación, el
   middleware `validate-request` responde `400` con `{ success, data, message }`.
3. El controller invoca al service. Si el service lanza un `AppError` (con código HTTP propio)
   o cualquier otro error, el middleware global `error-handler` construye la respuesta.
4. Toda respuesta JSON tiene la forma uniforme `{ success, data, message }`.

### 2.2 Frontend (por módulos)

- `modules/` → controladores de vista: `router` (SPA por hash), `theme-manager`,
  `chatbot`, `speech-service`, `appointment-form`, `home-view`, `scores-view`.
- `services/` → toda la comunicación HTTP pasa por `api-client`; los servicios de dominio
  (`appointments`, `scores`, `chatbot`) exponen un método por endpoint.
- `utils/` → constantes (sin números mágicos), formateadores (moneda DOP, fechas, ITBIS) y
  validadores de cliente.
- `game/` → motor dividido en `engine` (loop, renderer, board), `entities` (pieza, jugador),
  `scenes` (menú, juego, fin de partida) e `input` (teclado + botones táctiles).

El `Router` crea escenas según la ruta (`#/home`, `#/appointments`, `#/game`, `#/scores`) y
transiciona entre ellas llamando a `mount()`/`destroy()`.

## 3. Modelo de datos

Base: **SQLite** (`backend/data/belleza-tetris.db`) con dos tablas.

### appointments

| Campo       | Tipo   | Restricciones |
| ----------- | ------ | ------------- |
| id          | INTEGER| PK, AUTOINCREMENT |
| name        | TEXT   | NOT NULL |
| email       | TEXT   | NOT NULL |
| phone       | TEXT   | NOT NULL |
| service     | TEXT   | NOT NULL (`corte`, `tinte`, `manicure`, `facial`) |
| date        | TEXT   | NOT NULL (ISO8601) |
| status      | TEXT   | NOT NULL, default `pending` |
| created_at  | TEXT   | NOT NULL, default `datetime('now')` |

### scores

| Campo       | Tipo   | Restricciones |
| ----------- | ------ | ------------- |
| id          | INTEGER| PK, AUTOINCREMENT |
| player_name | TEXT   | NOT NULL |
| score       | INTEGER| NOT NULL |
| created_at  | TEXT   | NOT NULL, default `datetime('now')` |

Todas las operaciones de escritura usan **consultas parametrizadas** (binding de `better-sqlite3`).
La conexión es un **singleton** activado en modo WAL para tolerancia a lecturas concurrentes.

## 4. Contrato de la API

Formato general de respuesta:

```json
{
  "success": true,
  "data": null,
  "message": "Mensaje legible de la operación."
}
```

| Método | Ruta                    | Entrada                                              | Salida `data`              | Códigos |
| ------ | ----------------------- | ---------------------------------------------------- | -------------------------- | ------- |
| GET    | `/api/health`           | —                                                    | null                       | 200     |
| GET    | `/api/appointments`     | —                                                    | `[Cita]`                   | 200     |
| POST   | `/api/appointments`     | `{name,email,phone,service,date}`                    | `Cita`                     | 201/400 |
| PUT    | `/api/appointments/:id` | `{name,email,phone,service,date}`                    | `Cita`                     | 200/400/404 |
| DELETE | `/api/appointments/:id` | —                                                    | `Cita` (la eliminada)      | 200/404 |
| GET    | `/api/scores?limit=10`  | `limit` opcional (1–50)                              | `[Score]` (orden desc.)    | 200     |
| POST   | `/api/scores`           | `{playerName, score}`                                | `Score`                    | 201/400 |
| POST   | `/api/chatbot`          | `{message}`                                          | `{reply}`                  | 200/400 |

### Validaciones (express-validator)

- `name`: 3–80 caracteres, escapes HTML.
- `email`: formato válido, normalizado.
- `phone`: 7–15 caracteres.
- `service`: dentro del catálogo `VALID_SERVICES`.
- `date`: ISO8601 y en el futuro.
- `score`: entero ≥ 1. `limit`: entero 1–50.
- `message`: 1–300 caracteres.

### Caso de error de validación

```json
{
  "success": false,
  "data": [ { "msg": "Invalid value", "param": "email" } ],
  "message": "Los datos enviados no son válidos."
}
```

## 5. Seguridad

- **Consultas parametrizadas** contra posibles inyecciones SQL.
- **Validación en servidor** con `express-validator` (la de cliente es solo UX).
- **CORS explícito** limitado a orígenes permitidos (`ALLOWED_ORIGINS`).
- **Escapes de texto** en nombres y mensajes (`trim().escape()`).
- **Sin secretos en el repositorio**: `.env` está en `.gitignore` y se entrega `.env.example`.

## 6. Manejo de errores

- `AppError(status, message, data)` lanzado por los servicios para errores de negocio (ej. cita no
  encontrada → 404, puntaje inválido → 400).
- `error-handler` global: errores 5xx se registran en stderr y siempre responden con el formato
  uniforme; nunca se expone el stack al cliente.
- `not-found` global para rutas inexistentes → 404.

## 7. Juego Tetris

- `Board` valida colocaciones y limpia líneas completas.
- `Piece` contiene las 7 piezas estándar con rotación por matriz transpuesta-invertida y *wall kick*
  simple (−2..+2).
- `GameLoop` con `requestAnimationFrame`; la gravedad usa intervalo por nivel
  (`700ms` inicial, −`40ms` por nivel, mínimo `120ms`).
- Puntuación: `100 × nivel` por línea; cada 5 líneas sube el nivel.
- Escenas: menú → juego → fin de partida (guardado de puntuación + top 10).

## 8. Autoevaluación del cumplimiento de requisitos

| Requisito | Cumplimiento | Evidencia |
| --------- | ------------ | --------- |
| Repositorio Git con commits de ambos | ✅ Realizado | `git log` — 2 commits de Michael (estructura + frontend) y 2 de Jocabeth (backend + gitattributes) |
| README.md completo | ✅ | `README.md` |
| .gitignore | ✅ | raíz del repositorio |
| .env + .env.example | ✅ | `backend/.env.example` (+ uso en `env.js`) |
| Nomenclatura (kebab/camel/Pascal/UPPER) | ✅ | archivos kebab, funciones camelCase, clases PascalCase, constantes UPPER_SNAKE |
| Un solo idioma en código (inglés) | ✅ | identificadores y respuestas de API en inglés; UI es contenido en español |
| Frontend modular ES6 | ✅ | `frontend/src/js/{modules,services,utils,game}` |
| Sin `onclick`, `<style>` ni `style=""` | ✅ | eventos vía `addEventListener`; estilos en CSS |
| Sin variables globales sueltas | ✅ | todo encapsulado en clases/módulos |
| Fetch centralizado en `services/` | ✅ | `api-client.js`; ninguna vista usa `fetch` directo |
| Diseño responsivo | ✅ | `@media` en `layout.css` |
| Juego: engine, entities, scenes, input | ✅ | `frontend/src/js/game/**` |
| App comercial: views, validación, utils (ITBIS) | ✅ | `appointment-form`, `validators`, `formatters` |
| Backend por capas | ✅ | `backend/src/{config,routes,controllers,services,repositories,models,middlewares,utils}` |
| API REST plural + verbos correctos | ✅ | `/api/appointments`, `/api/scores`, etc. |
| Códigos HTTP 200/201/400/401/404/500 | ✅ | `utils/http-status.js` + middlewares |
| JSON uniforme `{success,data,message}` | ✅ | `utils/response-builder.js` |
| Middleware global de errores | ✅ | `middlewares/error-handler.js` |
| Validación con express-validator | ✅ | `routes/*` + `middlewares/validate-request.js` |
| Consultas parametrizadas (SQLite) | ✅ | `repositories/*` (better-sqlite3) |
| CORS explícito | ✅ | `server.js` |
| Funciones ≤ 40 líneas | ✅ | revisión de estilo |
| Archivos ≤ 300 líneas | ✅ | verificado con script de conteo |
| Máx. 3 niveles de anidación | ✅ | revisión de estilo |
| Sin duplicación, sin `console.log`, sin código comentado | ✅ | `process.stderr.write` en errores; lógica única por capa |
| Sin números mágicos | ✅ | `constants.js`, `http-status.js`, `VALID_SERVICES` |
| Nombres verbo+substantivo | ✅ | `listAll`, `create`, `updateById`, `saveScore`... |
| Prettier + ESLint | ✅ | `.eslintrc.json`, `.prettierrc` |