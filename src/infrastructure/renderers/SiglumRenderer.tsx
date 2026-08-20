import React from 'react';
import { ContentElement, RenderBox } from '../../domain/entities/Document';
import { SiglumRendererConfig, RendererOutput } from '../../domain/interfaces/IRenderer';

declare const SiglumCompiler: any;
declare const PdfToCairo: any;

export interface SiglumRenderer {
  init: (config?: SiglumRendererConfig) => Promise<void>;
  render: (element: ContentElement, config?: SiglumRendererConfig) => Promise<RendererOutput>;
  compile: (source: string, options?: { engine?: string }) => Promise<{ success: boolean; pdf?: Uint8Array; error?: string }>;
  destroy: () => void;
}

const SIGLUM_LOAD_TIMEOUT_MS = 30000;

export const createSiglumRenderer = (
  defaultBox: RenderBox
): SiglumRenderer => {
  let compiler: any = null;
  let pdftocairo: any = null;
  let initialized = false;
  let initError: string | null = null;
  let pendingInitCleanup: (() => void) | null = null;
  const logs: string[] = [];
  const urlStore = new Set<string>();

  const waitForSiglumCompiler = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof SiglumCompiler !== 'undefined') {
        resolve();
        return;
      }

      if (typeof window === 'undefined') {
        reject(new Error('SiglumCompiler is not available in a non-browser environment.'));
        return;
      }

      let cleanup: (() => void) | null = null;

      const onReady = () => {
        if (typeof SiglumCompiler !== 'undefined') {
          cleanup?.();
          resolve();
        }
      };

      const timer = setTimeout(() => {
        cleanup?.();
        reject(new Error(
          'SiglumCompiler did not become available in time. Load @siglum/engine and dispatch the "siglum-ready" event (or include siglum-init.js).'
        ));
      }, SIGLUM_LOAD_TIMEOUT_MS);

      cleanup = () => {
        if (pendingInitCleanup === cleanup) pendingInitCleanup = null;
        clearTimeout(timer);
        window.removeEventListener('siglum-ready', onReady);
      };

      pendingInitCleanup = cleanup;
      window.addEventListener('siglum-ready', onReady);
    });
  };

  return {
    init: async (config?: SiglumRendererConfig): Promise<void> => {
      if (initialized) return;

      if (typeof window !== 'undefined' && window.crossOriginIsolated === true) {
        console.warn('[LIKBEZ] The document is cross-origin isolated. Chrome disables its built-in PDF viewer in isolated documents, so compiled PDFs may not display via <object>. If cross-origin isolation is not required, remove the COOP/COEP headers.');
      }

      try {
        await waitForSiglumCompiler();
      } catch (error) {
        initError = error instanceof Error ? error.message : String(error);
        console.error('[LIKBEZ] siglum init error:', initError);
        return;
      }

      try {
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
      } catch (error) {
        initError = error instanceof Error ? error.message : String(error);
        console.error('[LIKBEZ] siglum init error:', initError);
      }

      try {
        if (typeof PdfToCairo !== 'undefined') {
          pdftocairo = await PdfToCairo();
          console.log('[LIKBEZ] pdftocairo loaded');
        } else {
          console.warn('[LIKBEZ] PdfToCairo not available, SVG conversion disabled');
        }
      } catch (error) {
        console.warn('[LIKBEZ] pdftocairo init failed:', error);
      }
    },

    render: async (element: ContentElement, config?: SiglumRendererConfig): Promise<RendererOutput> => {
      const renderBox = element.renderBox || defaultBox;

      if (initError) {
        return {
          elementId: element.id,
          type: element.type,
          box: renderBox,
          content: (
            <div className="likbez-error">
              <strong>Siglum initialization error:</strong>
              <pre>{initError}</pre>
            </div>
          ),
        };
      }

      if (!initialized || !compiler) {
        return {
          elementId: element.id,
          type: element.type,
          box: renderBox,
          content: (
            <div className="likbez-loading">
              Initializing Siglum...
            </div>
          ),
        };
      }

      logs.length = 0;

      const latexSource = element.rawContent;

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
              <div className="likbez-error">
                No result from compiler
              </div>
            ),
          };
        }

        if (result.success && result.pdf) {
          const pdfBuffer = result.pdfIsShared
            ? new Uint8Array(result.pdf).slice()
            : new Uint8Array(result.pdf);

          if (pdftocairo) {
            try {
              pdftocairo.FS.writeFile('input.pdf', pdfBuffer);
              pdftocairo._convertPdfToSvg();
              const svg = pdftocairo.FS.readFile('input.svg', { encoding: 'utf8' });
              pdftocairo.FS.unlink('input.pdf');
              pdftocairo.FS.unlink('input.svg');

              return {
                elementId: element.id,
                type: element.type,
                box: renderBox,
                content: (
                  <div className="likbez-siglum" dangerouslySetInnerHTML={{ __html: svg }} />
                ),
              };
            } catch (svgError) {
              console.error('[LIKBEZ] PDF→SVG conversion failed:', svgError);
            }
          }

          const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          urlStore.add(url);

          return {
            elementId: element.id,
            type: element.type,
            box: renderBox,
            content: (
              <div className="likbez-siglum">
                <object
                  data={url}
                  type="application/pdf"
                  width="100%"
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
            <div className="likbez-error">
              <strong>LaTeX Error:</strong>
              <pre>{errorText}</pre>
            </div>
          ),
        };
      } catch (error) {
        return {
          elementId: element.id,
          type: element.type,
          box: renderBox,
          content: (
            <div className="likbez-error">
              <strong>Compilation error:</strong>
              <pre>{String(error)}</pre>
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
      pendingInitCleanup?.();
      pendingInitCleanup = null;
      for (const url of urlStore) {
        URL.revokeObjectURL(url);
      }
      urlStore.clear();
      logs.length = 0;
      initError = null;
      if (compiler) {
        compiler.terminate?.();
        compiler = null;
      }
      initialized = false;
    },
  };
};
