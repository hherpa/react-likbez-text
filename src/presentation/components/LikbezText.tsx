import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ContentElement, ParsedDocument, RenderBox } from '../../domain/entities/Document';
import { ParserOptions } from '../../domain/interfaces/IParser';
import { createParser, createSiglumRenderer, createMarkdownRenderer, createCustomRenderer } from '../../infrastructure';

const EMPTY_CUSTOM_ELEMENTS: ParserOptions['customElements'] = [];

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
  customElements = EMPTY_CUSTOM_ELEMENTS,
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

  console.log('[LIKBEZ] source length:', source?.length, 'elements:', parsedDocument?.elements?.length);

  useEffect(() => {
    if (siglumConfig?.autoInit !== false) {
      const renderer = createSiglumRenderer(renderBox);
      siglumRendererRef.current = renderer;
      renderer.init(siglumConfig).then(() => {
        console.log('[LIKBEZ] siglum init resolved');
        setSiglumReady(true);
      }).catch((e) => {
        console.error('[LIKBEZ] siglum init error:', e);
      });
    }
    return () => {
      siglumRendererRef.current?.destroy();
      siglumRendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    console.log('[LIKBEZ] siglum effect: siglumReady=', siglumReady, 'rendererRef=', !!siglumRendererRef.current);
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
      console.log('[LIKBEZ] siglum results:', Object.keys(currentResults).map(k => ({ id: k, type: typeof currentResults[k], isElement: React.isValidElement(currentResults[k]) })));
      setSiglumResultsMap({ ...currentResults });
      setTimeout(() => {
        const objectTag = document.querySelector('.likbez-text object') as HTMLObjectElement;
        if (objectTag) {
          console.log('[LIKBEZ] object offsetWidth:', objectTag.offsetWidth, 'offsetHeight:', objectTag.offsetHeight);
          console.log('[LIKBEZ] object style:', objectTag.getAttribute('style'));
          const dataUrl = objectTag.getAttribute('data');
          if (dataUrl && dataUrl.startsWith('blob:')) {
            fetch(dataUrl).then(r => r.blob()).then(blob => {
              console.log('[LIKBEZ] PDF blob size:', blob.size, 'bytes, type:', blob.type);
            }).catch(e => console.error('[LIKBEZ] blob fetch error:', e));
          }
          objectTag.onload = () => console.log('[LIKBEZ] object loaded successfully');
          objectTag.onerror = (e) => console.error('[LIKBEZ] object error:', e);
        }
      }, 1500);
    };

    renderSiglumElements();
  }, [source, siglumReady, siglumConfig]);

  const renderElement = useCallback((element: ContentElement): React.ReactNode => {
    const box = element.renderBox || renderBox;

    console.log('[LIKBEZ] renderElement:', element.type, element.id);

    switch (element.type) {
      case 'markdown-katex': {
        const mdRenderer = createMarkdownRenderer(renderBox);
        const result = mdRenderer.render(element, { remarkPlugins: [], rehypePlugins: [] });
        console.log('[LIKBEZ] markdown result:', typeof result.content);
        return result.content;
      }
      case 'siglum': {
        const siglumResult = siglumResultsMap[element.id];
        if (siglumResult && React.isValidElement(siglumResult)) {
          const props = siglumResult.props;
          const childCount = React.Children.count(siglumResult);
          console.log('[LIKBEZ] siglum element: type=', String(siglumResult.type), 'childCount=', childCount, 'propsKeys=', Object.keys(props || {}));
          if (props.children) {
            console.log('[LIKBEZ] siglum children type:', typeof props.children, React.isValidElement(props.children) ? 'React element' : 'not element');
            if (React.isValidElement(props.children)) {
              console.log('[LIKBEZ] siglum child type:', String(props.children.type), 'props:', JSON.stringify(props.children.props, (k, v) => typeof v === 'function' ? '[fn]' : typeof v === 'object' && v !== null ? '[obj]' : v));
            }
          }
        } else {
          console.log('[LIKBEZ] siglum no result yet');
        }
        return siglumResult || (
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
  }, [renderBox, customElements, siglumResultsMap]);

  return (
    <div className={`likbez-text ${className || ''}`} style={style}>
      {parsedDocument.elements.map((element: ContentElement) => (
        <div key={element.id} style={{ marginBottom: 8 }}>
          {renderElement(element)}
        </div>
      ))}
    </div>
  );
};

export default LikbezText;