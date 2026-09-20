# Belleza Tetris

Proyecto integrador que combina una **aplicación comercial de un salón de belleza** (agendado de citas, catálogo de servicios con ITBIS) con un **juego de Tetris** jugable en el navegador, más un **chatbot con voz**, **temas claro/oscuro** y una **API REST por capas** en el backend.

## Funcionalidades

- Aplicación comercial: catálogo de servicios, precios con **ITBIS (18%)** desglosado y **agendado de citas** con validación de cliente y servidor.
- Backend **Node.js + Express + SQLite** organizado en capas (config, routes, controllers, services, repositories, models, middlewares, utils).
- **API REST** con rutas en plural y verbos HTTP correctos, respuestas JSON uniformes `{ success, data, message }` y códigos 200/201/400/401/404/500.
- Juego **Tetris** con arquitectura de escenas (menú, juego, game over), engine, entidades, renderer en canvas e input (teclado y botones táctiles).
- **Leaderboard** de puntuaciones guardadas en la base de datos.
- **Chatbot** con respuestas por reglas y **salida por voz** (Web Speech API).
- **Temas claro/oscuro** persistidos en `localStorage` y detectados desde el sistema.
- Frontend **modular ES6** (sin `onclick`, sin `<style>`, sin `style=""`, sin variables globales sueltas).
- Diseño **responsivo** con `media queries`.

## Estructura del repositorio

```
.
├── backend/                 # API REST
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── .eslintrc.json
│   ├── .prettierrc
│   └── src/
│       ├── config/          # env.js, database.js
│       ├── routes/          # appointments, scores, chatbot
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── models/
│       ├── middlewares/     # error-handler, not-found, validate-request
│       └── utils/           # http-status, response-builder
├── docs/
│   └── documento-tecnico.md
├── frontend/                # SPA (ES modules)
│   ├── index.html
│   └── src/
│       ├── css/             # base, layout, themes, components, game
│       ├── js/
│       │   ├── main.js
│       │   ├── modules/     # router, chatbot, theme-manager, speech-service, ...
│       │   ├── services/    # api-client, appointments, scores, chatbot
│       │   ├── utils/       # constants, formatters, validators
│       │   └── game/
│       │       ├── engine/  # game-loop, renderer, board
│       │       ├── entities/# piece, player
│       │       ├── scenes/  # menu, play, game-over
│       │       └── input/   # input-handler
└── .gitignore
```

## Requisitos previos

- Node.js 22 o superior (probado con Node 24; `better-sqlite3` v13 requiere Node ≥ 22).
- npm.
- Un servidor estático para servir el frontend (Live Server, `npx serve`, etc.).

## Puesta en marcha

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

El servidor queda en `http://localhost:3000` y crea automáticamente la base SQLite en `backend/data/`.

### 2. Frontend

Abre la carpeta `frontend/` con un servidor estático en el puerto **5500** (ej. Live Server de VS Code) y visita `http://localhost:5500`.

> El frontend no debe abrirse con `file://`: los ES modules y `fetch` requieren un servidor HTTP. El origen permitido por CORS por defecto es `http://localhost:5500`.

## Endpoints de la API

| Método | Ruta                  | Descripción                              | Códigos |
| ------ | --------------------- | ---------------------------------------- | ------- |
| GET    | `/api/health`         | Estado del servicio                      | 200     |
| GET    | `/api/appointments`   | Lista de citas                           | 200     |
| POST   | `/api/appointments`   | Crea una cita                            | 201, 400|
| PUT    | `/api/appointments/:id`| Actualiza una cita                       | 200, 400, 404 |
| DELETE | `/api/appointments/:id`| Elimina una cita                         | 200, 404 |
| GET    | `/api/scores?limit=10`| Mejores puntuaciones                     | 200     |
| POST   | `/api/scores`         | Guarda una puntuación                    | 201, 400|
| POST   | `/api/chatbot`        | Respuesta del chatbot (`{ message }`)    | 200, 400|

Todas las respuestas usan el formato:

```json
{ "success": true, "data": { }, "message": "Operación exitosa." }
```

## Cómo jugar al Tetris

| Tecla       | Acción        |
| ----------- | ------------- |
| ← / → o A/D | Mover         |
| ↑ o W       | Rotar         |
| ↓ o S       | Bajar         |
| Espacio     | Soltar al instante |
| P           | Pausa/Reanudar|
| R           | Reiniciar     |

También hay botones táctiles bajo el tablero. Al terminar la partida puedes guardar tu puntuación en el ranking.

## Chat con voz

Pulsa el botón flotante **💬** para abrir el asistente. Puedes preguntar por servicios, precios, horarios, ubicación, citas o el juego. Usa el botón **🔊** para activar o silenciar la respuesta por voz (Web Speech API).

## Temas

El botón **🌙 / ☀️** del encabezado cambia entre tema claro y oscuro. La preferencia queda guardada y, la primera vez, se detecta el tema del sistema.

## Commits y GitHub (trabajo en pareja)

Para que el historial refleje ambos integrantes, configurar los dos autores locales y alternar `user.name`/`user.email` al hacer commits:

> El repositorio local ya contiene commits de ambos autores: **Michael** (estructura y frontend) y **Jocabeth** (backend). El ejemplo siguiente solo ilustra el flujo para nuevos commits.

```bash
git init
git add .
git commit -m "docs: repositorio inicial"

git config user.name "Integrante 1"
git config user.email "integrante1@correo.com"
git add frontend/
git commit -m "feat(frontend): app comercial modular y juego Tetris"

git config user.name "Integrante 2"
git config user.email "integrante2@correo.com"
git add backend/
git commit -m "feat(backend): API REST por capas con SQLite"

git remote add origin https://github.com/usuario/belleza-tetris.git
git push -u origin main
```

> Verificar que `backend/.env` y `backend/data/` estén ignorados por `.gitignore` antes del primer `git add .`.

## Tecnologías

- **Frontend**: HTML5, CSS3 (variables + media queries), JavaScript ES6 (módulos), Canvas API, Web Speech API.
- **Backend**: Node.js, Express, express-validator, better-sqlite3, cors, dotenv.
- **Calidad**: ESLint + Prettier (configuración incluida).

## Documentación técnica

Ver [docs/documento-tecnico.md](docs/documento-tecnico.md) para arquitectura, modelo de datos, contrato de la API, seguridad y autoevaluación del cumplimiento de requisitos.