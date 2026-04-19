import katex from 'katex';
import { ContentElement, RenderBox } from '../../domain/entities/Document';
import { KaTeXRendererConfig, RendererOutput } from '../../domain/interfaces/IRenderer';

export interface KaTeXRenderer {
  render: (element: ContentElement, config?: KaTeXRendererConfig) => RendererOutput;
}

export const createKaTeXRenderer = (defaultBox: RenderBox): KaTeXRenderer => {
  return {
    render: (element: ContentElement, config?: KaTeXRendererConfig): RendererOutput => {
      let html: string;
      
      try {
        html = katex.renderToString(element.rawContent, {
          displayMode: config?.displayMode ?? element.rawContent.includes('\\') || element.rawContent.includes('\\begin'),
          throwOnError: config?.throwOnError ?? false,
          errorColor: config?.errorColor ?? '#cc0000',
          macros: config?.macros ?? {},
          strict: config?.strict ?? false,
          trust: config?.trust ?? false,
        });
      } catch (error) {
        html = `<span style="color: ${config?.errorColor ?? '#cc0000'}">KaTeX Error: ${error}</span>`;
      }

      const renderBox = element.renderBox || defaultBox;

      return {
        elementId: element.id,
        type: element.type,
        box: renderBox,
        content: <div 
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
          dangerouslySetInnerHTML={{ __html: html }}
        />,
      };
    },
  };
};