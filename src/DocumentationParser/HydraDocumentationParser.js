
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { LongTextInput, ImageField, FunctionField, ImageInput, TextField, TextInput } from 'admin-on-rest';
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
      const categories = api.resources.find(({ name }) => name === 'categories');
      const metadata = categories.fields.find(({ name }) => name === 'metadata');
      const articlesCount = categories.fields.find(({ name }) => name === 'articlesCount');

      categories.listFields = categories.fields.filter(({ name }) => name !== 'metadata');

      articlesCount.field = props => (<TextField key="articlesCount" source="articlesCount" {...props} />);
      articlesCount.field.defaultProps = {
        addLabel: true,
      };

      metadata.field = props => ([
        <div key="metadata.title"><h5>--title</h5></div>,
        <TextField {...props} key="title" source="metadata.title" label="Metadata title" name="metadata.title" />,
        <div key="metadata.description"><h5>--description</h5></div>,
        <TextField {...props} key="description" source="metadata.description" label="Metadata description" />,
      ]);
      categories.listFields = categories.fields.filter(({ name }) => name !== 'metadata');

      metadata.input = props => ([
        <Field {...props} key="title" component={TextInput} source="metadata.title" name="metadata.title" label="Metadata title" />,
        <Field {...props} key="description" component={TextInput} source="metadata.description" name="metadata.description" label="Metadata description" />,
      ]);

      metadata.field.defaultProps = {
        addLabel: true,
      };

      const articles = api.resources.find(({ name }) => name === 'articles');
      const content = articles.fields.find(({ name }) => name === 'content');
      const title = articles.fields.find(({ name }) => name === 'title');
      const commentsCount = articles.fields.find(({ name }) => name === 'commentsCount');

      commentsCount.field = props => (<TextField key="commentsCount" source="commentsCount" {...props} />);
      commentsCount.field.defaultProps = {
        addLabel: true,
      };

      articles.listFields = [title, commentsCount];

      content.field = props => (<ReactMarkdown {...props} source={props.record.content} />);

      content.input = props => (
        <Field {...props} name="content" component={LongTextInput} label="Content" source="content" />
      );

      api.resources.map((resource) => {
        if (resource.id === SCHEMA_ID_IMAGE_OBJECT) {
          resource.fields.map((field) => {
            if (field.id === SCHEMA_ID_CONTENT_URL) {
              field.denormalizeData = value => ({
                src: value,
              });

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

              field.input = props => (
                <ImageInput {...props} accept="image/*" multiple={false} source={field.name}>
                  <ImageField {...props} source={field.name} title="image" />
                </ImageInput>
              );

              field.input.defaultProps = {
                addField: true,
              };

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
