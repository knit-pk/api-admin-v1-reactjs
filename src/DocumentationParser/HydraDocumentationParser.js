
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { LongTextInput, ImageField } from 'admin-on-rest';
import { Field } from 'redux-form';
import parseHydraDocumentation from '@api-platform/api-doc-parser/lib/hydra/parseHydraDocumentation';
import { resolveUser } from '../Client/RestClient';
import { storeHydraDocs, havingHydraDocs } from '../Storage/HydraDocs';


function parseHydraDocumentationForUser(jsonldEntrypoint) {
  return resolveUser().then(({ authenticated, token }) => {
    const headers = {};
    if (authenticated) {
      headers.authorization = token;
    }
    return new Headers(headers);
  }).then(headers => parseHydraDocumentation(jsonldEntrypoint, { headers }))
    .then(({ api }) => {
      storeHydraDocs(api);
      return { api };
    });
}

function parseHydraDocumentationCached(jsonldEntrypoint) {
  return havingHydraDocs(api => new Promise(resolve => resolve({ api })), parseHydraDocumentationForUser(jsonldEntrypoint))
    .then(({ api }) => {
      const articles = api.resources.find(({ name }) => name === 'articles');
      const content = articles.fields.find(f => f.name === 'content');

      // eslint-disable-next-line
      content.field = props => {
        if (props.options.action === 'list') { // eslint-disable-line
          return null;
        }
        return (<ReactMarkdown {...props} source={props.record.content} />); // eslint-disable-line
      };

      // eslint-disable-next-line
      content.input = props => (
        <Field name="content" component={LongTextInput} label="Content" source="content" />
      );

      const images = api.resources.find(({ name }) => name === 'images');
      const url = images.fields.find(f => f.name === 'url');

      // eslint-disable-next-line
      url.field = props => (
        <ImageField {...props} source="url" title="image" />
      );

      return { api };
    });
}

export default parseHydraDocumentationCached;
