import { ContentElement, ParsedDocument } from '../entities/Document';

export interface ParserOptions {
  customElements?: {
    type: string;
    pattern: RegExp;
    parse: (match: RegExpMatchArray) => Partial<ContentElement>;
  }[];
}

export type ParserFactory = (options?: ParserOptions) => (source: string) => ParsedDocument;