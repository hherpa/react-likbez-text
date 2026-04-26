"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const http = __importStar(require("http"));
const fs = __importStar(require("fs"));
let mainWindow = null;
let devServer = null;
const PORT = 3001;
const ROOT_DIR = __dirname;
function startDevServer() {
    return new Promise((resolve) => {
        devServer = http.createServer((req, res) => {
            res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
            res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
            const url = req.url || '/';
            let filePath;
            if (url.startsWith('/node_modules/')) {
                filePath = path.join(ROOT_DIR, '..', url);
            }
            else if (url.startsWith('/bundles/')) {
                filePath = path.join(ROOT_DIR, '..', 'public', 'bundles', url.slice(9));
            }
            else if (url === '/busytex.wasm' || url === '/worker.js') {
                filePath = path.join(ROOT_DIR, '..', 'public', url);
            }
            else if (url === '/' || url === '/index.html' || url === '') {
                filePath = path.join(ROOT_DIR, 'index.html');
            }
            else {
                filePath = path.join(ROOT_DIR, '..', 'public', url);
            }
            if (!fs.existsSync(filePath)) {
                console.log(`[404] ${url} -> ${filePath}`);
                res.writeHead(404);
                res.end('Not Found: ' + url);
                return;
            }
            const ext = path.extname(filePath);
            const mimeTypes = {
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
    mainWindow = new electron_1.BrowserWindow({
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
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', () => {
    if (devServer) {
        devServer.close();
    }
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
