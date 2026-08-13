import React from 'react';
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

      if (!config || !config.render) {
        return {
          elementId: element.id,
          type: element.type,
          box: renderBox,
          content: (
            <div className="likbez-error">
              Unknown custom element: {String(element.metadata?.customType)}
            </div>
          ),
        };
      }

      return {
        elementId: element.id,
        type: element.type,
        box: renderBox,
        content: (
          <div className="likbez-custom">
            {config.render(element)}
          </div>
        ),
      };
    },
  };
};
