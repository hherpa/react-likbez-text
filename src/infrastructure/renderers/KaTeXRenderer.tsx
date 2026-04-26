import katex from 'katex';
import { ContentElement, RenderBox } from '../../domain/entities/Document';
import { KaTeXRendererConfig, RendererOutput } from '../../domain/interfaces/IRenderer';

export interface KaTeXRenderer {
  render: (element: ContentElement, config?: KaTeXRendererConfig) => RendererOutput;
}

export const createKaTeXRenderer = (defaultBox: RenderBox): KaTeXRenderer => {
  return {
    render: (element: ContentElement, config?: KaTeXRendererConfig): RendererOutput => {
      if (typeof katex === 'undefined') {
        return {
          elementId: element.id,
          type: element.type,
          box: element.renderBox || defaultBox,
          content: (
            <div style={{
              ...(element.renderBox || defaultBox).style,
              padding: 8,
              backgroundColor: '#fff3e0',
              border: '1px solid #ffb74d',
              color: '#e65100',
            }}>
              KaTeX is not loaded
            </div>
          ),
        };
      }

      let html: string;
      const displayMode = element.metadata?.displayMode === true;

      try {
        html = katex.renderToString(element.rawContent, {
          displayMode,
          throwOnError: false,
          errorColor: config?.errorColor ?? '#cc0000',
          macros: config?.macros ?? {},
          strict: config?.strict as katex.KatexOptions['strict'] ?? false,
          trust: config?.trust as katex.KatexOptions['trust'] ?? false,
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