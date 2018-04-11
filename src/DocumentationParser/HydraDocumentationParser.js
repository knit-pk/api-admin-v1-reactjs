
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { LongTextInput, ImageField, FunctionField, ImageInput } from 'admin-on-rest';
import { Field } from 'redux-form';
import parseHydraDocumentation from '@api-platform/api-doc-parser/lib/hydra/parseHydraDocumentation';
import { resolveUser } from '../Client/RestClient';
import { storeHydraDocs, havingHydraDocs } from '../Storage/HydraDocs';
import { SCHEMA_ID_IMAGE_OBJECT, SCHEMA_ID_CONTENT_URL } from './SchemaOrg';
import generateUrl from '../Services/UrlGenerator';


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

      // render images
      api.resources.map((resource) => {
        if (resource.id === SCHEMA_ID_IMAGE_OBJECT) {
          resource.fields.map((field) => {
            if (field.id === SCHEMA_ID_CONTENT_URL) {
              // eslint-disable-next-line
              field.denormalizeData = value => {
                return {
                  src: value,
                };
              };

              // eslint-disable-next-line
              field.field = props => (
                <FunctionField
                  {...props}
                  key={field.name}
                  render={record => (
                    <ImageField key={field.name} source={`${field.name}.src`} record={record} title="image" />
                  )}
                  source={field.name}
                />
              );

              // eslint-disable-next-line
              field.input = props => (
                <ImageInput {...props} accept="image/*" multiple={false} source={field.name}>
                  <ImageField {...props} source={field.name} title="image" />
                </ImageInput>
              );

              // eslint-disable-next-line
              field.input.defaultProps = {
                addField: true,
              };

              // eslint-disable-next-line
              field.normalizeData = (value) => {
                if (value[0] && value[0].rawFile instanceof File) {
                  const body = new FormData();
                  body.append('image', value[0].rawFile);

                  return resolveUser().then(({ authenticated, token }) => {
                    if (!authenticated) {
                      throw Error('User is not authenticated');
                    }

                    return fetch(generateUrl('images/upload'), {
                      body,
                      headers: new Headers({ authorization: token }),
                      method: 'POST',
                    }).then(response => response.json()).then(data => data.url);
                  });
                }

                return value.src;
              };
            }

            return field;
          });
        }

        return resource;
      });

      return { api };
    });
}

export default parseHydraDocumentationCached;
