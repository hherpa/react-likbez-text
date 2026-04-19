import { ContentElement, RenderBox } from '../../domain/entities/Document';
import { CustomElementConfig, RendererOutput } from '../../domain/interfaces/IRenderer';

export interface CustomRenderer {
  render: (element: ContentElement, customConfigs: CustomElementConfig[]) => RendererOutput;
}

export const createCustomRenderer = (defaultBox: RenderBox): CustomRenderer => {
  return {
    render: (element: ContentElement, customConfigs: CustomElementConfig[]): RendererOutput => {
      const config = customConfigs.find(c => c.type === element.metadata?.customType);
      const renderBox = element.renderBox || defaultBox;

      if (!config) {
        return {
          elementId: element.id,
          type: element.type,
          box: renderBox,
          content: (
            <div style={{ 
              ...renderBox.style,
              padding: 8,
              backgroundColor: '#fff3e0',
              border: '1px solid #ffb74d',
            }}>
              Unknown custom element: {element.metadata?.customType}
            </div>
          ),
        };
      }

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
            {element.metadata?.renderedContent as React.ReactNode}
          </div>
        ),
      };
    },
  };
};