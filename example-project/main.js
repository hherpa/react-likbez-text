const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

const PORT = 3001;
const ROOT = __dirname;
const LIB = path.join(ROOT, '..');

http.createServer((req, res) => {
  const url = req.url || '/';
  let file;

  if (url.startsWith('/node_modules/'))    file = path.join(LIB, url);
  else if (url.startsWith('/bundles/'))    file = path.join(LIB, 'public', 'bundles', url.slice(9));
  else if (url === '/busytex.wasm' || url === '/worker.js') file = path.join(LIB, 'public', url);
  else if (url === '/' || url === '/index.html') file = path.join(ROOT, 'index.html');
  else                                     file = path.join(LIB, 'public', url);

  if (!fs.existsSync(file)) { res.writeHead(404); res.end(); return; }

  const ext = path.extname(file);
  const mime = {
    '.html': 'text/html', '.js': 'application/javascript',
    '.css': 'text/css', '.wasm': 'application/wasm', '.json': 'application/json',
  };
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
  res.end(fs.readFileSync(file));
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1400, height: 900,
    webPreferences: { webSecurity: false },
  });
  win.loadURL(`http://localhost:${PORT}`);
  win.webContents.openDevTools();
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
