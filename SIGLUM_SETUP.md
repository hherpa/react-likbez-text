# Siglum Assets Setup

## Quick Start (Development)

Download WASM and bundles from CDN:

```bash
# Download WASM engine (~29MB)
curl -LO https://cdn.siglum.org/tl2025/busytex.wasm
curl -LO https://cdn.siglum.org/tl2025/busytex.js

# Download bundles (~195MB)
curl -LO https://cdn.siglum.org/tl2025/siglum-bundles-v0.1.0.tar.gz
tar -xzf siglum-bundles-v0.1.0.tar.gz -C ./public/
```

## Server Headers Required

When serving, add these headers:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Access-Control-Allow-Origin: *
Cross-Origin-Resource-Policy: cross-origin
```

## Usage in LikbezText

```tsx
<LikbezText
  source={text}
  siglumConfig={{
    bundlesUrl: '/bundles',
    wasmUrl: '/busytex.wasm',
    autoInit: true
  }}
/>
```

## Structure

```
public/
├── busytex.wasm
├── busytex.js
└── bundles/
    ├── bundles.json
    ├── file-manifest.json
    └── ... (bundle files)
```