import { ContentElement, RenderBox } from '../../domain/entities/Document';
import { SiglumRendererConfig, RendererOutput } from '../../domain/interfaces/IRenderer';

declare const SiglumCompiler: any;

export interface SiglumRenderer {
  init: (config?: SiglumRendererConfig) => Promise<void>;
  render: (element: ContentElement, config?: SiglumRendererConfig) => Promise<RendererOutput>;
  compile: (source: string, options?: { engine?: string }) => Promise<{ success: boolean; pdf?: Uint8Array; error?: string }>;
}

export const createSiglumRenderer = (
  defaultBox: RenderBox,
  onReady?: () => void
): SiglumRenderer => {
  let compiler: any = null;
  let initialized = false;

  return {
    init: async (config?: SiglumRendererConfig): Promise<void> => {
      if (initialized) return;
      
      if (typeof SiglumCompiler === 'undefined') {
        console.warn('SiglumCompiler not loaded. Make sure @siglum/engine is available.');
        return;
      }

      compiler = new SiglumCompiler({
        bundlesUrl: config?.bundlesUrl || 'https://cdn.siglum.org/tl2025/bundles',
        wasmUrl: config?.wasmUrl || 'https://cdn.siglum.org/tl2025/busytex.wasm',
        ctanProxyUrl: config?.ctanProxyUrl,
        onLog: config?.onLog,
        onProgress: config?.onProgress,
        verbose: false,
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
              Loading Siglum...
            </div>
          ),
        };
      }

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

        if (result.success && result.pdf) {
          const blob = new Blob([result.pdf], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);

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
        } else {
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
                <strong>Siglum Error:</strong>
                <pre style={{ margin: '8px 0 0 0', fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                  {result.error || 'Unknown error'}
                </pre>
              </div>
            ),
          };
        }
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
              <strong>Siglum Error:</strong>
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
  };
};