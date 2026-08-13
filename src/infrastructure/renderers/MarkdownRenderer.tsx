import React from 'react';
import { unified, type Processor } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { defaultSchema, type Schema } from 'hast-util-sanitize';
import { ContentElement, RenderBox } from '../../domain/entities/Document';
import { MarkdownRendererConfig, RendererOutput } from '../../domain/interfaces/IRenderer';
export interface MarkdownRenderer {
  render: (element: ContentElement, config?: MarkdownRendererConfig) => RendererOutput;
}

const katexSchema: Schema = {
  ...defaultSchema,
  tagNames: [
    ...defaultSchema.tagNames!,
    'math', 'semantics', 'mrow', 'mi', 'mn', 'mo', 'ms', 'mspace', 'mtext',
    'mphantom', 'mfrac', 'msqrt', 'mroot', 'mstyle', 'msub', 'msup', 'msubsup',
    'mover', 'munder', 'munderover', 'mmultiscripts', 'mprescripts', 'none',
    'mtable', 'mtr', 'mtd', 'menclose', 'merror', 'mfenced', 'annotation',
    'svg', 'path', 'defs',
  ],
  attributes: {
    ...defaultSchema.attributes,
    '*': [
      ...(defaultSchema.attributes!['*'] ?? []),
      'className',
      'ariaHidden',
      'style',
    ],
    annotation: [...(defaultSchema.attributes!['annotation'] ?? []), 'encoding'],
    svg: [
      ...(defaultSchema.attributes!['svg'] ?? []),
      'xmlns', 'viewBox', 'width', 'height', 'focusable', 'role',
      'ariaHidden', 'preserveAspectRatio',
    ],
    path: [
      ...(defaultSchema.attributes!['path'] ?? []),
      'd', 'stroke', 'strokeWidth', 'strokeLinecap', 'strokeLinejoin',
      'fill', 'fillRule', 'clipRule',
    ],
    mspace: [...(defaultSchema.attributes!['mspace'] ?? []), 'width', 'height', 'depth'],
    math: [...(defaultSchema.attributes!['math'] ?? []), 'xmlns', 'display'],
  },
};

type MarkdownProcessor = Processor<any, any, any, any, any>;

const buildProcessor = (config?: MarkdownRendererConfig): MarkdownProcessor => {
  let processor: MarkdownProcessor = unified() as MarkdownProcessor;

  processor = processor.use(remarkParse).use(remarkGfm).use(remarkMath);

  for (const plugin of config?.remarkPlugins ?? []) {
    processor = processor.use(plugin);
  }

  processor = processor
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex, config?.katex as any);

  for (const plugin of config?.rehypePlugins ?? []) {
    processor = processor.use(plugin);
  }

  return processor.use(rehypeSanitize, katexSchema).use(rehypeStringify);
};

export const createMarkdownRenderer = (defaultBox: RenderBox): MarkdownRenderer => {
  let processor: MarkdownProcessor | null = null;
  let configKey = '';

  return {
    render: (element: ContentElement, config?: MarkdownRendererConfig): RendererOutput => {
      const renderBox = element.renderBox || defaultBox;

      const key = JSON.stringify({
        katex: config?.katex ?? null,
        remarkPlugins: config?.remarkPlugins ?? null,
        rehypePlugins: config?.rehypePlugins ?? null,
      });

      if (!processor || key !== configKey) {
        processor = buildProcessor(config);
        configKey = key;
      }

      let html: string;
      try {
        html = String(processor.processSync(element.rawContent));
      } catch (error) {
        html = `<div class="likbez-error"><strong>Markdown error:</strong><pre>${String(error)}</pre></div>`;
      }

      return {
        elementId: element.id,
        type: element.type,
        box: renderBox,
        content: (
          <div className="likbez-markdown">
            <div
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        ),
      };
    },
  };
};
