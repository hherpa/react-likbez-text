import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  const siglumRendererRef = useRef<ReturnType<typeof createSiglumRenderer> | null>(null);
  const siglumResultsRef = useRef<Record<string, React.ReactNode>>({});
  const [siglumResultsMap, setSiglumResultsMap] = useState<Record<string, React.ReactNode>>({});
  const siglumIdsRef = useRef<Set<string>>(new Set());
  const abortControllerRef = useRef<AbortController | null>(null);

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
      siglumRendererRef.current = renderer;
      renderer.init(siglumConfig).catch(console.error);
    }
    return () => {
      siglumRendererRef.current?.destroy();
      siglumRendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!siglumReady || !siglumRendererRef.current) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const renderer = siglumRendererRef.current;
    const currentResults: Record<string, React.ReactNode> = {};
    const currentIds = new Set<string>();

    const renderSiglumElements = async () => {
      const siglumElements = parsedDocument.elements.filter((e: ContentElement) => e.type === 'siglum');

      for (const element of siglumElements) {
        if (abortControllerRef.current?.signal.aborted) return;
        currentIds.add(element.id);
        const output = await renderer.render(element, siglumConfig);
        if (abortControllerRef.current?.signal.aborted) return;
        currentResults[element.id] = output.content;
      }

      siglumResultsRef.current = currentResults;
      siglumIdsRef.current = currentIds;
      setSiglumResultsMap({ ...currentResults });
    };

    renderSiglumElements();
  }, [parsedDocument.elements, siglumReady, siglumConfig]);

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
        return siglumResultsMap[element.id] || (
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
  }, [renderBox, katexConfig, siglumResultsMap, customElements]);

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