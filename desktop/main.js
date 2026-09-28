const { app, BrowserWindow, dialog, shell } = require('electron');
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const PROJECT_ROOT = app.isPackaged
  ? process.resourcesPath
  : path.resolve(__dirname, '..');
const BACKEND_DIR = path.join(PROJECT_ROOT, 'backend');
const FRONTEND_DIR = path.join(PROJECT_ROOT, 'frontend');

const BACKEND_URL = 'http://localhost:3000/api/health';
const FRONTEND_URL = 'http://localhost:5500';

const children = [];

function log(service, message) {
  console.log(`[${service}] ${message}`);
}

function startNode(script, args, cwd, service) {
  const child = spawn('node', [script, ...args], {
    cwd,
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });
  child.stdout.on('data', (d) => log(service, d.toString().trim()));
  child.stderr.on('data', (d) => log(service, d.toString().trim()));
  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      log(service, `terminó con código ${code}`);
    }
  });
  child.on('error', (error) => {
    log(service, `error al iniciar: ${error.message}`);
    dialog.showErrorBox(
      'Error al iniciar Belleza Tetris',
      `No se pudo iniciar el servidor (${service}):\n${error.message}\n\nVerifica que Node.js esté instalado.`,
    );
  });
  children.push(child);
  return child;
}

function probe(url) {
  return new Promise((resolve) => {
    try {
      const req = http.get(url, () => {
        req.destroy();
        resolve(true);
      });
      req.on('error', () => resolve(false));
    } catch {
      resolve(false);
    }
  });
}

async function waitFor(url, timeoutMs = 20000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await probe(url)) return true;
    await new Promise((r) => setTimeout(r, 300));
  }
  return false;
}

function stopChildren() {
  for (const child of children) {
    try {
      child.kill();
    } catch {
      // already gone
    }
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 900,
    minHeight: 640,
    title: 'Belleza Tetris',
    autoHideMenuBar: true,
    backgroundColor: '#f5f1ea',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.loadURL(FRONTEND_URL);
  return mainWindow;
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const [win] = BrowserWindow.getAllWindows();
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(async () => {
    startNode('server.js', [], BACKEND_DIR, 'API');
    startNode('static-server.js', ['.', '5500'], FRONTEND_DIR, 'FRONT');

    await waitFor(FRONTEND_URL, 15000);
    const apiUp = await waitFor(BACKEND_URL, 20000);

    log('app', apiUp ? 'API conectada.' : 'API no responde (intenta de nuevo dentro de la app).');

    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    app.quit();
  });

  app.on('before-quit', () => {
    stopChildren();
  });

  app.on('will-quit', () => {
    stopChildren();
  });
}