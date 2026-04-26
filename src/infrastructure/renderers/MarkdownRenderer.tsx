import katex from 'katex';
import React from 'react';
import { ContentElement, RenderBox } from '../../domain/entities/Document';
import { MarkdownRendererConfig, RendererOutput } from '../../domain/interfaces/IRenderer';

export interface MarkdownRenderer {
  render: (element: ContentElement, config?: MarkdownRendererConfig) => RendererOutput;
}

const renderMarkdownToHtml = (text: string): string => {
  let html = text;

  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
    try {
      const katexHtml = katex.renderToString(formula.trim(), {
        displayMode: true,
        throwOnError: false,
      });
      return `<div class="katex-display">${katexHtml}</div>`;
    } catch (e) {
      return `<span style="color:#cc0000">KaTeX Error: ${e}</span>`;
    }
  });

  html = html.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
    try {
      return katex.renderToString(formula.trim(), {
        displayMode: false,
        throwOnError: false,
      });
    } catch (e) {
      return `<span style="color:#cc0000">KaTeX Error: ${e}</span>`;
    }
  });

  html = html.replace(/\n/g, '<br>');

  return html;
};

export const createMarkdownRenderer = (defaultBox: RenderBox): MarkdownRenderer => {
  return {
    render: (element: ContentElement, config?: MarkdownRendererConfig): RendererOutput => {
      const renderBox = element.renderBox || defaultBox;

      const html = renderMarkdownToHtml(element.rawContent);

      return {
        elementId: element.id,
        type: element.type,
        box: renderBox,
        content: (
          <div
            className="likbez-markdown-katex"
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
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        ),
      };
    },
  };
};