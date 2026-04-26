import { ContentElement, RenderBox } from '../entities/Document';

export interface RenderResult {
  element: ContentElement;
  content: React.ReactNode;
}

export interface CustomElementConfig {
  type: string;
  pattern: RegExp;
  parse: (match: RegExpMatchArray) => Partial<ContentElement>;
  render?: (element: ContentElement) => React.ReactNode;
}

export interface MarkdownRendererConfig {
  remarkPlugins?: any[];
  rehypePlugins?: any[];
}

export interface KaTeXRendererConfig {
  displayMode?: boolean;
  throwOnError?: boolean;
  errorColor?: string;
  macros?: Record<string, string>;
  strict?: boolean | string | Function;
  trust?: boolean | Function;
}

export interface SiglumRendererConfig {
  engine?: 'pdflatex' | 'xelatex' | 'auto';
  bundlesUrl?: string;
  wasmUrl?: string;
  workerUrl?: string;
  ctanProxyUrl?: string;
  onLog?: (msg: string) => void;
  onProgress?: (stage: string, detail: any) => void;
}

export interface BoxRendererConfig {
  defaultBox: RenderBox;
  customBoxes?: Record<string, RenderBox>;
}

export interface RendererConfig {
  markdown?: MarkdownRendererConfig;
  katex?: KaTeXRendererConfig;
  siglum?: SiglumRendererConfig;
  box?: BoxRendererConfig;
  customElements?: CustomElementConfig[];
}

export interface RendererOutput {
  elementId: string;
  type: string;
  box: RenderBox;
  content: React.ReactNode;
}

export type RendererFactory = (
  config: RendererConfig
) => (element: ContentElement) => Promise<RendererOutput> | RendererOutput;