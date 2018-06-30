import * as React from 'react';
import markdownRenderer from '../Services/MarkdownRenderer';

function renderHTML(source) {
  return { __html: markdownRenderer.render(source) };
}

export default ({ source }) => (
  <div
    className="markdown-body"
    // eslint-disable-next-line
    dangerouslySetInnerHTML={renderHTML(source)}
  />
);
