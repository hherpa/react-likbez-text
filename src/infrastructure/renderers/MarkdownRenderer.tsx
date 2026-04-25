import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { ContentElement, RenderBox } from '../../domain/entities/Document';
import { MarkdownRendererConfig, RendererOutput } from '../../domain/interfaces/IRenderer';

export interface MarkdownRenderer {
  render: (element: ContentElement, config?: MarkdownRendererConfig) => RendererOutput;
}

export const createMarkdownRenderer = (defaultBox: RenderBox): MarkdownRenderer => {
  return {
    render: (element: ContentElement, config?: MarkdownRendererConfig): RendererOutput => {
      const renderBox = element.renderBox || defaultBox;

      const processor = unified()
        .use(remarkParse)
        .use(remarkRehype, { allowDangerousHtml: false })
        .use(rehypeSanitize)
        .use(rehypeStringify);

      const result = processor.processSync(element.rawContent);

      return {
        elementId: element.id,
        type: element.type,
        box: renderBox,
        content: (
          <div
            style={{
              ...renderBox.style,
              width: renderBox.dimensions.width,
              minWidth: renderBox.dimensions.minWidth,
              maxWidth: renderBox.dimensions.maxWidth,
              height: renderBox.dimensions.height,
              minHeight: renderBox.dimensions.minHeight,
              maxHeight: renderBox.dimensions.maxHeight,
              overflow: 'auto',
            }}
          >
            <div 
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: String(result) }}
            />
          </div>
        ),
      };
    },
  };
};