import { useState, useCallback, useMemo } from 'react';
import { ParsedDocument, RenderBox } from '../../domain/entities/Document';
import { CustomElementConfig } from '../../domain/interfaces/IRenderer';
import { ParserOptions } from '../../domain/interfaces/IParser';
import { createParser } from '../../infrastructure/parsers/UnifiedParser';

export interface UseLikbezTextOptions {
  initialSource?: string;
  parserOptions?: ParserOptions;
  customElements?: CustomElementConfig[];
}

export interface UseLikbezTextReturn {
  source: string;
  setSource: (source: string) => void;
  parsedDocument: ParsedDocument;
  isReady: boolean;
  isLoading: boolean;
}

export const useLikbezText = (options?: UseLikbezTextOptions): UseLikbezTextReturn => {
  const [source, setSourceState] = useState(options?.initialSource || '');
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const parserFn = useMemo(
    () => createParser({ customElements: options?.customElements }),
    [options?.customElements]
  );

  const parsedDocument = useMemo<ParsedDocument>(() => {
    try {
      return parserFn(source);
    } catch (error) {
      console.error('Parse error:', error);
      return { elements: [] };
    }
  }, [source, parserFn]);

  const setSource = useCallback((newSource: string) => {
    setSourceState(newSource);
  }, []);

  return {
    source,
    setSource,
    parsedDocument,
    isReady,
    isLoading,
  };
};

export type { ParserOptions, CustomElementConfig, RenderBox, ParsedDocument };