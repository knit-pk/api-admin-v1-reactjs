
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { LongTextInput, ImageField, ImageInput, TextField, TextInput } from 'admin-on-rest';
import { Field } from 'redux-form';
import parseHydraDocumentation from '@api-platform/api-doc-parser/lib/hydra/parseHydraDocumentation';
import { resolveUser } from '../Client/RestClient';
import { storeHydraDocs, havingHydraDocs } from '../Storage/HydraDocs';
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

function mapBy(key, collection) {
  return Object.assign({}, ...collection.map(item => ({ [item[key]]: item })));
}

function parseHydraDocumentationCached(jsonldEntrypoint) {
  return havingHydraDocs(api => new Promise(resolve => resolve({ api })), parseHydraDocumentationForUser(jsonldEntrypoint))
    .then(({ api }) => {
      const {
        categories,
        articles,
        images,
      } = mapBy('name', api.resources);

      const {
        metadata,
        articlesCount,
      } = mapBy('name', categories.fields);

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
      metadata.field.defaultProps = {
        addLabel: true,
      };

      metadata.input = props => ([
        <Field {...props} key="title" component={TextInput} source="metadata.title" name="metadata.title" label="Metadata title" />,
        <Field {...props} key="description" component={TextInput} source="metadata.description" name="metadata.description" label="Metadata description" />,
      ]);

      const {
        content,
        title,
        commentsCount,
      } = mapBy('name', articles.fields);


      articles.listFields = [title, commentsCount];
      commentsCount.field = props => (<TextField key="commentsCount" source="commentsCount" {...props} />);
      commentsCount.field.defaultProps = {
        addLabel: true,
      };

      content.field = props => (<ReactMarkdown {...props} source={props.record.content} />);
      content.input = props => (
        <Field {...props} name="content" component={LongTextInput} label="Content" source="content" />
      );

      const {
        url,
      } = mapBy('name', images.fields);

      url.field = props => (
        <ImageField {...props} key="url" source="url.src" title="image" />
      );

      url.input = props => (
        <ImageInput {...props} accept="image/*" multiple={false} source="url.src">
          <ImageField {...props} source="url.src" title="image" />
        </ImageInput>
      );
      url.input.defaultProps = {
        addField: true,
      };

      url.denormalizeData = value => ({
        src: value,
      });
      url.normalizeData = (value) => {
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

      return { api };
    });
}

export default parseHydraDocumentationCached;
