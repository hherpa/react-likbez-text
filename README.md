# LikbezText

React-компонент для рендеринга текста с поддержкой Markdown, KaTeX и LaTeX.

## Что делает компонент

Компонент автоматически:
- Парсит исходный текст
- Определяет типы блоков (Markdown, KaTeX, Siglum/LaTeX)
- Рендерит каждый блок соответствующим способом
- Компилирует LaTeX в PDF через Siglum (WebAssembly)

## Что поставляет из коробки

| Тип | Синтаксис | Пример |
|-----|-----------|--------|
| **Markdown** | `#`, `##`, `**bold**`, `*italic*`, `` `code` `` | `# Заголовок` |
| **KaTeX inline** | `$...$` | `$E = mc^2$` |
| **KaTeX display** | `$$...$$` | `$$\int_a^b f(x)dx$$` |
| **Siglum (LaTeX)** | `{siglum}...{/siglum}` | `{siglum}\begin{align}...{/siglum}` |

## Установка

```bash
npm install
npm run build
```

## API

### Props

```tsx
import { LikbezText } from './src';

<LikbezText
  source={`
# Заголовок

Текст с $E=mc^2$ формулой.

$$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$

{siglum}
\begin{align}
  \int_{-\infty}^{\infty} e^{-x^2} dx &= \sqrt{\pi}
\end{align}
{/siglum}
  `}
/>
```

### Полный API

```tsx
interface LikbezTextProps {
  // Обязательный
  source: string;

  // === Настройки Siglum (LaTeX) ===
  siglumConfig?: {
    // Путь до папки с бандлами (относительно корня сайта)
    bundlesUrl?: string;  // по умолчанию: '/bundles'
    // Путь до WASM файла
    wasmUrl?: string;     // по умолчанию: '/busytex.wasm'
    // Путь до worker.js
    workerUrl?: string;   // по умолчанию: '/worker.js'
    // URL прокси для CTAN пакетов
    ctanProxyUrl?: string;
    // Callback для логов
    onLog?: (msg: string) => void;
    // Callback для прогресса
    onProgress?: (stage: string, detail: unknown) => void;
    // Автоматически инициализировать Siglum
    autoInit?: boolean;   // по умолчанию: true
  };

  // === Настройки KaTeX ===
  katexConfig?: {
    displayMode?: boolean;
    throwOnError?: boolean;
    errorColor?: string;
    macros?: Record<string, string>;
  };

  // === Настройки парсера ===
  parserOptions?: {
    customElements?: Array<{
      type: string;
      pattern: RegExp;
      parse: (match: RegExpMatchArray) => Partial<ContentElement>;
    }>;
  };

  // === Стили контейнеров ===
  defaultBox?: RenderBox;
  customBoxes?: Record<string, RenderBox>;

  // === Кастомные элементы ===
  customElements?: Array<{
    type: string;
    pattern: RegExp;
    parse: (match: RegExpMatchArray) => Partial<ContentElement>;
  }>;

  // === Стандартные React ===
  style?: React.CSSProperties;
  className?: string;
}
```

## Указание путей до Siglum

### Вариант 1: Локальные файлы (рекомендуется для разработки)

Скачайте Siglum assets и положите в `public/`:

```bash
# Download WASM engine (~29MB)
curl -LO https://cdn.siglum.org/tl2025/busytex.wasm
curl -LO https://cdn.siglum.org/tl2025/busytex.js

# Download bundles (~195MB)
curl -LO https://cdn.siglum.org/tl2025/siglum-bundles-v0.1.0.tar.gz
tar -xzf siglum-bundles-v0.1.0.tar.gz -C ./public/
```

```tsx
// Пути по умолчанию — файлы в public/
<LikbezText source={text} />
// или явно:
<LikbezText 
  source={text}
  siglumConfig={{
    bundlesUrl: '/bundles',
    wasmUrl: '/busytex.wasm',
    workerUrl: '/worker.js'
  }}
/>
```

### Вариант 2: CDN (рекомендуется для продакшена)

```tsx
<LikbezText 
  source={text}
  siglumConfig={{
    bundlesUrl: 'https://cdn.siglum.org/tl2025/bundles',
    wasmUrl: 'https://cdn.siglum.org/tl2025/busytex.wasm',
    workerUrl: 'https://cdn.siglum.org/tl2025/worker.js'
  }}
/>
```

### Вариант 3: Свой путь

```tsx
<LikbezText 
  source={text}
  siglumConfig={{
    bundlesUrl: '/assets/siglum/bundles',
    wasmUrl: '/assets/siglum/busytex.wasm',
    workerUrl: '/assets/siglum/worker.js'
  }}
/>
```

## Алгоритм работы

### 1. Парсинг (UnifiedParser)

Исходный текст проходит через приоритетный парсер:

1. **{siglum}...{/siglum}** → тип `siglum` (полноценный LaTeX)
2. **$$** → тип `katex` (блочная формула)
3. **$** → тип `katex` (inline формула)
4. **customElements** → тип `custom` (пользовательские блоки)
5. **всё остальное** → тип `markdown`

Результат: массив `ContentElement[]`, где каждый элемент содержит `id`, `type`, `rawContent`, `renderBox`, `metadata`.

### 2. Рендеринг

Для каждого элемента выбирается соответствующий рендерер:

- **markdown** → MarkdownRenderer → regex-подстановки → HTML
- **katex** → KaTeXRenderer → KaTeX → HTML
- **siglum** → SiglumRenderer → LaTeX → компиляция в PDF → blob URL
- **custom** → CustomRenderer → пользовательская логика

### 3. Результат

Массив `React.ReactNode[]` — готовые React-компоненты для рендеринга.

### Инициализация Siglum

```
useEffect(() {
  createSiglumRenderer()
    .init(siglumConfig)      // грузит WASM + bundles
    .then(() => setSiglumReady(true))
}, [])
```

При рендере siglum-элементов:
1. Ожидание готовности → показ "Loading..."
2. Компиляция LaTeX → PDF (через SiglumCompiler)
3. PDF blob → `<object data={url} type="application/pdf">`

## Требования к серверу

Для работы Siglum нужны заголовки:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Access-Control-Allow-Origin: *
Cross-Origin-Resource-Policy: cross-origin
```

## Структура проекта

```
src/
├── domain/           # Бизнес-логика
│   ├── entities/      # Модели (ContentElement, RenderBox)
│   └── interfaces/   # Интерфейсы (IParser, IRenderer)
├── infrastructure/   # Реализация
│   ├── parsers/      # UnifiedParser
│   └── renderers/    # KaTeX, Markdown, Siglum, Custom
└── presentation/     # UI
    ├── components/  # LikbezText
    └── hooks/       # useLikbezText
```
