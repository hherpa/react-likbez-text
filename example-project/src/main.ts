import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as http from 'http';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;
let devServer: http.Server | null = null;

const PORT = 3001;
const ROOT_DIR = __dirname;

function startDevServer(): Promise<void> {
  return new Promise((resolve) => {
    devServer = http.createServer((req, res) => {
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

      const url = req.url || '/';
      let filePath: string;

      if (url.startsWith('/node_modules/')) {
        filePath = path.join(ROOT_DIR, '..', url);
      } else if (url.startsWith('/bundles/') || url.startsWith('/workers/')) {
        filePath = path.join(ROOT_DIR, '..', url);
      } else if (url === '/' || url === '/index.html' || url === '') {
        filePath = path.join(ROOT_DIR, 'index.html');
      } else {
        filePath = path.join(ROOT_DIR, url);
      }

      if (!fs.existsSync(filePath)) {
        console.log(`[404] ${url} -> ${filePath}`);
        res.writeHead(404);
        res.end('Not Found: ' + url);
        return;
      }

      const ext = path.extname(filePath);
      const mimeTypes: Record<string, string> = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.ts': 'application/typescript',
        '.css': 'text/css',
        '.wasm': 'application/wasm',
        '.json': 'application/json',
      };

      const contentType = mimeTypes[ext] || 'application/octet-stream';
      const content = fs.readFileSync(filePath);

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });

    devServer.listen(PORT, () => {
      console.log(`Dev server running at http://localhost:${PORT}`);
      resolve();
    });
  });
}

async function createWindow() {
  await startDevServer();

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    title: 'LikbezText - Electron Test',
  });

  mainWindow.loadURL(`http://localhost:${PORT}/index.html`);

  mainWindow.webContents.openDevTools();

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    console.error(`Failed to load: ${errorCode} - ${errorDescription}`);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (devServer) {
    devServer.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});