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

    const tokenPositions: { start: number; end: number; element: ContentElement }[] = [];

    const siglumRegex = /\{siglum\}([\s\S]*?)\{\/siglum\}/g;
    let match;
    while ((match = siglumRegex.exec(source)) !== null) {
      tokenPositions.push({
        start: match.index,
        end: match.index + match[0].length,
        element: {
          id: generateId(),
          type: 'siglum',
          rawContent: match[1].trim(),
          renderBox: { ...defaultRenderBox },
        },
      });
    }

    const katexDisplayRegex = /\$\$([^\$]+?)\$\$/g;
    while ((match = katexDisplayRegex.exec(source)) !== null) {
      tokenPositions.push({
        start: match.index,
        end: match.index + match[0].length,
        element: {
          id: generateId(),
          type: 'katex',
          rawContent: match[1].trim(),
          renderBox: { ...defaultRenderBox },
          metadata: { displayMode: true },
        },
      });
    }

    const katexInlineRegex = /\$([^\$\n]+?)\$/g;
    while ((match = katexInlineRegex.exec(source)) !== null) {
      tokenPositions.push({
        start: match.index,
        end: match.index + match[0].length,
        element: {
          id: generateId(),
          type: 'katex',
          rawContent: match[1].trim(),
          renderBox: { ...defaultRenderBox },
          metadata: { displayMode: false },
        },
      });
    }

    if (options?.customElements) {
      for (const custom of options.customElements) {
        const customRegex = new RegExp(custom.pattern.source, custom.pattern.flags);
        while ((match = customRegex.exec(source)) !== null) {
          const parsed = custom.parse(match);
          tokenPositions.push({
            start: match.index,
            end: match.index + match[0].length,
            element: {
              id: generateId(),
              type: 'custom',
              rawContent: parsed.rawContent || match[0],
              renderBox: { ...defaultRenderBox },
              metadata: { ...parsed.metadata, customType: custom.type },
            },
          });
        }
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