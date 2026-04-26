import { useState, useCallback, useMemo, useEffect } from 'react';
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
  parse: (source: string) => ParsedDocument;
}

export const useLikbezText = (options?: UseLikbezTextOptions): UseLikbezTextReturn => {
  const [source, setSourceState] = useState(options?.initialSource || '');
  const [isReady, setIsReady] = useState(true);
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
    setIsLoading(true);
    setSourceState(newSource);
    setTimeout(() => setIsLoading(false), 0);
  }, []);

  const parse = useCallback((newSource: string): ParsedDocument => {
    setIsLoading(true);
    try {
      const result = parserFn(newSource);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      console.error('Parse error:', error);
      return { elements: [] };
    }
  }, [parserFn]);

  return {
    source,
    setSource,
    parsedDocument,
    isReady,
    isLoading,
    parse,
  };
};

export type { ParserOptions, CustomElementConfig, RenderBox, ParsedDocument };