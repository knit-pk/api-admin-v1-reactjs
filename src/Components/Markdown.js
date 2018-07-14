import React from 'react';
import PropTypes from 'prop-types';
import markdownRenderer from '../Services/MarkdownRenderer';

function renderHTML(source) {
  return { __html: markdownRenderer.render(source) };
}

const Markdown = ({ source, record }) => (
  <div
    className="markdown-body"
    // eslint-disable-next-line
    dangerouslySetInnerHTML={renderHTML(record[source])}
  />
);

Markdown.defaultProps = {
  addLabel: true,
  record: {},
};

Markdown.propTypes = {
  addLabel: PropTypes.bool, // eslint-disable-line
  record: PropTypes.object, // eslint-disable-line
  source: PropTypes.string.isRequired,
};

export default Markdown;
