export interface BoxDimensions {
  width: number | string;
  height: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
}

export interface BoxStyle {
  border?: string;
  borderRadius?: number | string;
  padding?: number | string;
  margin?: number | string;
  backgroundColor?: string;
  boxShadow?: string;
}

export interface RenderBox {
  dimensions: BoxDimensions;
  style?: BoxStyle;
}

export type ContentType = 'markdown-katex' | 'siglum' | 'custom';

export interface ContentElement {
  id: string;
  type: ContentType;
  rawContent: string;
  renderBox: RenderBox;
  metadata?: Record<string, unknown>;
}

export interface ParsedDocument {
  elements: ContentElement[];
  metadata?: Record<string, unknown>;
}