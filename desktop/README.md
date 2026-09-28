# Belleza Tetris — Aplicación de escritorio

Capa de escritorio (Electron) que abre el proyecto en una ventana nativa y levanta
automáticamente la API y el frontend (ya no hace falta abrir el navegador).

## Requisitos

- Node.js instalado (la API se ejecuta con el Node del sistema).
- Windows (las instrucciones son para Windows).

## Cómo ejecutar (desarrollo)

```bash
cd desktop
npm install        # la primera vez (descarga el binario de Electron)
npm start
```

Se abre la ventana "Belleza Tetris". Al cerrarla, los servidores internos
(puertos 3000 y 5500) se detienen solos.

> Si `npm install` no descarga el binario de Electron, ejecuta:
> `node node_modules/electron/install.js`

## Cómo ejecutar el .exe empaquetado

Ya generado en:

```
desktop/dist/BellezaTetris/Belleza Tetris.exe
```

Doble clic al exe. La aplicación incluye dentro de la carpeta `resources/`
la API completa (backend con sus dependencias) y el frontend.

## Cómo volver a empaquetar

```bash
cd desktop
npm run dist     # genera electron-builder (desarrollo)
```

`electron-builder` puede fallar si el usuario no tiene privilegios para crear
enlaces simbólicos (la firma de código requiere admin). En ese caso se genera
el paquete manualmente:

```powershell
# copia node_modules/electron/dist a desktop/dist/BellezaTetris
# y renombra electron.exe a "Belleza Tetris.exe"
# coloca main.js + package.json en resources/app
# copia backend/ y frontend/ en resources/
```

Estructura final esperada:

```
desktop/dist/BellezaTetris/
├── Belleza Tetris.exe
└── resources/
    ├── app/            # main.js + package.json
    ├── backend/        # API (incluye node_modules)
    └── frontend/       # SPA
```

## Notas

- El exe abre una ventana real de escritorio y hace exactamente lo mismo que
  abrir http://localhost:5500 en el navegador.
- La base de datos SQLite se crea dentro de `resources/backend/data/`.