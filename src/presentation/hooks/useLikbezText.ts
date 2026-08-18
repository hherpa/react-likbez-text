import { useState, useCallback } from 'react';

export interface UseLikbezTextOptions {
  initialSource?: string;
}

export interface UseLikbezTextReturn {
  source: string;
  setSource: (source: string) => void;
  isLoading: boolean;
}

export const useLikbezText = (options?: UseLikbezTextOptions): UseLikbezTextReturn => {
  const [source, setSourceState] = useState(options?.initialSource || '');
  const [isLoading, setIsLoading] = useState(false);

  const setSource = useCallback((newSource: string) => {
    setIsLoading(true);
    setSourceState(newSource);
    setTimeout(() => setIsLoading(false), 0);
  }, []);

  return { source, setSource, isLoading };
};