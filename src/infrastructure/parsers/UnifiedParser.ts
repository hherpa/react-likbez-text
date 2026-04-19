import { ContentElement, ParsedDocument, RenderBox } from '../../domain/entities/Document';
import { ParserOptions, ParserFactory } from '../../domain/interfaces/IParser';

let elementIdCounter = 0;

const generateId = () => `elem_${++elementIdCounter}_${Date.now()}`;

const defaultRenderBox: RenderBox = {
  dimensions: { width: 'auto', height: 'auto' },
  style: {
    padding: 8,
    borderRadius: 4,
  },
};

const createParser: ParserFactory = (options?: ParserOptions) => {
  return (source: string): ParsedDocument => {
    const elements: ContentElement[] = [];
    
    const patterns = [
      {
        type: 'siglum' as const,
        regex: /\$\$([\s\S]*?)\$\$/g,
        parseMatch: (match: RegExpMatchArray) => ({
          type: 'siglum' as const,
          rawContent: match[1].trim(),
        }),
      },
      {
        type: 'katex' as const,
        regex: /\$([^\$\n]+?)\$/g,
        parseMatch: (match: RegExpMatchArray) => ({
          type: 'katex' as const,
          rawContent: match[1].trim(),
        }),
      },
    ];

    if (options?.customElements) {
      for (const custom of options.customElements) {
        patterns.push({
          type: 'custom' as const,
          regex: custom.pattern,
          parseMatch: custom.parse,
        });
      }
    }

    const tokenPositions: { start: number; end: number; element: ContentElement }[] = [];

    for (const pattern of patterns) {
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
      let match;
      
      while ((match = regex.exec(source)) !== null) {
        const parsed = pattern.parseMatch(match);
        
        const element: ContentElement = {
          id: generateId(),
          type: parsed.type || pattern.type,
          rawContent: parsed.rawContent || match[0],
          renderBox: { ...defaultRenderBox },
          metadata: parsed.metadata,
        };
        
        tokenPositions.push({
          start: match.index,
          end: match.index + match[0].length,
          element,
        });
      }
    }

    tokenPositions.sort((a, b) => a.start - b.start);

    const usedPositions: boolean[] = new Array(source.length).fill(false);
    
    for (const token of tokenPositions) {
      for (let i = token.start; i < token.end; i++) {
        if (usedPositions[i]) {
          token.element = null as any;
          break;
        }
      }
      if (token.element) {
        for (let i = token.start; i < token.end; i++) {
          usedPositions[i] = true;
        }
      }
    }

    const filteredTokens = tokenPositions.filter(t => t.element !== null);

    let lastEnd = 0;
    
    for (const token of filteredTokens) {
      if (token.start > lastEnd) {
        const textContent = source.slice(lastEnd, token.start).trim();
        if (textContent) {
          elements.push({
            id: generateId(),
            type: 'markdown',
            rawContent: textContent,
            renderBox: { ...defaultRenderBox },
          });
        }
      }
      
      elements.push(token.element);
      lastEnd = token.end;
    }
    
    if (lastEnd < source.length) {
      const remainingText = source.slice(lastEnd).trim();
      if (remainingText) {
        elements.push({
          id: generateId(),
          type: 'markdown',
          rawContent: remainingText,
          renderBox: { ...defaultRenderBox },
        });
      }
    }

    return { elements };
  };
};

export const parserFactory = createParser;
export { createParser };