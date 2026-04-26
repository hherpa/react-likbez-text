import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ContentElement, ParsedDocument, RenderBox } from '../../domain/entities/Document';
import { ParserOptions } from '../../domain/interfaces/IParser';
import { createParser, createKaTeXRenderer, createSiglumRenderer, createMarkdownRenderer, createCustomRenderer } from '../../infrastructure';

export interface LikbezTextProps {
  source: string;
  
  parserOptions?: ParserOptions;
  
  defaultBox?: RenderBox;
  customBoxes?: Record<string, RenderBox>;
  
  customElements?: Array<{
    type: string;
    pattern: RegExp;
    parse: (match: RegExpMatchArray) => Partial<ContentElement>;
  }>;
  
  siglumConfig?: {
    bundlesUrl?: string;
    wasmUrl?: string;
    workerUrl?: string;
    ctanProxyUrl?: string;
    onLog?: (msg: string) => void;
    onProgress?: (stage: string, detail: any) => void;
    autoInit?: boolean;
  };
  
  katexConfig?: {
    displayMode?: boolean;
    throwOnError?: boolean;
    errorColor?: string;
    macros?: Record<string, string>;
  };
  
  style?: React.CSSProperties;
  className?: string;
}

const defaultRenderBox: RenderBox = {
  dimensions: { width: 'auto', height: 'auto' },
  style: { padding: 8, borderRadius: 4 },
};

export const LikbezText: React.FC<LikbezTextProps> = ({
  source,
  parserOptions,
  defaultBox,
  customBoxes,
  customElements = [],
  siglumConfig,
  katexConfig,
  style,
  className,
}) => {
  const [siglumReady, setSiglumReady] = useState(false);
  const [siglumRenderer, setSiglumRenderer] = useState<ReturnType<typeof createSiglumRenderer> | null>(null);
  const [siglumResults, setSiglumResults] = useState<Record<string, React.ReactNode>>({});

  const renderBox = useMemo(() => defaultBox || defaultRenderBox, [defaultBox]);
  const parserFn = useMemo(() => createParser({ ...parserOptions, customElements }), [parserOptions, customElements]);

  const parsedDocument = useMemo<ParsedDocument>(() => {
    try {
      return parserFn(source);
    } catch (error) {
      console.error('Parse error:', error);
      return { elements: [] };
    }
  }, [source, parserFn]);

  useEffect(() => {
    if (siglumConfig?.autoInit !== false) {
      const renderer = createSiglumRenderer(renderBox, () => setSiglumReady(true));
      setSiglumRenderer(renderer);
      renderer.init(siglumConfig).catch(console.error);
    }
    return () => {
      siglumRenderer?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!siglumReady || !siglumRenderer) return;

    const renderSiglumElements = async () => {
      const siglumElements = parsedDocument.elements.filter((e: ContentElement) => e.type === 'siglum');
      const results: Record<string, React.ReactNode> = {};

      for (const element of siglumElements) {
        const output = await siglumRenderer.render(element, siglumConfig);
        results[element.id] = output.content;
      }

      setSiglumResults(results);
    };

    renderSiglumElements();
  }, [parsedDocument, siglumReady, siglumRenderer, siglumConfig]);

  const renderElement = useCallback((element: ContentElement): React.ReactNode => {
    const box = element.renderBox || renderBox;

    switch (element.type) {
      case 'markdown': {
        const mdRenderer = createMarkdownRenderer(renderBox);
        return mdRenderer.render(element).content;
      }
      case 'katex': {
        const katexRenderer = createKaTeXRenderer(renderBox);
        return katexRenderer.render(element, katexConfig).content;
      }
      case 'siglum': {
        return siglumResults[element.id] || (
          <div style={{ padding: 16, backgroundColor: '#f5f5f5', border: '1px dashed #ccc', color: '#666' }}>
            Loading Siglum...
          </div>
        );
      }
      case 'custom': {
        const customRenderer = createCustomRenderer(renderBox);
        return customRenderer.render(element, customElements).content;
      }
      default:
        return <div>Unknown type: {element.type}</div>;
    }
  }, [renderBox, katexConfig, siglumResults, customElements]);

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 16, ...style }}>
      {parsedDocument.elements.map((element: ContentElement) => (
        <div key={element.id} style={{ marginBottom: 8 }}>
          {renderElement(element)}
        </div>
      ))}
    </div>
  );
};

export default LikbezText;