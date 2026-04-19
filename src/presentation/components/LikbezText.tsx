import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  ContentElement, 
  ParsedDocument, 
  RenderBox,
  ParserOptions,
  RendererConfig,
  CustomElementConfig,
} from './domain';
import { createParser, createKaTeXRenderer, createSiglumRenderer, createMarkdownRenderer, createCustomRenderer } from './infrastructure';

export interface LikbezTextProps {
  source: string;
  onSourceChange?: (source: string) => void;
  
  parser?: (source: string) => ParsedDocument;
  parserOptions?: ParserOptions;
  
  rendererConfig?: RendererConfig;
  
  defaultBox?: RenderBox;
  customBoxes?: Record<string, RenderBox>;
  
  customRenderers?: {
    markdown?: (element: ContentElement) => React.ReactNode;
    katex?: (element: ContentElement) => React.ReactNode;
    siglum?: (element: ContentElement) => React.ReactNode;
    custom?: (element: ContentElement, config: CustomElementConfig) => React.ReactNode;
  };
  
  customElements?: CustomElementConfig[];
  
  siglumConfig?: {
    bundlesUrl?: string;
    wasmUrl?: string;
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
    strict?: boolean | string | Function;
    trust?: boolean | Function;
  };
  
  style?: React.CSSProperties;
  className?: string;
}

export const LikbezText: React.FC<LikbezTextProps> = ({
  source,
  onSourceChange,
  parser,
  parserOptions,
  rendererConfig,
  defaultBox,
  customBoxes,
  customRenderers,
  customElements = [],
  siglumConfig,
  katexConfig,
  style,
  className,
}) => {
  const siglumRef = useRef<ReturnType<typeof createSiglumRenderer> | null>(null);
  const [siglumReady, setSiglumReady] = useState(false);
  const [siglumResults, setSiglumResults] = useState<Record<string, React.ReactNode>>({});

  const defaultRenderBox = useMemo<RenderBox>(() => defaultBox || {
    dimensions: { width: 'auto', height: 'auto' },
    style: { padding: 8, borderRadius: 4 },
  }, [defaultBox]);

  const parserFn = useMemo(() => parser || createParser({ customElements }), [parser, customElements]);

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
      siglumRef.current = createSiglumRenderer(defaultRenderBox, () => {
        setSiglumReady(true);
      });
      siglumRef.current.init(siglumConfig).catch(console.error);
    }
  }, [siglumConfig, defaultRenderBox]);

  useEffect(() => {
    const renderSiglumElements = async () => {
      const siglumElements = parsedDocument.elements.filter(e => e.type === 'siglum');
      const results: Record<string, React.ReactNode> = {};

      for (const element of siglumElements) {
        if (siglumRef.current && siglumReady) {
          const output = await siglumRef.current.render(element, {
            engine: rendererConfig?.siglum?.engine,
            bundlesUrl: siglumConfig?.bundlesUrl,
            wasmUrl: siglumConfig?.wasmUrl,
          });
          results[element.id] = output.content;
        } else {
          results[element.id] = (
            <div style={{ 
              padding: 16, 
              backgroundColor: '#f5f5f5', 
              border: '1px dashed #ccc',
              color: '#666',
            }}>
              Loading Siglum...
            </div>
          );
        }
      }

      setSiglumResults(results);
    };

    renderSiglumElements();
  }, [parsedDocument, siglumReady, siglumConfig, rendererConfig?.siglum]);

  const getElementBox = useCallback((element: ContentElement): RenderBox => {
    const customType = element.metadata?.customType as string;
    if (customType && customBoxes?.[customType]) {
      return customBoxes[customType];
    }
    return element.renderBox || defaultRenderBox;
  }, [customBoxes, defaultRenderBox]);

  const renderElement = useCallback((element: ContentElement): React.ReactNode => {
    const box = getElementBox(element);

    if (customRenderers?.markdown && element.type === 'markdown') {
      return customRenderers.markdown(element);
    }
    if (customRenderers?.katex && element.type === 'katex') {
      return customRenderers.katex(element);
    }
    if (customRenderers?.siglum && element.type === 'siglum') {
      return customRenderers.siglum(element);
    }
    if (customRenderers?.custom && element.type === 'custom') {
      return customRenderers.custom(element, customElements.find(c => c.type === element.metadata?.customType)!);
    }

    switch (element.type) {
      case 'markdown': {
        const mdRenderer = createMarkdownRenderer(defaultRenderBox);
        const output = mdRenderer.render(element, rendererConfig?.markdown);
        return output.content;
      }
      case 'katex': {
        const katexRenderer = createKaTeXRenderer(defaultRenderBox);
        const output = katexRenderer.render(element, katexConfig);
        return output.content;
      }
      case 'siglum': {
        return siglumResults[element.id] || (
          <div style={{ 
            padding: 16, 
            backgroundColor: '#f5f5f5', 
            border: '1px dashed #ccc',
            color: '#666',
          }}>
            Loading Siglum...
          </div>
        );
      }
      case 'custom': {
        const customRenderer = createCustomRenderer(defaultRenderBox);
        const output = customRenderer.render(element, customElements);
        return output.content;
      }
      default:
        return <div>Unknown type: {element.type}</div>;
    }
  }, [customRenderers, customElements, defaultRenderBox, katexConfig, rendererConfig, siglumResults, getElementBox]);

  return (
    <div 
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        ...style,
      }}
    >
      <div className="likbez-text-content">
        {parsedDocument.elements.map((element) => (
          <div
            key={element.id}
            style={{
              marginBottom: 8,
            }}
          >
            {renderElement(element)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikbezText;