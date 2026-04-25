import React from 'react';
import { ContentElement, RenderBox } from '../../domain/entities/Document';
import { SiglumRendererConfig, RendererOutput } from '../../domain/interfaces/IRenderer';

declare const SiglumCompiler: any;

export interface SiglumRenderer {
  init: (config?: SiglumRendererConfig) => Promise<void>;
  render: (element: ContentElement, config?: SiglumRendererConfig) => Promise<RendererOutput>;
  compile: (source: string, options?: { engine?: string }) => Promise<{ success: boolean; pdf?: Uint8Array; error?: string }>;
  destroy: () => void;
}

export const createSiglumRenderer = (
  defaultBox: RenderBox,
  onReady?: () => void
): SiglumRenderer => {
  let compiler: any = null;
  let initialized = false;
  const logs: string[] = [];
  const urlStore = new Set<string>();

  return {
    init: async (config?: SiglumRendererConfig): Promise<void> => {
      if (initialized) return;

      if (typeof SiglumCompiler === 'undefined') {
        console.warn('SiglumCompiler not loaded. Make sure @siglum/engine is available.');
        return;
      }

      compiler = new SiglumCompiler({
        bundlesUrl: config?.bundlesUrl || '/bundles',
        wasmUrl: config?.wasmUrl || '/busytex.wasm',
        workerUrl: config?.workerUrl || '/worker.js',
        ctanProxyUrl: config?.ctanProxyUrl,
        onLog: (msg: string) => {
          logs.push(msg);
          config?.onLog?.(msg);
        },
        onProgress: config?.onProgress,
        verbose: true,
      });

      await compiler.init();
      initialized = true;
      onReady?.();
    },

    render: async (element: ContentElement, config?: SiglumRendererConfig): Promise<RendererOutput> => {
      const renderBox = element.renderBox || defaultBox;

      if (!initialized || !compiler) {
        return {
          elementId: element.id,
          type: element.type,
          box: renderBox,
          content: (
            <div style={{
              ...renderBox.style,
              padding: 16,
              backgroundColor: '#f5f5f5',
              border: '1px dashed #ccc',
              color: '#666',
            }}>
              Initializing Siglum...
            </div>
          ),
        };
      }

      logs.length = 0;

      const latexSource = `
\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\begin{document}
${element.rawContent}
\\end{document}
`;

      try {
        const result = await compiler.compile(latexSource, {
          engine: config?.engine || 'pdflatex',
        });

        if (!result) {
          return {
            elementId: element.id,
            type: element.type,
            box: renderBox,
            content: (
              <div style={{
                ...renderBox.style,
                padding: 16,
                backgroundColor: '#ffebee',
                border: '1px solid #ffcdd2',
                color: '#c62828',
              }}>
                No result from compiler
              </div>
            ),
          };
        }

        if (result.success && result.pdf) {
          const pdfBuffer = result.pdfIsShared
            ? new Uint8Array(result.pdf).slice()
            : new Uint8Array(result.pdf);
          const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          urlStore.add(url);

          return {
            elementId: element.id,
            type: element.type,
            box: renderBox,
            content: (
              <div
                style={{
                  ...renderBox.style,
                  width: renderBox.dimensions.width,
                  height: renderBox.dimensions.height,
                  overflow: 'auto',
                }}
              >
                <object
                  data={url}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  style={{ minHeight: '200px' }}
                />
              </div>
            ),
          };
        }

        const texErrors = logs.filter(
          (l) =>
            l.includes('[TeX ERR]') ||
            l.includes('! LaTeX Error') ||
            l.includes('Error:')
        );
        const errorText =
          texErrors.length > 0
            ? texErrors.join('\n')
            : result.error || 'Unknown error (check console for details)';

        return {
          elementId: element.id,
          type: element.type,
          box: renderBox,
          content: (
            <div style={{
              ...renderBox.style,
              padding: 16,
              backgroundColor: '#ffebee',
              border: '1px solid #ffcdd2',
              color: '#c62828',
              fontSize: '11px',
              maxHeight: '200px',
              overflow: 'auto',
            }}>
              <strong>LaTeX Error:</strong>
              <pre style={{ margin: '8px 0 0 0', whiteSpace: 'pre-wrap' }}>
                {errorText}
              </pre>
            </div>
          ),
        };
      } catch (error) {
        return {
          elementId: element.id,
          type: element.type,
          box: renderBox,
          content: (
            <div style={{
              ...renderBox.style,
              padding: 16,
              backgroundColor: '#ffebee',
              border: '1px solid #ffcdd2',
              color: '#c62828',
            }}>
              <strong>Compilation error:</strong>
              <pre style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
                {String(error)}
              </pre>
            </div>
          ),
        };
      }
    },

    compile: async (source: string, options?: { engine?: string }) => {
      if (!compiler) {
        return { success: false, error: 'Siglum not initialized' };
      }
      return compiler.compile(source, options);
    },

    destroy: () => {
      for (const url of urlStore) {
        URL.revokeObjectURL(url);
      }
      urlStore.clear();
      logs.length = 0;
      if (compiler) {
        compiler.terminate?.();
        compiler = null;
      }
      initialized = false;
    },
  };
};