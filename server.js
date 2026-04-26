const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.ts': 'application/typescript',
  '.css': 'text/css',
  '.wasm': 'application/wasm',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  let filePath = path.join(__dirname, 'prototypes', req.url === '/' ? 'textarea-example.html' : req.url);
  
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'public', req.url);
  }
  
  if (!fs.existsSync(filePath) && req.url.startsWith('/node_modules/')) {
    filePath = path.join(__dirname, req.url);
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not Found: ' + req.url);
    return;
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`- Textarea: http://localhost:${PORT}/textarea-example.html`);
  console.log(`- CodeMirror: http://localhost:${PORT}/codemirror-example.html`);
});