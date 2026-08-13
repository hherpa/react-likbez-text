const { buildSync } = require('esbuild');
const fs = require('fs');
const path = require('path');

const outdir = path.join(__dirname, 'public');
const outFile = path.join(outdir, 'likbez-text.js');

buildSync({
  entryPoints: [path.join(__dirname, 'src', 'index.ts')],
  bundle: true,
  format: 'iife',
  globalName: 'LikbezTextLib',
  target: 'es2020',
  outfile: outFile,
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
    '.css': 'css',
  },
  jsx: 'automatic',
  external: ['react', 'react-dom', 'katex'],
  logLevel: 'info',
});

let code = fs.readFileSync(outFile, 'utf8');

const requireShim = `var __require = function(m) {
  if (m === 'katex') return window.katex;
  if (m === 'react') return window.React;
  if (m === 'react-dom') return window.ReactDOM;
  if (m === 'react/jsx-runtime') return {
    jsx: function(t, p) { return window.React.createElement(t, p); },
    jsxs: function(t, p) { return window.React.createElement(t, p); },
    get Fragment() { return window.React.Fragment; }
  };
  throw new Error('Missing module: ' + m);
};`;

// Find and replace the esbuild-generated __require function
const requireStart = code.indexOf('var __require = ');
if (requireStart !== -1) {
  // Find the closing "); after the function expression
  const searchFrom = requireStart;
  // Pattern: var __require = ...)(function(x) { ... });
  const requireEnd = code.indexOf('});', searchFrom);
  if (requireEnd !== -1) {
    code = code.substring(0, requireStart) + requireShim + code.substring(requireEnd + 3);
  }
}

fs.writeFileSync(outFile, code, 'utf8');
console.log('Browser bundle built: public/likbez-text.js');
