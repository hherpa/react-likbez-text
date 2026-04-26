import React, { useState, useEffect, useMemo, useRef } from 'react';
import katex from 'katex';

export interface LikbezTextProps {
  source: string;
  siglumConfig?: {
    bundlesUrl?: string;
    wasmUrl?: string;
    workerUrl?: string;
    ctanProxyUrl?: string;
    onLog?: (msg: string) => void;
    onProgress?: (stage: string, detail: unknown) => void;
  };
  style?: React.CSSProperties;
  className?: string;
}

interface ParsedElement {
  id: string;
  type: 'markdown' | 'siglum';
  content: string;
}

interface SiglumResult {
  content: React.ReactNode;
}

const generateId = (): string => `elem_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const parseSource = (source: string): ParsedElement[] => {
  const elements: ParsedElement[] = [];
  const siglumRegex = /\{siglum\}([\s\S]*?)\{\/siglum\}/g;
  let lastEnd = 0;
  let siglumIdx = 0;

  let match: RegExpExecArray | null;
  while ((match = siglumRegex.exec(source)) !== null) {
    if (match.index > lastEnd) {
      const text = source.slice(lastEnd, match.index).trim();
      if (text) {
        elements.push({ id: generateId(), type: 'markdown', content: text });
      }
    }
    elements.push({
      id: `siglum_${siglumIdx++}`,
      type: 'siglum',
      content: match[1].trim(),
    });
    lastEnd = match.index + match[0].length;
  }

  if (lastEnd < source.length) {
    const text = source.slice(lastEnd).trim();
    if (text) {
      elements.push({ id: generateId(), type: 'markdown', content: text });
    }
  }

  return elements;
};

const renderMarkdown = (text: string): string => {
  let html = text
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\$\$([\s\S]+?)\$\$/g, (_match, formula) => {
      try {
        const katexHtml = katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false });
        return `<div class="katex-display">${katexHtml}</div>`;
      } catch (e) {
        return `<span style="color:#cc0000">KaTeX Error: ${e}</span>`;
      }
    })
    .replace(/\$([^\$\n]+?)\$/g, (_match, formula) => {
      try {
        return katex.renderToString(formula.trim(), { displayMode: false, throwOnError: false });
      } catch (e) {
        return `<span style="color:#cc0000">KaTeX Error: ${e}</span>`;
      }
    })
    .replace(/\n/g, '<br>');

  return html;
};

declare const SiglumCompiler: new (config: {
  bundlesUrl: string;
  wasmUrl: string;
  workerUrl: string;
  ctanProxyUrl?: string;
  onLog?: (msg: string) => void;
  onProgress?: (stage: string, detail: unknown) => void;
  verbose: boolean;
}) => SiglumCompilerInstance;

interface SiglumCompilerInstance {
  init(): Promise<void>;
  compile(source: string, options: { engine: string }): Promise<{
    success: boolean;
    pdf?: Uint8Array;
    pdfIsShared?: boolean;
    error?: string;
  }>;
  terminate?(): void;
}

interface CreateSiglumRendererReturn {
  init: (config: {
    bundlesUrl?: string;
    wasmUrl?: string;
    workerUrl?: string;
    ctanProxyUrl?: string;
    onLog?: (msg: string) => void;
    onProgress?: (stage: string, detail: unknown) => void;
  }) => Promise<void>;
  render: (latex: string) => Promise<SiglumResult>;
  destroy: () => void;
}

const createSiglumRenderer = (): CreateSiglumRendererReturn => {
  let compiler: SiglumCompilerInstance | null = null;
  let initialized = false;
  let pendingCompile: Promise<SiglumResult> | null = null;
  const blobUrls = new Set<string>();

  return {
    init: async (config) => {
      if (initialized) return;
      if (typeof SiglumCompiler === 'undefined') {
        console.warn('SiglumCompiler not loaded');
        return;
      }

      compiler = new SiglumCompiler({
        bundlesUrl: config.bundlesUrl || '/bundles',
        wasmUrl: config.wasmUrl || '/busytex.wasm',
        workerUrl: config.workerUrl || '/worker.js',
        ctanProxyUrl: config.ctanProxyUrl,
        onLog: (msg: string) => {
          config.onLog?.(msg);
        },
        onProgress: config.onProgress,
        verbose: true,
      });

      await compiler.init();
      initialized = true;
    },

    render: async (latex: string): Promise<SiglumResult> => {
      if (!compiler) {
        return { content: <div style={{ padding: 16, backgroundColor: '#f5f5f5', border: '1px dashed #ccc', color: '#666' }}>Initializing Siglum...</div> };
      }

      const fullLatex = `\\documentclass{article}\\usepackage{amsmath}\\begin{document}${latex}\\end{document}`;

      const doCompile = async (): Promise<SiglumResult> => {
        let result: { success: boolean; pdf?: Uint8Array; pdfIsShared?: boolean; log?: string; error?: string };
        try {
          result = await compiler!.compile(fullLatex, { engine: 'pdflatex' });
        } catch (e) {
          return { content: <div style={{ padding: 16, backgroundColor: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828' }}>Compilation error: {String(e)}</div> };
        }

        if (!result) {
          return { content: <div style={{ padding: 16, backgroundColor: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828' }}>No result from compiler</div> };
        }

        if (result.success && result.pdf) {
          const pdfBuffer = result.pdfIsShared ? new Uint8Array(result.pdf).slice() : new Uint8Array(result.pdf);
          const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          blobUrls.add(url);

          return {
            content: (
              <div style={{ padding: 16, backgroundColor: '#fff', border: '2px solid #2196F3', borderRadius: 8 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: '#1976D2' }}>LaTeX (Siglum)</div>
                <object data={url} type="application/pdf" width="100%" style={{ minHeight: 200 }} />
              </div>
            ),
          };
        }

        const errorText = result.log || result.error || 'Unknown error';
        return {
          content: (
            <div style={{ padding: 16, backgroundColor: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828', fontSize: 11, maxHeight: 200, overflow: 'auto' }}>
              <strong>LaTeX Error:</strong>
              <pre style={{ whiteSpace: 'pre-wrap', margin: '8px 0 0 0' }}>{errorText}</pre>
            </div>
          ),
        };
      };

      if (pendingCompile) {
        await pendingCompile;
      }
      pendingCompile = doCompile();
      return pendingCompile;
    },

    destroy: () => {
      for (const url of blobUrls) {
        URL.revokeObjectURL(url);
      }
      blobUrls.clear();
      if (compiler) {
        (compiler as { terminate?: () => void }).terminate?.();
        compiler = null;
      }
      initialized = false;
    },
  };
};

const MarkdownElement: React.FC<{ content: string }> = ({ content }) => {
  const html = useMemo(() => renderMarkdown(content), [content]);
  return <div className="markdown-content" dangerouslySetInnerHTML={{ __html: html }} />;
};

interface SiglumElementProps {
  latex: string;
  renderer: CreateSiglumRendererReturn;
}

const SiglumElement: React.FC<SiglumElementProps> = ({ latex, renderer }) => {
  const [content, setContent] = useState<React.ReactNode>(<div style={{ padding: 16, backgroundColor: '#f5f5f5', border: '1px dashed #ccc', color: '#666' }}>Rendering LaTeX...</div>);
  const prevLatex = useRef('');

  useEffect(() => {
    if (latex === prevLatex.current) {
      return;
    }
    prevLatex.current = latex;

    setContent(<div style={{ padding: 16, backgroundColor: '#f5f5f5', border: '1px dashed #ccc', color: '#666' }}>Rendering LaTeX...</div>);

    renderer.render(latex).then(res => {
      if (prevLatex.current === latex) {
        setContent(res.content);
      }
    });
  }, [latex, renderer]);

  return <div style={{ marginBottom: 16 }}>{content}</div>;
};

export const LikbezText: React.FC<LikbezTextProps> = ({
  source,
  siglumConfig,
  style,
  className,
}) => {
  const [siglumReady, setSiglumReady] = useState(false);
  const rendererRef = useRef<CreateSiglumRendererReturn | null>(null);

  const elements = useMemo(() => parseSource(source), [source]);

  useEffect(() => {
    const renderer = createSiglumRenderer();
    rendererRef.current = renderer;
    renderer.init(siglumConfig || {}).then(() => setSiglumReady(true)).catch(console.error);
    return () => renderer.destroy();
  }, []);

  return (
    <div className={className} style={style}>
      {elements.map(el => {
        if (el.type === 'markdown') {
          return <MarkdownElement key={el.id} content={el.content} />;
        }
        if (el.type === 'siglum') {
          if (siglumReady && rendererRef.current) {
            return <SiglumElement key={el.id} latex={el.content} renderer={rendererRef.current} />;
          }
          return <div key={el.id} style={{ padding: 16, backgroundColor: '#f5f5f5', border: '1px dashed #ccc', color: '#666', marginBottom: 16 }}>Initializing Siglum...</div>;
        }
        return null;
      })}
    </div>
  );
};

export default LikbezText;